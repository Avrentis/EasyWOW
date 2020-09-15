var Master = require('../model/Master'),
    log = require('./logger').getLogger();

exports.getAll = function(callback) {

    Master.findAll()
        .then(masters => {
            callback(masters);
        });
};
