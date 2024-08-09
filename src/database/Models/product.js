const { Model, DataTypes } = require('sequelize');

class Product extends Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            name: DataTypes.STRING
        }, { sequelize, modelName: 'product' });
    }
}

module.exports = Product;