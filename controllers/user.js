var express = require('express');
var router = express.Router(),
    userUtils = require('../utils/user_utils'),
    log = require('../utils/logger').getLogger(),
    User = require('../model/User');

module.exports = router;

router.get('/profile', function(req, res){

    try{
        if(typeof req.session.user === 'undefined'){
            res.redirect('/');
            return;
        }
        userUtils.getByID(req.session.user.id, function (user) {

            if(user && user.length > 0) {

                res.render('profile', {
                    hideOrders: true,
                    displayLogin: true,
                    user: user[0]
                });
                return;
            }

            res.send(JSON.stringify({
                    error: 'Cannot get profile.',
                    status: 500
                })
            );
        });
    }catch(err){
        log.error('Cannot open order page.\nError: ' + err.stack);
        res.send('Something went wrong ...');
    }
});

router.get('/user/list', function(req, res){

    try{
        if(typeof req.session.user === 'undefined'){
            res.redirect('/');
            return;
        }
        if(req.session.user.type !== User.ADMIN_USER_TYPE_ID){
            res.redirect('/');
            return;
        }
        userUtils.getAll(function (users) {
            res.render('users', {
                hideOrders: true,
                displayLogin: true,
                user: req.session.user,
                User: User,
                users: users
            });
        })

    }catch(err){
        log.error('Cannot open users page.\nError: ' + err.stack);
        res.send('Something went wrong ...');
    }
});