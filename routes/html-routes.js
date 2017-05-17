// Requiring our custom middleware for checking if a user is logged in
// and our sequelize models
const isAuthenticated = require("../config/middleware/isAuthenticated"),
	  db = require('../models');

module.exports = function(app) {

	console.log('html-routes hit');

	app.get('/', function(req, res) {

	    console.log('/ hit')
	    res.redirect('/schedule');
	});

	app.get('/matrix', isAuthenticated, function(req, res) {
		console.log('/matrix hit');
	 	res.render('matrix');
	 });

	app.get("/login", function(req, res) {
    // If the user already has an account send them to the members page
	    // if (req.user) {
	    //   res.redirect("/");
	    // }
	    console.log('/login hit')
	    res.render('login');
	});

	app.get('/vacations', isAuthenticated, function(req, res){
		// if (!req.user) {
		// 	res.redirect('/');
		// }
		db.VacationRequest.findAll({where: {UserId: req.user.id}})
				   .then( function( data ){
					   console.log("VACAY DATAY:", data);
				   	 res.render('vacation', {vacation: data});
				   }).catch(function(error){
				   	 console.log(error.message);
				   });
	});

	app.get('/account', isAuthenticated, function(req, res){
		// if (!req.user) {
		// 	res.redirect('/');
		// }
		db.User.findOne({where: {id: req.user.id}})
				   .then( function( data ){
				   	 res.render('account', {user: data});
				   }).catch(function(error){
				   	 console.log(error.message);
				   });
	});

	app.get('/schedule', isAuthenticated, function( req, res ){
		db.User.findAll({})
			   .then(function(data){
					//some stuff to be filled in
					res.render( 'schedule', {user: data} );
				}).catch( function(error) {
					console.log(error.message);
					res.send(400);
				});
	});

	app.get('/projection', isAuthenticated, function( req, res ){
		db.User.findAll({})
			   .then(function(data){
					//some stuff to be filled in
					res.render( 'projection', {week: data} );
				}).catch( function(error) {
					console.log(error.message);
					res.send(400);
				});
	});



}