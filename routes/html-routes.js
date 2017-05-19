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
		db.Matrix.findAll({ include: [ db.User ]})
				 .then( function(rows) {
				 	res.render('user-matrix', {row: rows});
			   }).catch( function(error) {
			   		console.log(error.message);
			   		res.sendStatus(400);
			   });
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
		db.User.findOne({where: {id: req.user.id}, include: [db.Group, db.Status, db.Partner]})
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

	app.get('/pop-matrix', isAdmin, function(req, res) {
		res.render('pop-matrix');
	});

	app.get('/admin/users', function( req, res ) {
		let dataObj = {};

		db.Partner.findAll({})
				  .then( function( data ) {
				  	 dataObj.Partner = data;
				  	 db.Group.findAll({}).then(function(data){
				  	 	dataObj.Group = data;
				  	 	db.Status.findAll({}).then(function(data){
				  	 		dataObj.Status = data;		  	 		
							db.Users.findAll({ include: [db.Group, db.Status, db.Partner] })
									.then( function( data ) {
									  	dataObj.User = data;
									  	if(req.user.Group.userType === 'admin'){
									  		dataObj.admin = true;
									  	} else {
									  		dataObj.admin = false;
									  	}
									  	res.render('update-users', dataObj);
						   }).catch( function( error ){ console.log(error.message); res.sendStatus(400) });
				  	 	}).catch( function( error ){ console.log(error.message); res.sendStatus(400) });
				  	 }).catch( function( error ){ console.log(error.message); res.sendStatus(400) });
				  }).catch( function( error ){ console.log(error.message); res.sendStatus(400) })


	});	

}