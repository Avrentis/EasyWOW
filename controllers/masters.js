var express = require('express');
var router = express.Router(),
    log = require('../utils/logger').getLogger(),
    User = require('../model/User'),
    mastersUtils = require('../utils/masters_utils');

module.exports = router;

router.get('/', function(req, res){

    try{
        mastersUtils.getAll(function (masters) {
            res.render('masters', {
                user: req.session.user,
                User: User,
                masters: masters
            });
        });

    }catch(err){
        log.error('Cannot open order page.\nError: ' + err.stack);
        res.send('Something went wrong ...');
    }
});