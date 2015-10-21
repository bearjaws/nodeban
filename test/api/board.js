/*global describe:false, it:false, beforeEach:false, afterEach:false*/

'use strict';


var kraken = require('kraken-js'),
    fs = require('fs'),
    express = require('express'),
    path = require('path'),
    _ = require('lodash'),
    request = require('supertest-as-promised');


describe('api/board', function () {
    var app, mock, db;
    var board = {
        "boardName": "nodeban1",
        "gutters": ["To-Do", "In Progress", "Feature Working", "Integrated", "Complete"]
    };
    beforeEach(function (done) {
        // Pretty random numbers
        var rand = Math.floor(Math.random() * (99999999999 - 0) + 0);
        db = './test/temp/deleteme-api-board' + rand + '.db';
        console.info('Running test in mock database: ' + db);
        process.env['nedb'] = db;
        app = express();
        app.on('start', done);
        app.use(kraken({
            basedir: path.resolve(__dirname, '../../')
        }));

        mock = app.listen(1337);
    });

    afterEach(function (done) {
        if (fs.existsSync(db)) {
            fs.unlink(db, function(err) {
                console.warn(err);
                return mock.close(done);
            });
        } else {
            return mock.close(done);
        }
    });

    it('should recieve 200 when getting root of subresource "board"', function () {
        request(mock)
            .get('/api/board')
            .expect(200);
    });

    it('should get no boards when none have been created', function() {
        request(mock)
            .get('/api/board/list')
            .expect(200)
            .expect([]);
    });

    it('should recieve a 404 when getting a specific board that does not exist', function() {
        request(mock)
            .get('/api/board/invalidBoard')
            .expect(404);
    });

    it('should be able to create a board via POST', function() {
        return request(mock)
            .post('/api/board/create')
            .send(board)
            .expect(200);
    });

    it('should list one board after its creation', function() {
        return request(mock)
            .post('/api/board/create')
            .send(board)
            .expect(200)
            .then(function() {
                return request(mock)
                    .get('/api/board/list')
                    .expect([{
                        name: 'nodeban1'
                    }])
            });
    });

    it('should validate board creation schema', function() {
        var invalidBoard = _.cloneDeep(board);
        invalidBoard.invalid = true;
        return request(mock)
            .post('/api/board/create')
            .send(invalidBoard)
            .expect({
            "code": 400,
            "error": "UserError",
            "message": "JSON validation error",
            "details": [
                {
                    "message": "\"invalid\" is not allowed",
                    "path": ".invalid",
                    "type": "object.allowUnknown",
                    "context": {
                        "key": "invalid"
                    }
                }
            ]
        });
    });

});
