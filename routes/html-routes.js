// Requiring our custom middleware for checking if a user is logged in
// and our sequelize models
const isAuthenticated = require("../config/middleware/isAuthenticated"),
	  notAuthenticated = require("../config/middleware/notAuthenticated"),
	  db = require('../models');

module.exports = function(app) {

	

	app.get('/', isAuthenticated, function(req, res) {

	    
	    res.redirect('/schedule');
	});

	app.get('/matrix', isAuthenticated, function(req, res) {
		console.log('/matrix hit');
	 	res.render('matrix');
	 });

	app.get("/login", notAuthenticated, function(req, res) {
    	// If the user is already logged in, send them to the root
	   
	    console.log('/login hit')
	    res.render('login');
	});

	app.get('/vacations', isAuthenticated, function(req, res){
		// if (!req.user) {
		// 	res.redirect('/');
		// }
		db.VacationRequest.findAll({where: {UserId: req.user.id}})
						  .then( function( data ){
							//   console.log("VACAY DATAY:", data);
						   	res.render('vacation', {vacation: data});
						  }).catch(function(error){
						   	console.log(error.message);
							res.sendStatus(400);
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
				res.sendStatus(400);
			   });
	});

	app.get('/schedule', isAuthenticated, function( req, res ){
		db.User.findAll({ include: [db.Status] })
			   .then(function( data ){
			   		let dataObj = {};
					for(let i = 0; i < data.length; i++) {
						if( data[i].StatusId ) {
							
							dataObj[ data[i].Status.status ] = dataObj[ data[i].Status.status ] || [];
							
							dataObj[ data[i].Status.status ].push( data[i] );
						}
					}
					// console.log('dataobj', dataObj )
					res.render('schedule', {status: dataObj});
				}).catch( function(error) {
					console.log(error.message);
					res.sendStatus(400);
				});
	});

	app.get('/projection', isAuthenticated, function( req, res ){
		db.User.findAll({})
			   .then(function(data){
					//some stuff to be filled in
					res.render( 'projection', {week: data} );
				}).catch( function(error) {
					console.log(error.message);
					res.sendStatus(400);
				});
	});



}