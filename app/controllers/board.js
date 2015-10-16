var bluebird = require('bluebird');
var joi = require('joi');
var validate = bluebird.promisify(joi.validate);
var createSchema = joi.object().keys({
    boardName: joi.string().alphanum().min(3).max(24).required(),
    gutters: joi.array().items(joi.string().required()).unique().required()
});

function BoardController(nedb) {
    this.nedb = nedb;
}

BoardController.prototype.createBoard = function(body) {
    var self = this;
    return validate(body, createSchema).then(function(result) {
        return self.nedb.findAsync({
            boardName: body.boardName
        }).then(function(documents) {
            if(documents.length > 0) {
                return bluebird.reject({
                    name: "UserError",
                    message: "Board already exists."
                })
            }
        }).then(function() {
            var gutters = {};
            // Transform the gutters for the board into arrays for nedb
            for(var i = 0; i < body.gutters.length; i++) {
                var name = body.gutters[i];
                gutters[name] = {
                    items: [],
                    order: i,
                    name: name
                };
            }

            return self.nedb.insertAsync({
                "boardName": body.boardName,
                "gutters": gutters,
                "createdAt": new Date()
            });
        });
    });
};

BoardController.prototype.listBoards = function() {
    return this.nedb.findAsync({}, {boardName: 1}).then(function(documents) {
        if(documents.length === 0) {
            return [];
        }
        return documents;
    })
}

BoardController.prototype.getBoardByName = function(name) {
    return this.nedb.findAsync({ boardName: name}).then(function(documents) {
        if(documents.length === 0) {
            return [];
        }
        return documents;
    })
}

module.exports = BoardController;
