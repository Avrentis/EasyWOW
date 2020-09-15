var Order = require('../model/Order'),
    log = require('./logger').getLogger();

exports.create = function(name, phoneNumber, description, user, callback) {

    Order.create({
        name: name,
        phoneNumber: phoneNumber,
        description: description,
        userId: user.id,
        status: Order.OPEN_STATUS_ID
    })
    .then(order => {
        log.debug(order.toJSON());
        callback();
    });
};

exports.getAll = function(callback) {

    Order.findAll()
        .then(orders => {
            callback(orders);
        });
};

exports.getStatusTextValue = function (status) {
    switch (status) {
        case Order.OPEN_STATUS_ID: return 'Открыт';
        case Order.CONFIRMED_STATUS_ID: return  'Подтверждён';
        case Order.COMPLETED_STATUS_ID: return  'Завершён';
        case Order.CANCELLED_STATUS_ID: return  'Отменён';
        default: return 'Неизвестен';
    }
}