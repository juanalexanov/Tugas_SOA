'use strict';
const { 
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Users extends Model {
        static associate(models) {
            // define association here
        }
    };
    Users.init({
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        nama: DataTypes.STRING,
        alamat: DataTypes.STRING,
        nomorhp: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Users',
    });
    return Users;
}