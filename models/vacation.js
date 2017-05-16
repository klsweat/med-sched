module.exports = function(sequelize, DataTypes) { 
  var Vacation = sequelize.define("Vacation", {
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  },
    {
      classMethods: {
        associate: function(models) {
          //each staff is part of a user. period
          Vacation.belongsTo(models.User, {
            foreignKey: {
              allowNull: false
            }
          });
        }
      }
    }
  );
  return Vacation;
};