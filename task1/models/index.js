const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    define: {
        charset: 'utf8mb4',
    }
});

module.exports = sequelize;