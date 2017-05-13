// Requiring our custom middleware for checking if a user is logged in
// and our sequelize models
const isAuthenticated = require("../config/middleware/isAuthenticated"),
	  db = require('../models');

module.exports = function(app) {
	 

	app.post('/api/matrix', function(req, res) {
		
	});
}