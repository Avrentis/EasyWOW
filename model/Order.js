const { Model, DataTypes } = require('sequelize');
var User = require('./User');

class Order extends Model {}

module.exports = Order;

Order.OPEN_STATUS_ID = 1;
Order.CONFIRMED_STATUS_ID = 2;
Order.COMPLETED_STATUS_ID = 3;
Order.CANCELLED_STATUS_ID = 4;

Order.initModel = function (sequelize) {
    Order.init({
        name: DataTypes.STRING,
        phoneNumber: DataTypes.STRING,
        description: DataTypes.STRING,
        status: DataTypes.INTEGER
    }, { sequelize, modelName: 'order' });

    Order.belongsTo(User);
}