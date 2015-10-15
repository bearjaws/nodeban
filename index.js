var bodyParser = require('body-parser')
var bluebird = require('bluebird');
var express = require('express');
var app = express();
// Only process JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var nedb = require('nedb');
var database = new nedb({
    filename: './temp.db',
    autoload: true
});
var promisified = bluebird.promisifyAll(database);

var nodeban = require('./app/index.js')(app, promisified);
var server = app.listen(9000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
