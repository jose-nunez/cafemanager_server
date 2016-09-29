/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('extra', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    deleted: {
      type: DataTypes.BOOLEAN,
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
