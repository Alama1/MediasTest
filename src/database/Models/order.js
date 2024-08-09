const { Model, DataTypes } = require('sequelize');

class Order extends Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            date: DataTypes.DATE,
            products: DataTypes.JSONB
        }, { sequelize, modelName: 'order' });
    }
}

module.exports = Order;