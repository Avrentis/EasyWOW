var configUtils = require('./config_utils');
var Sequelize = require('sequelize');

var connectionParameters = configUtils.getConfig().mySQLServer.connectionParameters;
var sequelize = new Sequelize(connectionParameters.database, connectionParameters.user, connectionParameters.password, {
    dialect: "mysql",
    host: connectionParameters.host
});

exports.getSequelize = function () {
    return sequelize;
}