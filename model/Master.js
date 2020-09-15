const { Model, DataTypes } = require('sequelize');

class Master extends Model {}

module.exports = Master;

Master.SIMPLE_USER_TYPE_ID = 0;
Master.ADMIN_USER_TYPE_ID = 1;

Master.initModel = function (sequelize) {
    Master.init({
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        pathToImage: DataTypes.STRING
    }, { sequelize, modelName: 'master' });
}