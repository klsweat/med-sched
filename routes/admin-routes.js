// Requiring our custom middleware for checking if a user is logged in
// and our sequelize models
const isAuthenticated = require("../config/middleware/isAuthenticated"),
	  db = require('../models');

module.exports = function(app) {

	app.get('/admin', function(req, res){
		let admin = {admin: false}

		if(req.user.group === 'employee') {
			res.redirect('/');
		}
		if( req.user.group ==='admin') {
			admin.admin = true;
		}	
		
		res.render('admin', admin);
		
	});

	app.get('/admin/vacations', function(req, res){
		if(req.user.group !== 'admin'){
			res.redirect('/');
		}
		db.VacationRequest.findAll({ })
						  .then( function( data ) {
						  	 res.render('vacationAdmin', {vacation: data});
						  }).catch( function(error) {
						  	 console.log(error.message);
						  });

	});
}