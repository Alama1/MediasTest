const { Sequelize } = require('sequelize')
const IncomingInvoiceController = require('./controllers/incomingInvoiceController');
const OutgoingInvoiceController = require('./controllers/outgoingInvoiceController');
const GetCostPriceOnDateController = require('./controllers/getCostPriceOnDate')

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
                Product: require('./Models/product')(sequelize),
                IncomingInvoice: require('./Models/incomingInvoice')(sequelize),
                OutgoingInvoice: require('./Models/outgoingInvoice')(sequelize),
                IncomingInvoiceItem: require('./Models/incomingInvoiceItem')(sequelize),
                OutgoingInvoiceItem: require('./Models/outgoingInvoiceItem')(sequelize),
                CostPrice: require('./Models/costPrice')(sequelize),
                sequelize
            };

            Object.values(this.models).forEach(model => {
                if (model.associate) {
                  model.associate(this.models);
                }
              });

            this.incomingInvoiceController = new IncomingInvoiceController(this.models);
            this.outgoingInvoiceController = new OutgoingInvoiceController(this.models);

            await sequelize.sync();
            console.log('[database] models synchronized!');
        } catch (error) {
          console.error('Unable to connect to the database:', error);
        }
    }

    async createProduct(product) {
      const productModel = this.models.Product;
      const { id, name } = product;

      try {
        await productModel.create({ id, name });
        return 'Product created successfully!'
      } catch(err) {
        throw new Error(`Database error occurred: ${err.message}`);
      }
    }

    newIncomingInvoice(req, res) {
      return this.incomingInvoiceController.createIncomingInvoice(req,res);
    }

    newOutgoingInvoice(req, res) {
      return this.outgoingInvoiceController.createOutgoingInvoice(req, res)
    }

    async getPrice(product) {
      let { id, date } = product;
      if (!date) {
        date = new Date().toISOString()
      }

      try {
        const returnData = await GetCostPriceOnDateController(id, date, this.models);
        return returnData
      } catch (error) {
        console.error('Error fetching cost price:', error.message);
        throw error;
      }
      
    }
}

module.exports = DatabaseManager