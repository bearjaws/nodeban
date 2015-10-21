'use strict';

var BoardModel = require('../../models/board');
var bluebird = require('bluebird');
var joi = require('joi');
var validate = bluebird.promisify(joi.validate);
var createSchema = joi.object().keys({
    boardName: joi.string().alphanum().min(3).max(24).required(),
    gutters: joi.array().items(joi.string().required()).unique().required()
});

function errorHandler(error, req, res) {
    if(parseInt(error.code) !== 'NaN' && error.code >= 400) {
        res.status(error.code).json(error);
    } else {
        res.status(500).json({
            code: 500,
            error: 'FatalError',
            message: 'An unhandled error has occured.'
        });
        //@TODO log these errors.
    }
}

module.exports = function (router) {

    var boardModel = new BoardModel();

    router.post('/create', function (req, res) {
        var body = req.body;
        // This is the promisified version of joi validation
        return validate(body, createSchema).then(function(result) {
            return boardModel.getByName(req.nedb, body.boardName);
        }).then(function(board) {
            if(board.length !== 0) {
                return bluebird.reject({
                    code: 400,
                    error: 'UserError',
                    message: 'A board with name ' + body.boardName + ' already exists.'
                });
            }
            var gutters = {};
            // Transform the gutters for the board into objects for nedb
            for(var i = 0; i < body.gutters.length; i++) {
                var name = body.gutters[i];
                gutters[name] = {
                    items: [],
                    order: i,
                    name: name
                };
            }
            return boardModel.create(req.nedb, body, gutters);
        }).then(function(status) {
            // nedb will reject into the catch if an error occurs.
            res.status(200).end();
        }).catch(function(error) {
            errorHandler(error, req, res);
        });
    });

    router.get('/list', function(req, res) {
        return boardModel.list(req.nedb).then(function(boards) {
            res.status(200).json(boards);
        }).catch(function(error) {
            errorHandler(error, req, res);
        })
    });

    router.get('/:board', function(req, res) {
        return boardModel.getByName(req.nedb, req.params.board).then(function(board) {
            res.status(200).json(board);
        }).catch(function(error) {
            errorHandler(error, req, res);
        })
    });
};
