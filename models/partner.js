module.exports = function(sequelize, DataTypes) { 
  var Partner = sequelize.define("Partner", {
    location: { 
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    }
  },
    {
      classMethods: {
        associate: function(models) {
          //each staff is part of a user. period
          Partner.hasMany(models.User, {
            as: 'User'
          });

        }
      }
    }
  );
  return Partner;
};