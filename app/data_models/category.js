/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('category', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    parent: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
