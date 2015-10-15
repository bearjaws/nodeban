var routes = require('./routes.js');
var Controllers = require('./controllers');

function NodeBan(express, nedb) {
    this.controllers = Controllers(nedb);
    return routes(express, this.controllers);
}

module.exports = NodeBan;
