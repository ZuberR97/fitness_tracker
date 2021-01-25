const express = require('express');
//if code enters production stage, session will need to change: https://serverjs.io/tutorials/sessions-production/
const session = require('express-session');
const passwordHash = require('password-hash');
const cookieParser = require('cookie-parser');
const uuid = require('crypto').randomBytes(48).toString('hex');
// import * as Express from 'express';
import {Router, Request, Response, NextFunction} from 'express';
// import * as ExpressSession from 'express-session';
import { MemoryStore, Store } from 'express-session';
import { request } from 'http';
import {fitRec, ftuser} from './code/models';
const app = express()
const port = 3000
const sql = require("mysql");
var bodyParser = require('body-parser');

declare module 'express-session' {
    interface SessionData {
        user: string;
        loggedIn: boolean;
    }
}

var records: fitRec[] = [];

var con = sql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "mydb"
});

app.use(cookieParser());
app.use(session({
    secret: "secretString",
    resave: true,
    saveUninitialized: true
    // cookie: { maxAge: 60000 }
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/static"));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// function getRecords() {
    con.connect(function (err: Error) {
        if(err) console.log(err);
        con.query(`select * from fitnesstracker`, function (err: Error, recordset: any) {
            if(err) console.log(err);
            records = recordset;
        });
    });
// }

app.get('/', function(req: Request, res: Response) {
    if(req.session.loggedIn) {
        res.render("main", {fitnessRecords: records});
    }
    else {
        res.redirect("/login");
    }
});

app.get('/table', function(req: Request, res: Response) {
    if(req.session.loggedIn) {
        res.render("table", {fitnessRecords: records});
    }
    else {
        res.redirect("/login");
    }
});

app.get('/chart', function(req: Request, res: Response) {
    if(req.session.loggedIn) {
        res.render("chart", {fitnessRecords: records});
    }
    else {
        res.redirect("/login");
    }
});

app.get('/login', function(req: Request, res: Response) {
    res.render("login");
});

app.post('/logout', function(req: Request, res: Response) {
    req.session.loggedIn = false;
    req.session.user = '';
    res.redirect('/login');
})

app.post('/results', function(req: Request, res: Response) {
    var date = new Date();
    var sqlReq = `INSERT INTO fitnesstracker (created_at, walking_minutes, pushups, plank_seconds) 
        VALUES ('${date.getFullYear()}-${date.getUTCMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}', 
        '${req.body.walking_minutes}', '${req.body.pushups}', '${req.body.plank_seconds}')`;
    con.query(sqlReq, function (err: Error, result: any) {
        if(err) {throw err}
        console.log("New workout added");
    });
    res.redirect('/');
});

app.post('/registering', async function(req: Request, res: Response) {
    var date = new Date();
    var encryptedPW = passwordHash.generate(`${req.body.password}`);
    var sqlReq = `INSERT INTO ftusers (username, password, created_at, updated_at)
    VALUES ('${req.body.username}', '${encryptedPW}', 
    '${date.getFullYear()}-${date.getUTCMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}',
    '${date.getFullYear()}-${date.getUTCMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}')`;
    con.query(sqlReq, function (err: Error, result: any) {
        if(err) {throw err};
        console.log(`${req.body.username} has been welcomed to the site`)
    });
    var loggedUser = await getResult(req.body.username);
    req.session.loggedIn = true;
    req.session.user = loggedUser[0].id.toString();
    res.redirect('/');
})

function dbQuery(databaseQuery: string): Promise<ftuser[]> {
    return new Promise(data => {
        con.query(databaseQuery, function (err: Error, result: any) {
            if (err) {
                console.log(err);
                throw err;
            }
            try {
                console.log(result);
                data(result);
            } catch (err) {
                throw err;
            }
        });
    });
}

async function getResult(username: string) {
    try {
        return await dbQuery(`SELECT * FROM ftusers WHERE username = '${username}' LIMIT 1`);
    }
    catch(err) {
        throw(err);
    }
}

app.post('/loggingIn', async function(req: Request, res: Response) {
    try {
        var loggedUser = await getResult(req.body.username);
        if (passwordHash.verify(req.body.password, loggedUser[0].password)) {
            console.log(`${req.body.username} logged in`);
            req.session.loggedIn = true;
            req.session.user = loggedUser[0].id.toString();
            res.redirect('/');
        }
        else {
            // var errorMsg = 'Incorrect password, please try again';
            console.log('Incorrect password, please try again');
            res.redirect('/login');
        }
    }
    catch(err) {
        throw(err);
    }
})

app.listen(port, function() {
    console.log(`Fitness tracker listening at http://localhost:${port}`)
});