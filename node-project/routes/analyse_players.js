exports.analyse = function(req, res){
	res.render('analyse_players', {});
};

exports.get_data = function(req, res){
	if(req.body.sport=='NULL')
	{
		query_form(res, req.body.player, req.body.country, req.body.sport, 'NULL');	
	}
	else
  		query_form(res, req.body.player, req.body.country, req.body.sport, req.body.events);   
};

exports.get_data_country = function(req, res){
  	get_country(res,req.query.player);   // .query.sport because data is sent by GET method
};

exports.get_data_sport = function(req, res){
  	get_sport(res,req.query.player, req.query.country);   // .query.sport because data is sent by GET method
};

exports.get_data_event = function(req, res){
  	get_event(res,req.query.player, req.query.country, req.query.sport);   // .query.sport because data is sent by GET method
};


function query_form(res, player, country, sport, events) {

	var connection = require('../app').mysqlConnection;
	var choice = true;

	if (sport == 'NULL' && events =='NULL')
	{ 
		console.log('@@@@@@@@@@@@@@@@@@@@@@@@@');
		choice = false;
		query ="SELECT * FROM Athlete_won where Name='"+ player + "' and Country='" + country +"';" ;
    }
    else if ( sport!='NULL' && events =='NULL')
    {
    	console.log('*************************');
    	choice = false;
    	query ="SELECT * FROM Athlete_won where Name='"+ player + "' and Country='" + country +"' and Sport='" + sport +"';" ;
    }
    else
    {
    	console.log('^^^^^^^^^^^^^^^^^^^^^^^^^');
    	query ="SELECT * FROM Athlete_won where Name='"+ player + "' and Country='" + country +"' and Sport='" + sport +"' and Event='" + events +"';" ;
    }

	//if (login) query = query + " WHERE login='" + login + "'";
	console.log(query);
	
	connection.query(query, function(err, rows, fields) {
		if (err) {
			console.log(err);	
		}
		else {
			output_sports(res, rows, player, country, sport, events, choice);
		}
	});
}


function output_sports(res, result, player, country, sport, events, choice) {
	
		res.send({result: result, player: player, country: country, sport: sport, events: events});
							 		 
}


function get_country(res, player){
		var connection = require('../app').mysqlConnection;
		query="SELECT distinct Country From Athlete_won where Name='" + player +"' ;";
		console.log(query);
		connection.query(query, function(err, rows, fields) {
			if (err) {
				console.log(err);	
					 }
			else {
								
			     res.send(rows);
		 		 }
		     				 });
}


function get_sport(res, player, country){
		var connection = require('../app').mysqlConnection;
		query="SELECT distinct Sport From Athlete_won where Name='" + player +"' and Country='" + country + "';";
		connection.query(query, function(err, rows, fields) {
			if (err) {
				console.log(err);	
					 }
			else {
								
			     res.send(rows);
		 		 }
		     				 });
}

function get_event(res, player, country, sport){
		var connection = require('../app').mysqlConnection;
		query="SELECT distinct Event From Athlete_won where Name='" + player +"' and Country='" + country + "' and Sport='" + sport + "';";
		connection.query(query, function(err, rows, fields) {
			if (err) {
				console.log(err);	
					 }
			else {
								
			     res.send(rows);
		 		 }
		     				 });
}






