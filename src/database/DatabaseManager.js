const Sequelize = require('sequelize')

const Product = require('./Models/product')
const Order = require('./Models/order')
const Cost = require('./Models/cost')
const Arrival = require('./Models/arrival')

class DatabaseManager {
    constructor(app) {
        this.app = app
    }

    async init() {
        const sequelize = new Sequelize('database', 'username', 'password', {
            host: 'localhost',
            dialect: 'postgres',
        });
        Product.init(sequelize);
        Arrival.init(sequelize);
        Order.init(sequelize);
        Cost.init(sequelize);
    }

    start() {
        
    }
}

module.exports = DatabaseManager