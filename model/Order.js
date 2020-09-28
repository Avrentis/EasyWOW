const { Model, DataTypes } = require('sequelize');
var User = require('./User'),
    Master = require('./Master');

class Order extends Model {}

module.exports = Order;

Order.OPEN_STATUS_ID = 1;
Order.APPROVED_STATUS_ID = 2;
Order.REJECTED_STATUS_ID = 3;
Order.COMPLETED_STATUS_ID = 4;
Order.CANCELLED_STATUS_ID = 5;

Order.initModel = function (sequelize) {
    Order.init({
        name: DataTypes.STRING,
        phoneNumber: DataTypes.STRING,
        description: DataTypes.STRING,
        status: DataTypes.INTEGER,
        startAt: DataTypes.DATE
    }, { sequelize, modelName: 'order' });

    Order.belongsTo(User);
    Order.belongsTo(Master);
}