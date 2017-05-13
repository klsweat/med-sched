module.exports = function(sequelize, DataTypes) { 
  var Staff = sequelize.define("Staff", {
    posn_status: {
      type: DataTypes.STRING
    }
  },
    {
      classMethods: {
        associate: function(models) {
          //each staff is part of a user. period
          Staff.belongsTo(models.Partner, {
            foreignKey: {
              allowNull: false
            }
          });

          Staff.belongsTo(models.User, {
            foreignKey: {
              allowNull: false
            }
          });

          Staff.hasMany(models.Vacation, {
            onDelete: 'cascade'
          });

          Staff.hasMany(models.VacationRequest, {
            onDelete: 'cascade'
          });

        }
      }
    }
  );
  return Staff;
};