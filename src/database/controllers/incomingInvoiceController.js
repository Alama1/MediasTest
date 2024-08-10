const { Op } = require('sequelize');

class IncomingInvoiceController {
  constructor(models) {
    this.models = models;
  }

  async createIncomingInvoice(req, res) {
    const transaction = await this.models.sequelize.transaction();
    try {
      const { date, quantity, price, productId } = req.body;
      const invoice = await this.models.IncomingInvoice.create({ date, quantity, price, ProductId: productId }, { transaction });

      const incomingInvoices = await this.models.IncomingInvoice.findAll({
        where: {
          ProductId: productId,
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

      const product = await this.models.Product.findByPk(productId, { transaction });
      product.stock += quantity;
      await product.save({ transaction });

      await transaction.commit();
      res.status(201).json(invoice);
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = IncomingInvoiceController;
