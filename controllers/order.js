var express = require('express');
var router = express.Router(),
    log = require('../utils/logger').getLogger(),
    userUtils = require('../utils/user_utils'),
    orderUtils = require('../utils/order_utils'),
    User = require('../model/User');

module.exports = router;

router.get('/', function(req, res){

    try{
        res.render('order', {
            hideOrders: true,
            displayLogin: true,
            user: req.session.user,
            User: User
        });
    }catch(err){
        log.error('Cannot open order page.\nError: ' + err.stack);
        res.send('Something went wrong ...');
    }
});

router.get('/list', function(req, res){

    try{
        if(typeof req.session.user === 'undefined'){
            res.redirect('/');
            return;
        }
        if(req.session.user.type !== User.ADMIN_USER_TYPE_ID){
            res.redirect('/');
            return;
        }
        orderUtils.getAll(function (orders) {
            res.render('orders', {
                hideOrders: true,
                displayLogin: true,
                user: req.session.user,
                User: User,
                orders: orders,
                orderUtils: orderUtils
            });
        })

    }catch(err){
        log.error('Cannot open orders page.\nError: ' + err.stack);
        res.send('Something went wrong ...');
    }
});

router.post('/', function(req, res) {

    try {
        var name = req.body.name;
        var phoneNumber = req.body.phoneNumber;
        var description = req.body.description;

        if(!description || !name || !phoneNumber){
            res.send(JSON.stringify({
                    error: 'Некоторые обязательные параметры неопределены!',
                    status: 500
                })
            );
            return;
        }

        if(!/^[\w-., А-ЯЁа-яё?!():;\n]+$/.test(description) || !/^[\w-., А-ЯЁа-яё]+$/.test(name) || !/^[\d-()+]+$/.test(phoneNumber)){
            res.send(JSON.stringify({
                    error: 'Некоторые обязательные параметры имеют неверный формат!',
                    status: 500
                })
            );
            return;
        }

        if(description.length > 2000 || name.length > 255 || phoneNumber.length > 16){
            res.send(JSON.stringify({
                    error: 'Превышена максимальная длина! Логин - 30 символов, имя - 255, телефон - 16!',
                    status: 500
                })
            );
            return;
        }

        userUtils.getByID(req.session.user ? req.session.user.id : 2 /* guest */, function (user) {

            if(user && user.length > 0) {
                orderUtils.create(name, phoneNumber, description, user[0], function () {

                    res.send(JSON.stringify({
                            status: 200
                        })
                    );
                });
                return;
            }

            res.send(JSON.stringify({
                    error: 'Something went wrong ...',
                    status: 500
                })
            );
        });
    } catch(err) {
        log.error('Cannot create order.\nError: ' + err.stack);
        res.send(JSON.stringify({
                error: 'Cannot create order.',
                status: 500
            })
        );
    }
});