// Connect string to MySQL
var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'cis550.cautcaubut2r.us-east-1.rds.amazonaws.com',
  user     : 'cis550_group14',
  password : 'vrgp14&vra',
  database : 'olympics'
});



exports.do_work = function(req, res){
  res.render('players', {});
};

exports.do_ref = function(req, res){
  init_query_db(res);
};

exports.sports_query = function(req, res){
  query_db(res,req); //req send to retrieve the values sent from sports.ejs file
};

exports.do_event = function(req, res){
  	get_event(res,req.query.sport);   // .query.sport because data is sent by GET method
};

exports.do_season = function(req, res){
  	get_season(res,req.query.edition);   // .query.edition because data is sent by GET method
};

exports.do_sport = function(req, res){
  	get_sport(res,req.query.edition,req.query.season);   // .query.edition because data is sent by GET method
};

function get_event(res, sport){
		var connection = require('../app').mysqlConnection;
		var query="SELECT distinct Event From Athlete_won where Sport='" + sport +"' ;";
		connection.query(query, function(err, rows, fields) {
			if (err) {
				console.log(err);	
					 }
			else {
								
			     res.send(rows);
		 		 }
		     				 });
}


function get_season(res, edition){
		var connection = require('../app').mysqlConnection;
		var query="SELECT distinct Season From Medal_Tally where Year=" + edition +" ;";
		connection.query(query, function(err, rows, fields) {
			if (err) {
				console.log(err);	
					 }
			else {
								
			     res.send(rows);
		 		 }
		     				 });
}

function get_sport(res, edition, season ){
		var connection = require('../app').mysqlConnection;
		var query="SELECT distinct Sport From Athlete_won where Year=" + edition +" and Season='" + season + "';";
		connection.query(query, function(err, rows, fields) {
			if (err) {
				console.log(err);	
					 }
			else {
								
			     res.send(rows);
		 		 }
		     				 });
}





//init_query_db called for displaying the drop down list in search.ejs
function init_query_db(res) {
	var connection = require('../app').mysqlConnection;
	var query1 = "SELECT distinct Year FROM Medal_Tally;";
	var query2 = "SELECT distinct Season FROM Medal_Tally;";
	var query3 = "SELECT distinct Sport FROM Athlete_won;";
	var query4 = "SELECT distinct Event FROM Athlete_won;";
	
	connection.query(query1, function(err, rows1, fields) {
		if (err) {
			console.log(err);	
		}
		else {

		connection.query(query2, function(err, rows2, fields) {
				if (err) {
					console.log(err);	
				}
				else {
					connection.query(query3, function(err, rows3, fields) {
						if (err) {
						console.log(err);	
								 }
						else {
							    console.log(rows2);
								console.log("1111");
								connection.query(query4, function(err, rows4, fields) {
								if (err) {
								console.log(err);	
										 }
								else {
									
								     res.render('sports',{result1: rows1, result2: rows2, result3:rows3, result4:rows4, isresult:false })
							 		 }

				     				 });
							 }
				     });
			   }
		});
	}
});

}


// Query the oracle database, and call output_actors on the results
//
// res = HTTP result object sent back to the client

// name = Name to query for
function query_db(res, req) {
	
	var connection = require('../app').mysqlConnection;
	var choice = true;
	var query = '';

	if (req.body.sports != 'NULL' && req.body.events =='NULL')
	{ 
		console.log('@@@@@@@@@@@@@@@@@@@@@@@@@');
		choice = false;
		query ="SELECT Event,Name,Country,medal FROM Athlete_won where Year="+ req.body.edition + " and Season='" + req.body.season +"' and Sport='" + req.body.sports +"' order by Event, medal ;" ;
    }
    else if (req.body.events !='NULL' && req.body.sports !='NULL')
    {
    	console.log('*************************');
    	choice = false;
    	query ="SELECT Event, Name,Country,medal FROM Athlete_won where Year="+ req.body.edition + " and Season='" + req.body.season +"' and Event='" + req.body.events +"' and Sport='" + req.body.sports +"' order by medal;";
    }
    else
    {
    	console.log('^^^^^^^^^^^^^^^^^^^^^^^^^');
    	query ="SELECT * FROM Medal_Tally where Year="+ req.body.edition + " and Season='" + req.body.season +"';";
    }

	//if (login) query = query + " WHERE login='" + login + "'";
	console.log(query);
	
	connection.query(query, function(err, rows, fields) {
		if (err) {
			console.log(err);	
		}
		else {
			output_sports(res, rows, req, choice);
		}
	});
}


// ///
// Given a set of query results, output a table
//
// res = HTTP result object sent back to the client
// name = Name to query for
// results = List object of query results
function output_sports(res, results, req, choice) {
	var connection = require('../app').mysqlConnection;
	var query1 = "SELECT distinct Year FROM Medal_Tally;";
	var query2 = "SELECT distinct Season FROM Medal_Tally;";
	var query3 = "SELECT distinct Sport FROM Athlete_won;";
	var query4 = "SELECT distinct Event FROM Athlete_won;";
	
	connection.query(query1, function(err, rows, fields) {
		if (err) {
			console.log(err);	
		}
		else {

		connection.query(query2, function(err, rows1, fields) {
				if (err) {
					console.log(err);	
				}
				else {
					connection.query(query3, function(err, rows2, fields) {
						if (err) {
						console.log(err);	
								 }
						else {							   
								connection.query(query4, function(err, rows3, fields) {
								if (err) {
								console.log(err);	
										 }
								else {
									
								     res.render('sports',{result:results, result1: rows, result2: rows1, result3:rows2, result4:rows3, isresult:true, choice:choice, req })
							 		 }

				     				 });
							 }
				     });
			   }
		});
	}
});
}