const { Sequelize } = require('sequelize')
const IncomingInvoiceController = require('./controllers/incomingInvoiceController');
const OutgoingInvoiceController = require('./controllers/outgoingInvoiceController');

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

            this.models = {
                IncomingInvoice: require('./Models/incomingInvoice')(sequelize),
                Product: require('./Models/product')(sequelize),
                OutgoingInvoice: require('./Models/outgoingInvoice')(sequelize),
                CostPrice: require('./Models/costPrice')(sequelize),
                sequelize
            }

            Object.values(this.models).forEach(model => {
                if (model.associate) {
                  model.associate(this.models);
                }
              });

            this.incomingInvoiceController = new IncomingInvoiceController(this.models);
            this.outgoingInvoiceController = new OutgoingInvoiceController(this.models);

            await sequelize.sync({ force: true });
            console.log('[database] models synchronized!');
          } catch (error) {
            console.error('Unable to connect to the database:', error);
          }
    }
}

module.exports = DatabaseManager