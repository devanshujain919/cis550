exports.autocomplete_player = function(req, res){
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

exports.autocomplete_sport = function(req, res){
	console.log(req);
	var connection = require('../app').mysqlConnection;
	var sql = "SELECT DISTINCT Sport FROM Events WHERE Sport LIKE '%" + req.query.sport + "%';"
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

exports.autocomplete_event = function(req, res){
	console.log(req);
	var connection = require('../app').mysqlConnection;
	var sql = "SELECT DISTINCT Event FROM Events WHERE Event LIKE '%" + req.query.event + "%' AND SPORT LIKE '" + req.query.sport + "';"
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