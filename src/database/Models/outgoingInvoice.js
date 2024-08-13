const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OutgoingInvoice = sequelize.define('IncomingInvoice', {
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
    IncomingInvoice.hasMany(models.OutgoingInvoiceItem, { foreignKey: 'invoiceId' });
  };

  return OutgoingInvoice;
};
