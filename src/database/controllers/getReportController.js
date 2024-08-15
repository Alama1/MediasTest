const { Op } = require('sequelize');

class SalesReportController {
  constructor(models) {
    this.models = models;
  }

  async getDailySalesReport(req, res) {
    let { from, to } = req.query;

    try {
        //Да даа, я не знаю чого мені захотілось капіталізувати деякі слова, щоб тепер лапки скрізь ставить...
      const salesReport = await this.models.sequelize.query(`
        SELECT 
          DATE(o.date) AS date,
          SUM(oi.quantity * oi.price) AS summ,
          SUM(oi.quantity * cp.value) AS cost,
          SUM(oi.quantity * oi.price) - SUM(oi.quantity * cp.value) AS profit,
          (SUM(oi.quantity * oi.price) - SUM(oi.quantity * cp.value)) / SUM(oi.quantity * cp.value) * 100 AS profitability
        FROM 
          "OutgoingInvoices" o
        JOIN 
          "OutgoingInvoiceItems" oi ON o.id = oi."invoiceId"
        JOIN 
          "CostPrices" cp ON oi."productId" = cp."productId" AND DATE(o.date) = DATE(cp.date)
        WHERE 
          o.date BETWEEN :from AND :to
        GROUP BY 
          DATE(o.date)
        ORDER BY 
          DATE(o.date);
      `, {
        replacements: { from, to },
        type: this.models.sequelize.QueryTypes.SELECT
      });

      const total = salesReport.reduce((acc, curr) => {
        acc.summ += curr.summ;
        acc.cost += curr.cost;
        acc.profit += curr.profit;
        return acc;
      }, { date: null, summ: 0, cost: 0, profit: 0, profitability: 0 });

      total.profitability = (total.profit / total.cost) * 100;
      salesReport.push(total);

      res.json(salesReport);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = SalesReportController;
