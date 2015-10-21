module.exports = function() {
    return function injectNedb(req, res, next) {
        console.log('in nedb middleware');
        var bluebird = require('bluebird');
        var datastore = require('nedb');
        var nedb = new datastore({
            filename: './temp.db',
            autoload: true
        });
        nedb = bluebird.promisifyAll(nedb);
        req.nedb = nedb;
        next();
    }
}
