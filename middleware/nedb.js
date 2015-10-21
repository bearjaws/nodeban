module.exports = function() {
    return function injectNedb(req, res, next) {
        var bluebird = require('bluebird');
        var datastore = require('nedb');
        console.log(process.env['nedb'] );
        var nedb = new datastore({
            filename: process.env['nedb'] || './temp.db',
            autoload: true
        });
        nedb = bluebird.promisifyAll(nedb);
        req.nedb = nedb;
        next();
    }
}
