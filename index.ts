const express = require('express');
//if code enters production stage, session will need to change: https://serverjs.io/tutorials/sessions-production/
const session = require('express-session');
const passwordHash = require('password-hash');
const cookieParser = require('cookie-parser');
const { body, validationResult } = require('express-validator');
const uuid = require('crypto').randomBytes(48).toString('hex');
// import * as Express from 'express';
import {Router, Request, Response, NextFunction} from 'express';
// import * as ExpressSession from 'express-session';
import { MemoryStore, Store } from 'express-session';
import { readdir } from 'fs';
import { request } from 'http';
import {fitRec, ftuser, fitData} from './code/models';
const app = express()
const port = 3000
const sql = require("mysql");
var bodyParser = require('body-parser');

declare module 'express-session' {
    interface SessionData {
        user: string;
        loggedIn: boolean;
        allFitData: fitData[];
    }
}

var records: fitRec[] = [];
var allFitData: fitData[] = [];

var con = sql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "fitness_tracker"
});

app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: "secretString",
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/static"));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));

function getRecords(userid?: string) {
    con.query(`select * from fitrecords where userid = ${userid}`, function(err: Error, recordset: any) {
        if(err) console.log(err);
        records = recordset;
    });
}

async function getData(req: Request, res: Response) {
    try {
        getRecords(req.session.user);
        var tempArray: fitData[] = [];
        for(var i = 0; i < records.length; i++) {
            await con.query(`select * from fitdatas where fitrecid = ${records[i].id.toString()}`, function(err: Error, dataset: any) {
                if(err) console.log(err);
                tempArray = tempArray.concat(dataset);
                allFitData = tempArray;
                // console.log(`session array: ${allFitData}`);
                // console.log(`in query: ${tempArray}`);
            });
        }
    }
    catch(err) {
        console.log(err);
    }
}

app.get('/', function(req: Request, res: Response) {
    if(req.session.loggedIn) {
        getRecords(req.session.user);
        res.render("main", {fitnessRecords: records});
    }
    else {
        res.redirect("/login");
    }
});

app.get('/test', function(req: Request, res: Response) {
    res.sendFile("test.html", {root: "./views"});
});

app.get('/table', async function(req: Request, res: Response) {
    if(req.session.loggedIn) {
        await getData(req, res);
        // console.log(`session data after function: ${allFitData}`);
        res.render("table", {fitnessRecords: allFitData});
    }
    else {
        res.redirect("/login");
    }
});

app.get('/chart', function(req: Request, res: Response) {
    if(req.session.loggedIn) {
        getRecords(req.session.user);
        res.render("chart", {fitnessRecords: records});
    }
    else {
        res.redirect('/login');
    }
});

app.get('/login', function(req: Request, res: Response) {
    res.render('login');
});

app.post('/logout', function(req: Request, res: Response) {
    req.session.loggedIn = false;
    req.session.user = '';
    res.redirect('/login');
});

app.post('/new_exercise', function(req: Request, res: Response) {
    var date = new Date();
    var sqlReq = `INSERT INTO fitrecords (name, created_at, updated_at, userid) 
        VALUES ('${req.body.name}', 
        '${date.getFullYear()}-${date.getUTCMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}', 
        '${date.getFullYear()}-${date.getUTCMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}',
        '${req.session.user}')`;
    con.query(sqlReq, function (err: Error, result: any) {
        if(err) {throw err}
        console.log("New exercise added");
    });
    res.redirect('/');
});

app.post('/results', /*body('walking_minutes'), body('pushups'), body('plank_seconds'),*/ function(req: Request, res: Response) {
    if(req.session.loggedIn) {
        var date = new Date();
        getRecords(req.session.user);
        // console.log(req.body.amount);
        // console.log(`this is the fitrecid: ${req.body.fitrecid}`);
        // console.log(`count is: ${req.body.count}`);
        for(var i = 0; i < req.body.count; i++) {
            var sqlReq = `INSERT INTO fitdatas (amount, created_at, updated_at, fitrecid) 
                VALUES ('${req.body.amount[i]}', 
                '${date.getFullYear()}-${date.getUTCMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}', 
                '${date.getFullYear()}-${date.getUTCMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}',
                '${req.body.fitrecid[i]}')`;
            con.query(sqlReq, function (err: Error, result: any) {
                if(err) {throw err}
                console.log("New data added");
            });
        }
        res.redirect('/');
    }
    else {
        res.redirect('login')
    }
});

async function matchUsername(username: string) {
    try {
        var userObjStr: string = JSON.stringify(await getResult(username).catch(err => { console.log(err)}));
        var userObjArr = userObjStr.split('"');
        return userObjArr[5];
    }
    catch(err) {
        console.log('This is supposed to happen because the name is unique.')
    }
}

app.post('/registering', 
body('username').isLength({ min: 4, max: 20 }).withMessage('Username must be between 4 and 20 characters long.')
.isAlphanumeric().withMessage('Username must be alphanumeric.'), 
body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long.'), 
async function(req: Request, res: Response) {
    try {
        var errors = validationResult(req);  //https://express-validator.github.io/docs/ 
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        if(await matchUsername(req.body.username) == req.body.username) {
            console.log('Username already exists');
            res.redirect('/login');
            return;
        }
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
        req.session.user = loggedUser![0].id.toString();
        res.redirect('/');
    }
    catch(err) {
        console.log(err);
        Promise.reject(new Error('newName var not working'));
        throw err;
    }
});

function dbQuery(databaseQuery: string): Promise<ftuser[]> {
    return new Promise(data => {
        con.query(databaseQuery, function (err: Error, result: any) {
            if(err) {
                console.log(err);
                return;
            }
            try {
                // console.log(result);
                data(result);
            } catch (err) {
                Promise.reject('could not get data');
                console.log(err);
                return;
            }
        });
    });
}

async function getResult(username: string) {
    try {
        return await dbQuery(`SELECT * FROM ftusers WHERE username = '${username}' LIMIT 1`);
    }
    catch(err) {
        console.log(err);
        return;
    }
}

app.post('/loggingIn', async function(req: Request, res: Response) {
    try {
        if(await matchUsername(req.body.username) != req.body.username) {
            console.log('Username not found, please create an account.');
            res.redirect('/login');
            return;
        }
        var loggedUser = await getResult(req.body.username);
        if (passwordHash.verify(req.body.password, loggedUser![0].password)) {
            console.log(`${req.body.username} logged in`);
            req.session.loggedIn = true;
            req.session.user = loggedUser![0].id.toString();
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
});

app.listen(port, function() {
    console.log(`Fitness tracker listening at http://localhost:${port}`)
});