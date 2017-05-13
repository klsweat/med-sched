module.exports = function(sequelize, DataTypes) { 
  var Status = sequelize.define("Status", {
    status: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
    {
      classMethods: {
        associate: function(models) {
          //each staff is part of a user. period
          Status.hasMany(models.User, {
            as: 'Group'
          });
        }
      }
    }
  );
  return Status;
};