const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OutgoingInvoiceItem = sequelize.define('OutgoingInvoiceItem', {
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

  OutgoingInvoiceItem.associate = (models) => {
    OutgoingInvoiceItem.belongsTo(models.OutgoingInvoice, { foreignKey: 'invoiceId' });
    OutgoingInvoiceItem.belongsTo(models.Product, { foreignKey: 'productId' });
  };

  return OutgoingInvoiceItem;
};
