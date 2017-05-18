// Creating our matrix model
module.exports = function(sequelize, DataTypes) { 
  var Matrix = sequelize.define("Matrix", {   
    Pos: { 
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    Mon: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Tues: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Wed: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Thur: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Fri: {
      type: DataTypes.STRING,
      allowNull: true
    },
    SatSun: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
    {
      classMethods: {
        associate: function(models) {
          //each staff is part of a user. period
          Matrix.belongsTo(models.User, {
            allowNull: true
          });
        }
      }
    }
  );
  return Matrix;
};