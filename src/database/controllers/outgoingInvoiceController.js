const { Op } = require('sequelize');

class OutgoingInvoiceController {
  constructor(models) {
    this.models = models;
  }

  async createOutgoingInvoice(outgoingInvoice) {
    const transaction = await this.models.sequelize.transaction();
    try {
      const { document_id, date, invoiceProducts } = outgoingInvoice;
      const invoice = await this.models.OutgoingInvoice.create({ id: document_id, date }, { transaction });

      const productIds = invoiceProducts.map(item => item.product_id);
      const products = await this.models.Product.findAll({
        where: { id: productIds },
        transaction
      });

      const incomingInvoices = await this.models.IncomingInvoiceItem.findAll({
        where: {
          productId: productIds,
          date: { [Op.lte]: date }
        },
        order: [['date', 'ASC']],
        transaction
      });

      const outgoingInvoices = await this.models.OutgoingInvoiceItem.findAll({
        where: {
          productId: productIds,
          date: { [Op.lte]: date }
        },
        order: [['date', 'ASC']],
        transaction
      });

      for (const item of invoiceProducts) {
        const { product_id, quantity, price } = item;
        await this.models.OutgoingInvoiceItem.create({ invoiceId: document_id, productId: product_id, quantity, price, date }, { transaction });

        const product = products.find(p => p.id === product_id);
        if (product.stock - quantity < 0) {
          throw new Error('Insufficient stock for the given date');
        }
        product.stock -= quantity;
        await product.save({ transaction });

        const productIncomingInvoices = incomingInvoices.filter(inv => inv.productId === product_id);
        const productOutgoingInvoices = outgoingInvoices.filter(inv => inv.productId === product_id);

        let totalCost = 0;
        let totalQuantity = 0;
        for (const inv of productIncomingInvoices) {
          totalCost += inv.quantity * inv.price;
          totalQuantity += inv.quantity;
        }

        for (const inv of productOutgoingInvoices) {
          totalQuantity -= inv.quantity;
          if (totalQuantity < 0) {
            throw new Error('Insufficient stock for the given date');
          }
        }

        const costPrice = totalCost / totalQuantity;

        const monthStart = getMonthStart(date).toISOString()
        
        await this.models.CostPrice.upsert({
          productId: product_id,
          date: monthStart,
          value: costPrice
        }, { transaction });
      }

      await transaction.commit();
      return invoice;
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Error creating new outgoing invoice: ${error}`);
    }
  }
}

module.exports = OutgoingInvoiceController;
