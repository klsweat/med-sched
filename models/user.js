module.exports = function(sequelize, DataTypes) { 
  var User = sequelize.define("User", {
    username: { 
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1],
        is: /^[a-z]+$/i
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'mednax1234'
    },
    first_name: { 
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1],
        is: /^[a-z]+$/i
      }
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1],
        is: /^[a-z]+$/i
      }
    },
    employee_id: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }
    },
    mobile_telephone: {
      type: DataTypes.STRING,
      validate: {
        isNumeric: true,
        len: [10, 10]
      }
    },
    firstLogin: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    userType: { 
      type: DataTypes.STRING,
      allowNull: false
    }
  },
    {
      classMethods: {
        associate: function(models) {
          //each staff is part of a user. period
          User.hasOne(models.Staff, {
            as: 'Staff',
            onDelete: 'cascade'
          });

        }
      }
    }
  );
  return User;
};