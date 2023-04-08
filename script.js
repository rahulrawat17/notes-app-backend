const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');
var app = express();

//Configuring express server
app.use(bodyparser.json());

// setup cors
var cors = require('cors')
app.use(cors({
    origin: '*'
}));

//MySQL details
var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'test',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('Connection Established Successfully');
    else
        console.log('Connection Failed!' + JSON.stringify(err, undefined, 2));
});

//Establish the server connection
//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));


//Creating GET Router to fetch all the note details from the MySQL Database
app.get('/notes', (req, res) => {
    mysqlConnection.query('SELECT * FROM notes', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Router to GET specific note detail from the MySQL database
app.get('/notes/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM notes WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

var currentdate = new Date();

//Router to INSERT/POST a note's detail
app.post('/notes', (req, res) => {
    let note = req.body;
    var sql = "INSERT INTO notes VALUES (NULL, ?, ?, ?)";
    mysqlConnection.query(sql, [note.title, note.detail, currentdate], (err, rows, fields) => {
        if (!err) {
            res.send({id: rows.insertId, created_date: currentdate});
        }
        else
            console.log(err);
    })
});

//Router to DELETE a note's detail
app.delete('/notes/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM notes WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Note deleted successfully.');
        else
            console.log(err);
    })
});