'use strict';

function BoardModel() {
    this.name = 'board';
}

BoardModel.prototype.create = function(nedb, body, gutters) {
    return nedb.insertAsync({
        'boardName': body.boardName,
        'gutters': gutters,
        'createdAt': new Date()
    });
};

BoardModel.prototype.list = function(nedb) {
    return nedb.findAsync({}, { boardName: 1 });
};

BoardModel.prototype.getByName = function(nedb, name) {
    return nedb.findAsync({boardName: name}).then(function(documents) {
        return documents;
    });
};

module.exports = BoardModel;
