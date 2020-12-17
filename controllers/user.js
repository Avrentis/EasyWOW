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
                    user: user[0],
                    User: User
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

router.get('/edit-profile', function(req, res){

    try{
        if(typeof req.session.user === 'undefined'){
            res.redirect('/');
            return;
        }
        userUtils.getByID(req.session.user.id, function (user) {

            if(user && user.length > 0) {

                res.render('edit-profile', {
                    hideOrders: true,
                    displayLogin: true,
                    user: user[0],
                    User: User
                });
                return;
            }

            res.send(JSON.stringify({
                    error: 'Cannot get profile editing.',
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

router.post('/save-profile', function(req, res) {

    try {
        var userID = req.body.userID;
        var name = req.body.name;

        console.log("userID = " + userID);

        if(!userID || !name){
            res.send(JSON.stringify({
                    error: 'Некоторые обязательные параметры неопределены!',
                    status: 500
                })
            );
            return;
        }

        if(!/^[\d]+$/.test(userID) || !/^[\w-., А-ЯЁа-яё]+$/.test(name)){
            res.send(JSON.stringify({
                    error: 'Некоторые обязательные параметры имеют неверный формат!',
                    status: 500
                })
            );
            return;
        }

        if(userID.length > 10 || name.length > 255){
            res.send(JSON.stringify({
                    error: 'Превышена максимальная длина! Обращение - 255 символов.',
                    status: 500
                })
            );
            return;
        }

        var birthday = null;
        if(req.body.birthday){
            try {
                var dateParts = req.body.birthday.split(".");
                birthday = new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]);
            }catch (e) {
                res.send(JSON.stringify({
                        error: 'День рождения имеют неверный формат! Пример: 31.1.1980',
                        status: 500
                    })
                );
                return;
            }
        }

        userUtils.getByID(userID, function (user) {

            if(user && user.length > 0) {
                userUtils.edit(userID, name, birthday,function () {
                    res.send(JSON.stringify({
                            status: 200
                        })
                    );
                });
                return;
            }

            res.send(JSON.stringify({
                    error: 'Пользователь с таким ID не существует!',
                    status: 500
                })
            );
        });
    } catch(err) {
        log.error('Cannot sign in.\nError: ' + err.stack);
        res.send(JSON.stringify({
                error: 'Cannot sign up.',
                status: 500
            })
        );
    }
});