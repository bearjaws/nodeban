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
            return self.nedb.insertAsync({
                "boardName": body.boardName,
                "gutters": body.gutters,
                "createdAt": new Date()
            });
        });
    });
};

module.exports = BoardController;
