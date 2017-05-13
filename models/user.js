// Requiring bcrypt for password hashing. Using the bcrypt-nodejs version as the regular bcrypt module
// sometimes causes errors on Windows machines
var bcrypt = require("bcrypt-nodejs"); 
// Creating our User model
module.exports = function(sequelize, DataTypes) { 
  var User = sequelize.define("User", {   
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
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'mednax1234'
    },
    mobile: {
      type: DataTypes.STRING,
      validate: {
        isNumeric: true,
        len: [10, 10]
      }
    },
    empID: {
      type: DataTypes.STRING
    },
    firstLogin: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
    {
      classMethods: {
        associate: function(models) {
          //each staff is part of a user. period
          User.belongsTo(models.Partner, {
            allowNull: true
          });

          User.belongsTo(models.Status, {
            allowNull: true
          });

          User.belongsTo(models.Group, {
            allowNull: false
          });

          User.hasMany(models.Vacation, {
            onDelete: 'cascade'
          });

          User.hasMany(models.VacationRequest, {
            onDelete: 'cascade'
          });
        }
      },
      // Creating a custom method for our User model. This will check if an unhashed password entered by
      // The user can be compared to the hashed password stored in our database
      instanceMethods: {
        validPassword: function(password) {
          return bcrypt.compareSync(password, this.password);
        }
      },
      // Hooks are automatic methods that run during various phases of the User Model lifecycle
      // In this case, before a User is created, we will automatically hash their password
      hooks: {
        beforeCreate: function(user, options, cb) {
          user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
          cb(null, options);
        }
      }

    }
  );
  return User;
};