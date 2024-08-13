const { Op } = require('sequelize');

class IncomingInvoiceController {
  constructor(models) {
    this.models = models;
  }

  async createIncomingInvoice(incomingInvoice) {
    const transaction = await this.models.sequelize.transaction();
    try {
      const { document_id, date, invoiceProducts } = incomingInvoice;
      const invoice = await this.models.IncomingInvoice.create({ id: document_id, date }, { transaction });

      const productIds = invoiceProducts.map(item => item.productId);
      const products = await this.models.Product.findAll({
        where: {
          id: productIds
        },
        transaction
      });

      for (const item of invoiceProducts) {
        const { productId, quantity, price } = item;
        await this.models.IncomingInvoiceItem.create({ invoiceId: document_id, productId, quantity, price }, { transaction });

        const product = products.find(p => p.id === productId);
        product.stock += quantity;
        await product.save({ transaction });

        const incomingInvoices = await this.models.IncomingInvoiceItem.findAll({
          where: {
            productId,
            date: {
              [Op.lte]: date
            }
          },
          order: [['date', 'ASC']],
          transaction
        });

        const outgoingInvoices = await this.models.OutgoingInvoiceItem.findAll({
          where: {
            productId,
            date: {
              [Op.lte]: date
            }
          },
          order: [['date', 'ASC']],
          transaction
        });

        let totalCost = 0;
        let totalQuantity = 0;
        for (const inv of incomingInvoices) {
          totalCost += inv.quantity * inv.price;
          totalQuantity += inv.quantity;
        }

        for (const inv of outgoingInvoices) {
          totalQuantity -= inv.quantity;
          if (totalQuantity < 0) {
            throw new Error('Insufficient stock for the given date');
          }
          const costPrice = totalCost / totalQuantity;

          const monthStart = new Date(inv.date.getFullYear(), inv.date.getMonth(), 1);
          await this.models.CostPrice.upsert({
            productId,
            date: monthStart,
            value: costPrice
          }, { transaction });
        }
      }

      await transaction.commit();
      return invoice
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Error creating new incoming invoice: ${error.message}`)
    }
  }
}

module.exports = IncomingInvoiceController;
