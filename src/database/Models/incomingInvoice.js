const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const IncomingInvoice = sequelize.define('IncomingInvoice', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });

  IncomingInvoice.associate = (models) => {
    IncomingInvoice.hasMany(models.IncomingInvoiceItem, { foreignKey: 'invoiceId' });
  };

  return IncomingInvoice;
};
