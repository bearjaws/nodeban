'use strict';

var IndexModel = require('../models/index');

module.exports = function (router) {
    router.get('/', function (req, res) {
        res.status(200).end();
    });
};
