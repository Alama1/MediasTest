const { Model, DataTypes } = require('sequelize');

class Cost extends Model {
    init(sequelize) {
        return super.init({
            id: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            date: DataTypes.DATE,
            value: DataTypes.DECIMAL(10, 2)
        }, { sequelize, modelName: 'cost' });
    }
}

module.exports = Cost;