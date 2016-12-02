function find_players(res, name, country){
	var connection = require('../app').mysqlConnection;
	var sql = "SELECT DISTINCT Name, Country FROM Athlete WHERE Name LIKE '%" + name + "%' AND Country LIKE '%" + country + "%';"
	console.log(sql);
	connection.query(sql, function(err, rows, fields){
		if (err) {
			console.log(err);
		}
		else {
			console.log(rows);
			res.render('players', {result: rows, is_result: true});
		}
	});
}

exports.autocomplete_name = function(req, res){
	console.log(req);
	var connection = require('../app').mysqlConnection;
	var sql = "SELECT DISTINCT Name FROM Athlete WHERE Name LIKE '%" + req.query.name + "%';"
	console.log(sql);
	connection.query(sql, function(err, rows, fields){
		if (err) {
			console.log(err);
			res.send({is_result: false});
		}
		else {
			var results = JSON.stringify(rows);
			res.send(results);
		}
	});
};

exports.autocomplete_country = function(req, res){
	console.log(req);
	var connection = require('../app').mysqlConnection;
	var sql = "SELECT DISTINCT Country FROM Athlete WHERE Country LIKE '%" + req.query.country + "%';"
	console.log(sql);
	connection.query(sql, function(err, rows, fields){
		if (err) {
			console.log(err);
			res.send({is_result: false});
		}
		else {
			var results = JSON.stringify(rows);
			res.send(results);
		}
	});
};

exports.search_players = function(req, res){
	res.render('players', {is_result: false});
};

exports.query_players = function(req, res){
	var name = "";
	var country = "";
	if(req.body.pname){
		name = req.body.pname;
	}
	if(req.body.pcountry){
		country = req.body.pcountry;
	}	
	var result = find_players(res, name, country);
};

exports.search_sports = function(req, res){
  res.render('sports', {});
};