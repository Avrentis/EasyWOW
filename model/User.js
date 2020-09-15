const { Model, DataTypes } = require('sequelize');

class User extends Model {}

module.exports = User;

User.SIMPLE_USER_TYPE_ID = 0;
User.ADMIN_USER_TYPE_ID = 1;

User.initModel = function (sequelize) {
    User.init({
        login: DataTypes.STRING,
        name: DataTypes.STRING,
        type: DataTypes.INTEGER,
        birthday: DataTypes.DATE,
        phoneNumber: DataTypes.STRING
    }, { sequelize, modelName: 'user' });
}