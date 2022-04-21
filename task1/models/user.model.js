const sequelizeDb = require('./index');
const Sequelize = require('sequelize');

const Order = sequelizeDb.define(`${process.env.PREFIX}user`, {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    sender_id: {
        type: Sequelize.STRING(200),
        allowNull: false
    },
    firstname: {
        type: Sequelize.STRING(200),
        allowNull: false
    },
    lastname: {
        type: Sequelize.STRING(200),
        allowNull: false
    },
},
{
    indexes: [
        {
            unique: true,
            fields: ['sender_id']
        }
    ]
});

module.exports = Order;