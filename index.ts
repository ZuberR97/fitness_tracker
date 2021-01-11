const express = require('express')
import {Router, Request, Response, NextFunction} from 'express';
import {fitRec} from './code/models';
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

app.listen(port, function() {
    console.log(`Fitness tracker listening at http://localhost:${port}`)
});