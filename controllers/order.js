var express = require('express');
var router = express.Router(),
    log = require('../utils/logger').getLogger(),
    userUtils = require('../utils/user_utils'),
    orderUtils = require('../utils/order_utils'),
    mastersUtils = require('../utils/masters_utils'),
    User = require('../model/User'),
    Order = require('../model/Order');

module.exports = router;

router.get('/', function(req, res){

    try{
        mastersUtils.getAll(function(masters) {
            res.render('order', {
                hideOrders: true,
                displayLogin: true,
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
        var masterID = req.body.master;
        var date = req.body.date;
        var time = req.body.time;

        if(!description || !name || !phoneNumber || !date || !time){
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

        if(req.body.date.length > 10 || req.body.time.length > 5){
            res.send(JSON.stringify({
                    error: 'Некорректный формат даты или времени!',
                    status: 500
                })
            );
            return;
        }

        if(masterID && masterID.length > 10){
            res.send(JSON.stringify({
                    error: 'Некорректный формат идентификатора мастера!',
                    status: 500
                })
            );
            return;
        }

        if(masterID && !/^[\d]+$/.test(masterID)){
            res.send(JSON.stringify({
                    error: 'Некорректный формат идентификатора мастера!',
                    status: 500
                })
            );
            return;
        }

        var startAt = null;
        try {
            var dateParts = req.body.date.split("-");
            var timeParts = req.body.time.split(":");

            startAt = new Date(dateParts[2], (dateParts[1] - 1), dateParts[0], timeParts[0], timeParts[1]);
        }catch (e) {
            res.send(JSON.stringify({
                    error: 'Некорректный формат даты или времени! Пример: 16.05.2020 13:15',
                    status: 500
                })
            );
            return;
        }

        var processOrder = function(){
            userUtils.getByID(req.session.user ? req.session.user.id : 2 /* guest */, function (user) {

                if(user && user.length > 0) {
                    orderUtils.create(name, phoneNumber, description, user[0], startAt, masterID, function () {

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
        };

        if(masterID){
            mastersUtils.getByID(masterID, function(master) {
                if(!master){
                    res.send(JSON.stringify({
                            error: 'Некорректный идентификатор мастера!',
                            status: 500
                        })
                    );
                    return;
                }
                processOrder();
            });
        }else{
            processOrder();
        }
    } catch(err) {
        log.error('Cannot create order.\nError: ' + err.stack);
        res.send(JSON.stringify({
                error: 'Cannot create order.',
                status: 500
            })
        );
    }
});


router.post('/change/status', function(req, res) {

    try {
        var orderID = req.body.orderID;
        var action = req.body.action;

        console.log("orderID = " + orderID);
        console.log("action = " + action);

        if(!orderID || !action){
            res.send(JSON.stringify({
                    error: 'Некоторые обязательные параметры неопределены!',
                    status: 500
                })
            );
            return;
        }

        if(!/^[\d]+$/.test(action)){
            res.send(JSON.stringify({
                    error: 'Некорректный формат действия!',
                    status: 500
                })
            );
            return;
        }

        action = parseInt(action);

        if(action < Order.OPEN_STATUS_ID || action > Order.CANCELLED_STATUS_ID){
            res.send(JSON.stringify({
                    error: 'Некорректный формат действия!',
                    status: 500
                })
            );
            return;
        }

        if(orderID.length > 10 || !/^[\d]+$/.test(orderID)){
            res.send(JSON.stringify({
                    error: 'Некорректный формат идентификатора заказа!',
                    status: 500
                })
            );
            return;
        }

        orderID = parseInt(orderID);

        orderUtils.updateStatus(orderID, action, function () {
            res.send(JSON.stringify({
                    status: 200
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