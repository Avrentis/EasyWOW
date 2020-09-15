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

exports.getByLogin = function(login, callback) {

    User.findAll({
        where: {
            login: login
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

exports.create = function(login, name, birthday, phoneNumber, callback) {

    User.create({
        login: login,
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
