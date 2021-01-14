const express = require('express')
//if code enters production stage, session will need to change: https://serverjs.io/tutorials/sessions-production/
const session = require('express-session')
var cookieParser = require('cookie-parser');
import {Router, Request, Response, NextFunction} from 'express';
import {fitRec, ftuser} from './code/models';
const app = express()
const port = 3000
const sql = require("mysql");
var bodyParser = require('body-parser');

var records: fitRec[] = [];

var con = sql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "mydb"
});

app.use(cookieParser());
app.use(session({secret: "secretString"}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/static"));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

con.connect(function (err: Error) {
    if(err) console.log(err);
    con.query(`select * from fitnesstracker`, function (err: Error, recordset: any) {
        if(err) console.log(err);
        records = recordset;
    });
});

app.get('/', function(req: Request, res: Response) {
    res.render("main", {fitnessRecords: records});
});

app.get('/table', function(req: Request, res: Response) {
    res.render("table", {fitnessRecords: records});
});

app.get('/chart', function(req: Request, res: Response) {
    res.render("chart", {fitnessRecords: records});
});

app.get('/login', function(req: Request, res: Response) {
    res.render("login");
});

app.post('/results', function(req: Request, res: Response) {
    var date = new Date();
    var sqlReq = `INSERT INTO fitnesstracker (created_at, walking_minutes, pushups, plank_seconds) 
        VALUES ('${date.getFullYear()}-${date.getUTCMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}', 
        '${req.body.walking_minutes}', '${req.body.pushups}', '${req.body.plank_seconds}')`;
    con.query(sqlReq, function (err: Error, result: any) {
        if(err) {throw err};
        console.log("New workout added");
    });
    res.redirect('/');
});

app.post('/registering', function(req: Request, res: Response) {
    var date = new Date();
    var encryptedPW = req.body.password; //This needs to be hashed so it is secure
    var sqlReq = `INSERT INTO ftusers (username, password, created_at, updated_at)
    VALUES ('${req.body.username}', '${encryptedPW}', 
    '${date.getFullYear()}-${date.getUTCMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}',
    '${date.getFullYear()}-${date.getUTCMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}')`;
    con.query(sqlReq, function (err: Error, result: any) {
        if(err) {throw err};
        console.log(`${req.body.username} has been welcomed to the site`)
    });
    res.redirect('/');
})

app.post('/loggingIn', function(req: Request, res: Response) {
    var sqlReq = `SELECT id FROM ftusers WHERE username = ${req.body.username}`;
    con.query(sqlReq, function(err:Error, result: any) {
        if(err) {throw err};
        console.log(`${req.body.username} logged in`);
    });
    res.redirect('/');
})

app.listen(port, function() {
    console.log(`Fitness tracker listening at http://localhost:${port}`)
});