/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pack', {
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
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: '1'
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
