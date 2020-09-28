var Master = require('../model/Master'),
    log = require('./logger').getLogger();

exports.getAll = function(callback) {

    Master.findAll()
        .then(masters => {
            callback(masters);
        });
};

exports.getByID = function(id, callback) {

    Master.findAll({
        where: {
            id: id
        }
    })
    .then(master => {
        callback(master);
    });
};
