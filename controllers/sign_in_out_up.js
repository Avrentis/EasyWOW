var express = require('express');
var router = express.Router(),
    log = require('../utils/logger').getLogger(),
    userUtils = require('../utils/user_utils'),
    smsUtils = require('../utils/sms_utils')
;

module.exports = router;

router.post('/get_login_sms_code', function(req, res) {
    try {
        if(req.session.smsCodeCreationDate && (req.session.smsCodeCreationDate + 60000) > new Date().getTime()){
            res.send(JSON.stringify({
                    error: 'Ошибка: 60 секунд до нового кода ещё не прошли.',
                    status: 500
                })
            );
            return;
        }

        var phoneNumber = req.body.phoneNumber;

        if(!phoneNumber){
            res.send(JSON.stringify({
                    error: 'Номер телефона неопределен!',
                    status: 500
                })
            );
            return;
        }

        if(!/^[\d-+() ]+$/.test(phoneNumber)){
            res.send(JSON.stringify({
                    error: 'Номер телефона имеет неверный формат.',
                    status: 500
                })
            );
            return;
        }

        phoneNumber = phoneNumber.replace(/[-+() ]/g, '');

        log.debug('get_login_sms_code phoneNumber = ' + phoneNumber);

        userUtils.getByPhoneNumber(phoneNumber, function (user) {

            if(user && user.length > 0) {
                req.session.smsCode = smsUtils.createAndSendSmsCode(phoneNumber);
                log.debug("Sms code = " + req.session.smsCode);
                req.session.smsCodeCreationDate = new Date().getTime();

                res.send(JSON.stringify({
                        status: 200
                    })
                );
                return;
            }

            res.send(JSON.stringify({
                    error: 'Такой пользователь не найден.',
                    status: 500
                })
            );
        });

    } catch(err) {
        log.error('Cannot get sms code.\nError: ' + err.stack);
        res.send(JSON.stringify({
                error: "Не удаётся получить смс-код :'( Мы скоро всё исправим!",
                status: 500
            })
        );
    }
});

router.post('/get_sing_up_sms_code', function(req, res) {
    try {
        if(req.session.smsCodeCreationDate && (req.session.smsCodeCreationDate + 60000) > new Date().getTime()){
            res.send(JSON.stringify({
                    error: 'Ошибка: 60 секунд до нового кода ещё не прошли.',
                    status: 500
                })
            );
            return;
        }

        var phoneNumber = req.body.phoneNumber;

        if(!phoneNumber){
            res.send(JSON.stringify({
                    error: 'Номер телефона неопределен!',
                    status: 500
                })
            );
            return;
        }

        if(!/^[\d-+() ]+$/.test(phoneNumber)){
            res.send(JSON.stringify({
                    error: 'Номер телефона имеет неверный формат.',
                    status: 500
                })
            );
            return;
        }

        phoneNumber = phoneNumber.replace(/[-+() ]/g, '');

        log.debug('get_login_sms_code phoneNumber = ' + phoneNumber);

        userUtils.getByPhoneNumber(phoneNumber, function (user) {

            if(user && user.length > 0) {
                res.send(JSON.stringify({
                        error: 'Пользователь с таким номером телефона уже существует!',
                        status: 500
                    })
                );
                return;
            }

            req.session.smsCode = smsUtils.createAndSendSmsCode(phoneNumber);
            log.debug("Sms code = " + req.session.smsCode);
            req.session.smsCodeCreationDate = new Date().getTime();

            res.send(JSON.stringify({
                    status: 200
                })
            );
        });

    } catch(err) {
        log.error('Cannot get sms code.\nError: ' + err.stack);
        res.send(JSON.stringify({
                error: "Не удаётся получить смс-код :'( Мы скоро всё исправим!",
                status: 500
            })
        );
    }
});

router.post('/sign_in', function(req, res) {

    try {
        if(!req.session.smsCodeCreationDate){
            res.send(JSON.stringify({
                    error: 'Ошибка: для входа надо получить смс-код.',
                    status: 500
                })
            );
            return;
        }

        if(!/\d{3,5}/.test(req.body.smsCode)){
            res.send(JSON.stringify({
                    error: 'Ошибка: смс-код имеет неверный формат.',
                    status: 500
                })
            );
            return;
        }

        if(parseInt(req.body.smsCode) !== req.session.smsCode){
            res.send(JSON.stringify({
                    error: 'Ошибка: смс-код неверен.',
                    status: 500
                })
            );
            return;
        }

        var phoneNumber = req.body.phoneNumber;

        if(!phoneNumber){
            res.send(JSON.stringify({
                    error: 'Номер телефона неопределен!',
                    status: 500
                })
            );
            return;
        }

        if(!/^[\d-+() ]+$/.test(phoneNumber)){
            res.send(JSON.stringify({
                    error: 'Номер телефона имеет неверный формат.',
                    status: 500
                })
            );
            return;
        }

        phoneNumber = phoneNumber.replace(/[-+() ]/g, '');

        log.debug('sign_in phoneNumber = ' + phoneNumber);

        userUtils.getByPhoneNumber(phoneNumber, function (user) {

            if(user && user.length > 0) {
                req.session.user = user[0];

                res.send(JSON.stringify({
                        status: 200
                    })
                );
                return;
            }

            res.send(JSON.stringify({
                    error: 'Такой пользователь не найден.',
                    status: 500
                })
            );
        });
    } catch(err) {
        log.error('Cannot sign in.\nError: ' + err.stack);
        res.send(JSON.stringify({
                error: "Не удаётся обработать вход :'( Мы скоро всё исправим!",
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
        var name = req.body.name;
        var phoneNumber = req.body.phoneNumber;

        if(!req.session.smsCodeCreationDate){
            res.send(JSON.stringify({
                    error: 'Ошибка: для входа надо получить смс-код.',
                    status: 500
                })
            );
            return;
        }

        if(!/\d{3,5}/.test(req.body.smsCode)){
            res.send(JSON.stringify({
                    error: 'Ошибка: смс-код имеет неверный формат.',
                    status: 500
                })
            );
            return;
        }

        if(parseInt(req.body.smsCode) !== req.session.smsCode){
            res.send(JSON.stringify({
                    error: 'Ошибка: смс-код неверен.',
                    status: 500
                })
            );
            return;
        }

        if(!name || !phoneNumber){
            res.send(JSON.stringify({
                    error: 'Некоторые обязательные параметры неопределены!',
                    status: 500
                })
            );
            return;
        }

        if(!/^[\w-., А-ЯЁа-яё]+$/.test(name) || !/^[\d-()+ ]+$/.test(phoneNumber)){
            res.send(JSON.stringify({
                    error: 'Некоторые обязательные параметры имеют неверный формат!',
                    status: 500
                })
            );
            return;
        }

        if(name.length > 255 || phoneNumber.length > 16){
            res.send(JSON.stringify({
                    error: 'Превышена максимальная длина! Обращение - 255 символов, номер телефона - 16!',
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

        phoneNumber = phoneNumber.replace(/[-+() ]/g, '');

        log.debug('sign_up phoneNumber = ' + phoneNumber);

        userUtils.getByPhoneNumber(phoneNumber, function (user) {

            if(user && user.length === 0) {
                userUtils.create(name, birthday, phoneNumber, function (user) {
                    req.session.user = user;

                    res.send(JSON.stringify({
                            status: 200
                        })
                    );
                });
                return;
            }

            res.send(JSON.stringify({
                    error: 'Пользователь с таким номером телефона уже существует!',
                    status: 500
                })
            );
        });
    } catch(err) {
        log.error('Cannot sign in.\nError: ' + err.stack);
        res.send(JSON.stringify({
                error: "Не удаётся обработать регистрацию :'( Мы скоро всё исправим!",
                status: 500
            })
        );
    }
});