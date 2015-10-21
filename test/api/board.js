/*global describe:false, it:false, beforeEach:false, afterEach:false*/

'use strict';


var kraken = require('kraken-js'),
    fs = require('fs'),
    express = require('express'),
    path = require('path'),
    request = require('supertest');


describe('api/board', function () {

    var app, mock;


    beforeEach(function (done) {
        // set the database env
        process.env['nedb'] = './test/temp/api-board.db';
        app = express();
        app.on('start', done);
        app.use(kraken({
            basedir: path.resolve(__dirname, '../../')
        }));

        mock = app.listen(1337);
    });


    afterEach(function (done) {
        fs.unlink(process.env['nedb'], function() {
            mock.close(done);
        })
    });


    it('should get 200 when getting root of subresource "board"', function (done) {
        request(mock)
            .get('/api/board')
            .expect(200)
            .end(function (err, res) {
                done(err);
            });
    });

    it('should get no boards when none have been created', function(done) {
        request(mock)
            .get('/api/board/list')
            .expect(200)
            .expect([])
            .end(function (err, res) {
                done(err);
            });
    });
});
