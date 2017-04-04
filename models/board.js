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
    return nedb.findAsync({}, { boardName: 1 }).then(function(documents) {
        return documents.map(function(document) {
            return {
                name: document.boardName
            };
        });
    });
};

BoardModel.prototype.getByName = function(nedb, name) {
    return nedb.findAsync({boardName: name}).then(function(documents) {
        if(documents.length > 0) {
            delete documents[0]._id;
            return documents[0];
        }
        return false;
    });
};

module.exports = BoardModel;
