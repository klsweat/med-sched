module.exports = function(sequelize, DataTypes) { 
  var Group = sequelize.define("Group", {
    userType: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
    {
      classMethods: {
        associate: function(models) {
          //each staff is part of a user. period
          Group.hasMany(models.User, {
            as: 'Group'
          });
        }
      }
    }
  );
  return Group;
};