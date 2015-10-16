var bluebird = require('bluebird');
var joi = require('joi');
var validate = bluebird.promisify(joi.validate);
var createSchema = joi.object().keys({
    name: joi.string().alphanum().min(3).max(128).required()
});

function ItemController(nedb) {
    this.nedb = nedb;
}

ItemController.prototype.createItem = function(boardName, body) {
    return validate(body, createSchema).then(function(result) {
        return self.nedb.findAsync({
            boardName: boardName
        });
    }).then(function(documents) {
        if (documents.length > 0) {
            return bluebird.reject({
                name: "UserError",
                message: "Board does not exist."
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
}

module.exports = ItemController;
