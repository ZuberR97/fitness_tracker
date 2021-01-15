"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
//if code enters production stage, session will need to change: https://serverjs.io/tutorials/sessions-production/
const session = require('express-session');
const passwordHash = require('password-hash');
const cookieParser = require('cookie-parser');
const uuid = require('crypto').randomBytes(48).toString('hex');
const app = express();
const port = 3000;
const sql = require("mysql");
var bodyParser = require('body-parser');
var records = [];
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
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/static"));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
// function getRecords() {
con.connect(function (err) {
    if (err)
        console.log(err);
    con.query(`select * from fitnesstracker`, function (err, recordset) {
        if (err)
            console.log(err);
        records = recordset;
    });
});
// }
app.get('/', function (req, res) {
    res.render("main", { fitnessRecords: records });
});
app.get('/table', function (req, res) {
    res.render("table", { fitnessRecords: records });
});
app.get('/chart', function (req, res) {
    res.render("chart", { fitnessRecords: records });
});
app.get('/login', function (req, res) {
    res.render("login");
});
app.post('/results', function (req, res) {
    var date = new Date();
    var sqlReq = `INSERT INTO fitnesstracker (created_at, walking_minutes, pushups, plank_seconds) 
        VALUES ('${date.getFullYear()}-${date.getUTCMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}', 
        '${req.body.walking_minutes}', '${req.body.pushups}', '${req.body.plank_seconds}')`;
    con.query(sqlReq, function (err, result) {
        if (err) {
            throw err;
        }
        ;
        console.log("New workout added");
    });
    res.redirect('/');
});
app.post('/registering', function (req, res) {
    var date = new Date();
    var encryptedPW = passwordHash.generate(`${req.body.password}`);
    var sqlReq = `INSERT INTO ftusers (username, password, created_at, updated_at)
    VALUES ('${req.body.username}', '${encryptedPW}', 
    '${date.getFullYear()}-${date.getUTCMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}',
    '${date.getFullYear()}-${date.getUTCMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}')`;
    con.query(sqlReq, function (err, result) {
        if (err) {
            throw err;
        }
        ;
        console.log(`${req.body.username} has been welcomed to the site`);
    });
    res.redirect('/');
});
// async function getUser(username: string): Promise<string> {
//     var sqlReq = `SELECT * FROM ftusers WHERE username = '${username}' LIMIT 1`;
//     var loggedUserPW = '';
//     await con.query(sqlReq, function(err:Error, result: any): string {
//         if(err) {
//             throw err
//         };
//         console.log(result[0].username);
//         return result[0].password;
//     });
//     return loggedUserPW;
// }
function dbQuery(databaseQuery) {
    return new Promise(data => {
        con.query(databaseQuery, function (err, result) {
            if (err) {
                console.log(err);
                throw err;
            }
            try {
                console.log(result);
                data(result);
            }
            catch (err) {
                throw err;
            }
        });
    });
}
async function getResult(username) {
    try {
        return await dbQuery(`SELECT * FROM ftusers WHERE username = '${username}' LIMIT 1`);
    }
    catch (err) {
        throw (err);
    }
}
app.post('/loggingIn', async function (req, res) {
    try {
        var loggedUserPW = await getResult(req.body.username);
        if (passwordHash.verify(req.body.password, loggedUserPW[0].password)) {
            console.log(`${req.body.username} logged in`);
            res.redirect('/');
        }
        else {
            // var errorMsg = 'Incorrect password, please try again';
            console.log('Incorrect password, please try again');
            res.redirect('/login');
        }
    }
    catch (err) {
        throw (err);
    }
});
app.listen(port, function () {
    console.log(`Fitness tracker listening at http://localhost:${port}`);
});
