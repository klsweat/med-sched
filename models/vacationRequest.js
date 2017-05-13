module.exports = function(sequelize, DataTypes) { 
  var VacationRequest = sequelize.define("VacationRequest", {
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'Pending'
    }
  },
    {
      classMethods: {
        associate: function(models) {
          //each staff is part of a user. period
          VacationRequest.belongsTo(models.Staff, {
            foreignKey: {
              allowNull: false
            }
          });
        }
      }
    }
  );
  return VacationRequest;
};