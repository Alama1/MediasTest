const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OutgoingInvoice = sequelize.define('OutgoingInvoice', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });

  OutgoingInvoice.associate = (models) => {
    OutgoingInvoice.hasMany(models.OutgoingInvoiceItem, { foreignKey: 'invoiceId' });
  };

  return OutgoingInvoice;
};
