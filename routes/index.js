var express = require('express')
var app = express()

app.get('/', function (req, res) {

	res.render('index', { title: 'INFOSYS SPRING BOARD' })
})


module.exports = app;
