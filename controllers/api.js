'use strict';

var ApiModel = require('../models/api');


module.exports = function (router) {

    var model = new ApiModel();

    router.all('*', function(req, res, next) {
        console.log('here');
        req.nedb = 'test';
        next();
    });

    router.get('/test', function(req, res) {
            console.log('in route');
            res.status(200).end();
    });

    router.get('/', function (req, res) {


        res.render('api', model);


    });

};
