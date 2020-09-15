var express = require('express');
var router = express.Router(),
    log = require('../utils/logger').getLogger(),
    userUtils = require('../utils/user_utils');

module.exports = router;

router.post('/sign_in', function(req, res) {

    try {
        var data = req.body;

        var login = data.login;

        if(!req.body.login){
            res.send(JSON.stringify({
                    error: 'Логин неопределен!',
                    status: 500
                })
            );
            return;
        }

        if(!/^[\w-_]+$/.test(req.body.login)){
            res.send(JSON.stringify({
                    error: 'Логин имеет неверный формат.',
                    status: 500
                })
            );
            return;
        }

        userUtils.getByLogin(login, function (user) {

            if(user && user.length > 0) {
                req.session.user = user[0];

                res.send(JSON.stringify({
                        status: 200
                    })
                );
                return;
            }

            res.send(JSON.stringify({
                    error: 'Cannot sign in.',
                    status: 500
                })
            );
        });
    } catch(err) {
        log.error('Cannot sign in.\nError: ' + err.stack);
        res.send(JSON.stringify({
                error: 'Cannot sign in.',
                status: 500
            })
        );
    }
});

router.post('/sign_out', function(req, res) {
    req.session.user = undefined;
    res.send(JSON.stringify({
            status: 200
        })
    );
});

router.post('/sign_up', function(req, res) {

    try {
        var login = req.body.login;
        var name = req.body.name;
        var phoneNumber = req.body.phoneNumber;

        if(!login || !name || !phoneNumber){
            res.send(JSON.stringify({
                    error: 'Некоторые обязательные параметры неопределены!',
                    status: 500
                })
            );
            return;
        }

        if(!/^[\w-_]+$/.test(login) || !/^[\w-., А-ЯЁа-яё]+$/.test(name) || !/^[\d-()+]+$/.test(phoneNumber)){
            res.send(JSON.stringify({
                    error: 'Некоторые обязательные параметры имеют неверный формат!',
                    status: 500
                })
            );
            return;
        }

        if(login.length > 30 || name.length > 255 || phoneNumber.length > 16){
            res.send(JSON.stringify({
                    error: 'Превышена максимальная длина! Логин - 30 символов, имя - 255, телефон - 16!',
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

        userUtils.getByLogin(login, function (user) {

            if(user && user.length === 0) {
                userUtils.create(login, name, birthday, phoneNumber, function (user) {
                    req.session.user = user;

                    res.send(JSON.stringify({
                            status: 200
                        })
                    );
                });
                return;
            }

            res.send(JSON.stringify({
                    error: 'Пользователь с таким логином уже существует!',
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