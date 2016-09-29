/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('single', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,autoIncrement: true
    },
    code: {
      type: DataTypes.INTEGER,
      allowNull: false,unique:'codigo_UNIQUE'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    enabled_single: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: '1'
    },
    enabled_packs: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: '1'
    },
    stock: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: '1'
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    recipe: {
      type: DataTypes.STRING,
      allowNull: true
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: '0',unique:'codigo_UNIQUE'
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
