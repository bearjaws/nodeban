module.exports = function() {
    return function injectNedb(req, res, next) {
        var bluebird = require('bluebird');
        var datastore = require('nedb');

        // This is only used for unit tests
        if (process.env['nedb'] === 'inMemory') {
            var nedb = new datastore();
        } else {
            var nedb = new datastore({
                filename: process.env['nedb'] || './temp.db',
                autoload: true
            });
        }
        nedb = bluebird.promisifyAll(nedb);
        nedb.ensureIndex({ fieldName: 'boardName', unique: true });
        req.nedb = nedb;
        next();
    }
}
