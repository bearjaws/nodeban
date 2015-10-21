'use strict';

var ApiModel = require('../models/api');


module.exports = function (router) {

    var model = new ApiModel();

    router.get('/', function (req, res) {

        //@TODO Should send apidoc
        res.render('api', model);
    });
};
