const { Op } = require('sequelize');

async function getCostPriceOnDate(productId, date, models) {

  date = new Date(date).toISOString()

  try {
    const costPriceRecord = await models.CostPrice.findAll({
      where: {
        productId,
        date: {
          [Op.lte]: date
        }
      },
      order: [['date', 'DESC']]
    });

    if (!costPriceRecord) {
      throw new Error('No cost price record found for the given product and date');
    }

    return costPriceRecord;
  } catch (error) {
    console.error('Error fetching cost price:', error);
    throw error;
  }
}

module.exports = getCostPriceOnDate;
