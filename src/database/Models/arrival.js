const { Model, DataTypes } = require('sequelize');

class Arrival extends Model {
    init(sequelize) {
        return super.init({
            id: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            date: DataTypes.DATE,
            products: DataTypes.JSONB
        }, { sequelize, modelName: 'arrival' });
    }
}

module.exports = Arrival;