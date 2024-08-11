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
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  });

  OutgoingInvoice.associate = (models) => {
    OutgoingInvoice.belongsTo(models.Product);
  };

  return OutgoingInvoice;
};
