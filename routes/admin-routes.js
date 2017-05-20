// Requiring our custom middleware for checking if a user is logged in
// and our sequelize models
const isAuthenticated = require("../config/middleware/isAuthenticated"),
	  isAdmin = require("../config/middleware/isAdmin"),
	  isScheduler = require("../config/middleware/isScheduler"),
	  moment = require('moment'),
	  db = require('../models');

module.exports = function(app) {

	app.get('/admin', isAuthenticated, isScheduler, function(req, res){
		let admin = false;
		if( req.user.Group.userType === 'admin'){
			admin = true;
		}
		
		res.render('admin', {superAdmin: admin});
		
	});

	app.get('/admin/vacations', isAuthenticated, isScheduler, function(req, res){
		db.VacationRequest.findAll({include: [{
										model: db.User,
										As: 'User',
										include: [db.Status, db.Partner]}
										]})
						  .then( function( data ) {
						  	 for(let i in data){
						  	 	data[i].start_date = moment( data[i].start_date ).format('MMM DD, YYYY');
						  	 	data[i].end_date = moment( data[i].end_date ).format('MMM DD, YYYY');
						  	 }
						  	  //console.log( "Here is the VACAY DATAY: \n ----------- \n", data[0].start_date );
						  	 res.render('vacationAdmin', {admin: true, vacation: data});
						  }).catch( function(error) {
						  	 console.log(error.message);
						  });
	});

	app.get('/admin/add-user', isAuthenticated, isAdmin, function( req, res ) {
		let dataObj = {};
		dataObj.admin = true;

		if( req.query.failed ){
			dataObj.failed = req.query.failed;
			dataObj.message = req.query.msg;
			console.log('-----', dataObj.message, '-------')
		}
		db.Partner.findAll({})
				  .then( function( data ) {
				  	 dataObj.Partner = data;
				  	 db.Group.findAll({}).then(function(data){
				  	 	dataObj.Group = data;
				  	 	db.Status.findAll({}).then(function(data){
				  	 		dataObj.Status = data;
				  	 		res.render('add-user', dataObj);
				  	 	}).catch( function( error ){ console.log(error.message); res.sendStatus(400) });
				  	 }).catch( function( error ){ console.log(error.message); res.sendStatus(400) });
				  }).catch( function( error ){ console.log(error.message); res.sendStatus(400) });
	});


	app.get('/admin/add-partner', isAuthenticated, isAdmin, function( req, res ) {
		res.render('add-partner', {admin: true});
	});

	app.get('/matrix', isAuthenticated, isScheduler, function(req, res) {	
	 	res.render('matrix', {admin: true});
	 });

	app.put('/admin/vacations', isAuthenticated, isAdmin, function( req, res ) {
		db.Vacation.update( req.body, {where: {id: req.body.id} })
				   .then( function( data ) {
				   	 res.redirect('/admin/vacations');
				   }).catch( function( error ) {
				   	 console.log(error.message);
				   });
	});

	app.post('/admin/partner', isAuthenticated, isAdmin, function( req, res ) {
		db.Partner.create( req.body )
				  .then( function( data ){
				  	res.render('add-partner');
				  }).catch( function(error) {
				  	console.log(error.message);
				  	res.send(400);
				  });
	});

}