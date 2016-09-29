/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('modifier_extra_single', {
    /*id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },*/
    id: {
    type: new DataTypes.VIRTUAL(DataTypes.STRING, ['single_id','extra_id','modifier_id']),
    get: function() {
      return this.get('single_id')+'|'+this.get('extra_id')+'|'+this.get('modifier_id');
    }
  },
    single_id: {
      type: DataTypes.INTEGER,
      allowNull: false,primaryKey: true,
    },
    extra_id: {
      type: DataTypes.INTEGER,
      allowNull: false,primaryKey: true,
    },
    modifier_id: {
      type: DataTypes.INTEGER,
      allowNull: false,primaryKey: true,
    },
    variation: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    default: {
      type: DataTypes.BOOLEAN,
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
