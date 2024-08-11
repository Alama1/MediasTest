const { Op } = require('sequelize');

class OutgoingInvoiceController {
  constructor(models) {
    this.models = models;
  }

  async createOutgoingInvoice(newInvoice) {
    const transaction = await this.models.sequelize.transaction();
    try {
      const { document_id, date, products } = newInvoice;
      const invoice = await this.models.OutgoingInvoice.create({ id: document_id, date }, { transaction });

      for (const item of products) {
        const { productId, quantity, price } = item;
        await this.models.OutgoingInvoiceItem.create({ invoiceId: document_id, productId, quantity, price }, { transaction });

        const product = await this.models.Product.findByPk(productId, { transaction });
        product.stock -= quantity;
        await product.save({ transaction });

        const incomingInvoices = await this.models.IncomingInvoiceItem.findAll({
          where: {
            productId,
            date: {
              [Op.gte]: date
            }
          },
          order: [['date', 'ASC']],
          transaction
        });

        const outgoingInvoices = await this.models.OutgoingInvoice.findAll({
          where: {
            ProductId: productId,
            date: {
              [Op.gte]: date
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
            ProductId: productId,
            date: monthStart,
            value: costPrice
          }, { transaction });
        }
      }

      await transaction.commit();
      return invoice
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Error creating new outgoing invoice: ${error.message}`)
    }
  }
}

module.exports = OutgoingInvoiceController;
