const Sequelize = require('sequelize')
const config = require('../config/config.json');

const {
    host,
    port,
    username,
    password,
    database,
    dialect,
} = config.koneksi_user

const sequelize = new Sequelize(database, username, password, {
    host: host,
    port: port,
    dialect: dialect
})

module.exports = sequelize