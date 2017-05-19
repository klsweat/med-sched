// Requiring our custom middleware for checking if a user is logged in
// and our sequelize models
const isAuthenticated = require("../config/middleware/isAuthenticated"),
	  isAdmin = require("../config/middleware/isAdmin"),
	  notAuthenticated = require("../config/middleware/notAuthenticated"),
	  moment = require('moment'),
	  db = require('../models');

module.exports = function(app) {

	app.get('/', isAuthenticated, function(req, res) {
	    
	    res.redirect('/projection');
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
		let admin = false;
		if( req.user.Group.userType === 'admin' || req.user.Group.userType === 'scheduler'){
			admin = true;
		}
		db.User.findAll({ include: [db.Status, db.Partner], order: ['StatusId', 'id']})
			   .then(function(data){
			   		let startDay = req.query.start_date ||  Date.now() ;
			   		let numWeeks = parseInt(req.query.numWeeks) || 13;
			   		let len = data.length;
					let header = {}, 
						week = [];
					//data.sort( idSort );
					for( let i =  0; i < len; i++){

						if( data[i].StatusId ) {

							
							header[ data[i].Status.status ] = header[ data[i].Status.status ] || [];
							
							header[ data[i].Status.status ].push( initialThis( data[i] ) );
						}
					}
					
					for(let i = 0; i < numWeeks; i++){
						week.push([]);
						//console.log('------ good 1 ------');
						week[i].push({day: [moment(startDay).format('DD-MMM')]});
						let k = 1;
						//console.log('------ good 2 ------');
						for(let key in header){
							let tempObj = {};
							tempObj[key] = [];
							
							//console.log('------ good 3 ------');
							// console.log('---', week, '---')
							var numPeople = header[key].length
							// console.log('---', 'People:', numPeople, '---')
							// console.log('---', 'Weeks:', numWeeks, '---')
							//console.log('---', 'i:', i, '---')	

							for(let j = 0; j < numPeople; j++){
								// console.log('---', 'j:', j, '---')					
								// var loopVal = ( (i+j) % numPeople + 1 )
								// console.log('---', 'loopVal:', loopVal, '---')	
								tempObj[key].push( ( ( (i+j) % numPeople) + k ) );
								//console.log('------ good 4 ------');
							}
							week[i].push( tempObj );
							k += numPeople;	
						}
						startDay = moment(startDay).add(7, 'days');
							//console.log('---', week[key].key, week[key], '---')	
					}
					//res.json( week );
					projObj = {admin: admin, header: header, week: week};
					res.render( 'projection', projObj );
					//res.json(projObj);
				}).catch( function(error) {
					console.log('----','this shiz errored','----');
					console.log(error.message);
					res.sendStatus(400);
				});

		//function to return uppercase initials of user's name
		let initialThis = function( user ) {
			return user.first_name.charAt(0).toUpperCase() + user.last_name.charAt(0).toUpperCase();
		}
		//function to sort array by object's id field
		let idSort = function(a,b) {
			return a.id - b.id;
		}
	});

	// app.get('/pop-matrix', isAdmin, function(req, res) {
	// 	res.render('pop-matrix');
	// });

	app.get('/users', isAuthenticated, function( req, res ) {
		let dataObj = {};

		db.Partner.findAll({})
				  .then( function( data ) {
				  	 dataObj.Partner = data;
				  	 db.Group.findAll({}).then(function(data){
				  	 	dataObj.Group = data;
				  	 	db.Status.findAll({}).then(function(data){
				  	 		dataObj.Status = data;		  	 		
							db.User.findAll({ include: [db.Group, db.Status, db.Partner] })
									.then( function( data ) {
									  	dataObj.User = data;
									  	if(req.user.Group.userType === 'admin'){
									  		dataObj.admin = true;
									  	} else {
									  		dataObj.admin = false;
									  	}
									  	res.render('users', dataObj);
						   }).catch( function( error ){ console.log('1', error.message); res.sendStatus(400) });
				  	 	}).catch( function( error ){ console.log('2',error.message); res.sendStatus(400) });
				  	 }).catch( function( error ){ console.log('3',error.message); res.sendStatus(400) });
				  }).catch( function( error ){ console.log('4',error.message); res.sendStatus(400) })


	});	

}

