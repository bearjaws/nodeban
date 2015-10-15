var BoardController = require('./board.js');

module.exports = function(nedb) {
    var controllers = {};
    controllers.board = new BoardController(nedb);
    return controllers;
}
