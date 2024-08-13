const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const IncomingInvoiceItem = sequelize.define('IncomingInvoiceItem', {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });

  IncomingInvoiceItem.associate = (models) => {
    IncomingInvoiceItem.belongsTo(models.IncomingInvoice, { foreignKey: 'invoiceId' });
    IncomingInvoiceItem.belongsTo(models.Product, { foreignKey: 'productId' });
  };

  return IncomingInvoiceItem;
};
