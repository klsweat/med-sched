// Requiring our custom middleware for checking if a user is logged in
// and our sequelize models
const isAuthenticated = require("../config/middleware/isAuthenticated"),
	  isAdmin = require("../config/middleware/isAdmin"),
	  db = require('../models'),
	  moment = require('moment'),
	  fs = require('fs');

module.exports = function(app) {

	app.post('/vacation', isAuthenticated, function(req, res) {
		req.body.start_date =  moment(req.body.start_date).format('YYYY-MM-DD') ;
		req.body.end_date =  moment(req.body.end_date).format('YYYY-MM-DD') ;
		req.body.UserId = req.user.id;
		db.VacationRequest.create( req.body )
				   .then( function( data ) {
				   	 res.redirect('/vacations');
				   }).catch( function( error ) {
				   	 console.log(error.message);
				   });		
	});

	app.put('/account', isAuthenticated, function(req, res) {
		let updateid = req.body.id;
		delete req.body.id;
		db.User.update( req.body, {where: {id: updateid }})
			   .then( function( data ){
					 console.log( data );
			   	 //res.redirect('/account');
			   	 res.redirect(req.get('referer'));
			   }).catch( function( error ) {
			   	 console.log(error.message);
			   });
	});

	app.post('/api/new-matrix', function(req, res) {
		db.Matrix.create( req.body )
				 .then( function(data) {
				 	res.redirect('/matrix');
				 });
	});

	app.put('/api/matrix', isAuthenticated, isAdmin, function(req, res){
				for(var i in req.body.data ){
                    db.Matrix.update( req.body.data[i].newData, {where: {Pos: req.body.data[i].Pos } } )
                    		 .then( function(data){
                    		 	return;
                    	   }).catch( function( error ) {
                    		 	console.log(error);
                    		 	res.sendStatus(400);
                    	   });
				}
				res.json('success');
    });
}