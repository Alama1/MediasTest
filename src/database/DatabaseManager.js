const { Sequelize } = require('sequelize')

const Product = require('./Models/product')
const Order = require('./Models/order')
const Cost = require('./Models/cost')
const Arrival = require('./Models/arrival')

class DatabaseManager {
    constructor(app) {
        this.app = app
        this.config = app.config.properties
    }

    async connect() {
        const sequelize = new Sequelize(this.config.database.name, this.config.database.login, this.config.database.password, {
            host: this.config.database.host,
            port: this.config.database.port,
            dialect: 'postgres',
        });
        try {
            await sequelize.authenticate();
            console.log('[database] connection established! Loading models...');
            Product.init(sequelize);
            Arrival.init(sequelize);
            Order.init(sequelize);
            Cost.init(sequelize);
            await sequelize.sync({ force: true });
            console.log('[database] models synchronized!');
          } catch (error) {
            console.error('Unable to connect to the database:', error);
          }
    }
}

module.exports = DatabaseManager