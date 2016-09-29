/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('price', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,autoIncrement: true
    },
    single_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    pack_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    units: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '1'
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '9999'
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    validity_start: {
      type: DataTypes.DATE,
      allowNull: true
    },
    validity_end: {
      type: DataTypes.DATE,
      allowNull: true
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: '1'
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: '0'
    },
    created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true
    }
  });
};
