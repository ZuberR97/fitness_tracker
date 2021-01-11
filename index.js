"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/static"));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
con.connect(function (err) {
    if (err)
        console.log(err);
    con.query(`select * from fitnesstracker`, function (err, recordset) {
        if (err)
            console.log(err);
        records = recordset;
    });
});
app.get('/', function (req, res) {
    res.render("main", { fitnessRecords: records });
});
app.get('/table', function (req, res) {
    res.render("table", { fitnessRecords: records });
});
app.get('/chart', function (req, res) {
    res.render("chart", { fitnessRecords: records });
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
app.listen(port, function () {
    console.log(`Fitness tracker listening at http://localhost:${port}`);
});
