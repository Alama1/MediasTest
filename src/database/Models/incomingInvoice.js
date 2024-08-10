const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const IncomingInvoice = sequelize.define('IncomingInvoice', {
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

  IncomingInvoice.associate = (models) => {
    IncomingInvoice.belongsTo(models.Product);
  };

  return IncomingInvoice;
};
