var Order = require('../model/Order'),
    log = require('./logger').getLogger();

exports.create = function(name, phoneNumber, description, user, startAt, masterID, callback) {
    Order.create({
        name: name,
        phoneNumber: phoneNumber,
        description: description,
        userId: user.id,
        status: Order.OPEN_STATUS_ID,
        startAt: startAt,
        masterId: masterID
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

exports.updateStatus = function(id, status, callback) {
    Order.findOne({
        where: {
            id: id
        }
    })
    .then(order => {
        order.update({ status: status }).then(() => { callback() });
    });
};

exports.getStatusTextValue = function (status) {
    switch (status) {
        case Order.OPEN_STATUS_ID: return 'Открыт';
        case Order.APPROVED_STATUS_ID: return  'Подтверждён';
        case Order.COMPLETED_STATUS_ID: return  'Завершён';
        case Order.CANCELLED_STATUS_ID: return  'Отменён';
        case Order.REJECTED_STATUS_ID: return 'Отклонён';
        default: return 'Неизвестен';
    }
}

exports.getButtonsByOrder = function (order) {
    switch (order.status) {
        case Order.OPEN_STATUS_ID: return '<img action="' + Order.APPROVED_STATUS_ID + '" orderID="' + order.id + '" class="change-order-status-btn status-img" src="/images/orders/approve.png" />' +
            '<img class="change-order-status-btn status-img" src="/images/orders/cancel.png" action="' + Order.REJECTED_STATUS_ID + '" orderID="' + order.id + '" />';
        case Order.APPROVED_STATUS_ID: return '<img class="change-order-status-btn status-img" src="/images/orders/complete.png" action="' + Order.COMPLETED_STATUS_ID + '" orderID="' + order.id + '" />' +
            '<img class="change-order-status-btn status-img" src="/images/orders/cancel.png" action="' + Order.CANCELLED_STATUS_ID + '" orderID="' + order.id + '"/>';
        case Order.CANCELLED_STATUS_ID:
        case Order.REJECTED_STATUS_ID:
        case Order.COMPLETED_STATUS_ID: return '<img class="change-order-status-btn status-img" src="/images/orders/restore.png" action="' + Order.OPEN_STATUS_ID + '" orderID="' + order.id + '" />';
        default: return 'Неизвестен';
    }
}

exports.processDescription = function (description) {
    console.log('description = ' + description);
    description = description.replace(/\n/g, '<br/>');
    if(description.length < 100){
        return description;
    }
    return description.substring(0, 80) + "<div class=\"expand-description\" secondPart=\"" + description.substring(80, description.length) + "\"> (развернуть)</div>"
}