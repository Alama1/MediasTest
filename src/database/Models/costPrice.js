const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CostPrice = sequelize.define('CostPrice', {
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  });

  CostPrice.associate = (models) => {
    CostPrice.belongsTo(models.Product);
  };

  return CostPrice;
};
