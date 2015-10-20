'use strict';
var bluebird = require('bluebird');
var datastore = require('nedb');
var nedb = new datastore({
    filename: './temp.db',
    autoload: true
});
nedb = bluebird.promisifyAll(nedb);

module.exports = function() {
    return {
        
    }
}
