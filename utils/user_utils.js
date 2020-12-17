var User = require('../model/User'),
    log = require('./logger').getLogger();

exports.getByID = function(id, callback) {

    User.findAll({
        where: {
            id: id
        }
    })
    .then(user => {
        callback(user);
    });
};

exports.getByPhoneNumber = function(phoneNumber, callback) {

    User.findAll({
        where: {
            phoneNumber: phoneNumber
        }
    })
    .then(user => {
        callback(user);
    });
};

exports.getAll = function(callback) {

    var Op = require('sequelize').Op;
    User.findAll({ where: { id: { [Op.gt]: 2 } } })
        .then(users => {
            callback(users);
        });
};

exports.create = function(name, birthday, phoneNumber, callback) {

    User.create({
        name: name,
        type: User.SIMPLE_USER_TYPE_ID,
        birthday: birthday,
        phoneNumber: phoneNumber
    })
    .then(user => {
        log.debug(user.toJSON());
        callback(user);
    });
};

exports.edit = function(id, name, birthday, callback) {

    User.findOne({
        where: {
            id: id
        }
    })
    .then(order => {
        order.update({ name: name, birthday: birthday }).then(() => { callback() });
    });
};

