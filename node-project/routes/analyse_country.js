exports.analyse = function(req, res){
	var connection = require('../app').mysqlConnection;
	var sql = "SELECT DISTINCT Year FROM Olympics;"
	console.log(sql);
	connection.query(sql, function(err, rows, fields){
		if (err) {
			console.log(err);
			res.render('analyse_country', {is_year_from: false, is_year_to: false});
		}
		else {
			res.render('analyse_country', {is_year_from: true, is_year_to: false, year_from: rows});
		}
	});
};

exports.get_year_from = function(req, res){
	var connection = require('../app').mysqlConnection;
	var sql = "SELECT DISTINCT Year FROM Olympics;"
	console.log(sql);
	connection.query(sql, function(err, rows, fields){
		if (err) {
			console.log(err);
			res.send({error: true});
		}
		else {
			res.send({year_from: rows});
		}
	});
}

exports.get_year_to = function(req, res){
	var connection = require('../app').mysqlConnection;
	var year_from = req.body.year_from;
	if(!year_from){
		res.send({error: true});
	}
	else{
		var sql = "SELECT DISTINCT Year FROM Olympics WHERE Year >= " + year_from +";"
		console.log(sql);
		connection.query(sql, function(err, rows, fields){
			if (err) {
				console.log(err);
				res.send({error: true});
			}
			else {
				res.send({year_to: rows});
			}
		});
	}
}

exports.get_data = function(req, res){
	var country = '';
	var from = '';
	var to = '';

	if(req.body.country){
		country = req.body.country;
		if(req.body.from != 0){
			from = req.body.from;
			to = req.body.to;
		}
	}

	if(country == ''){
		res.send({error: true});
	}
	else{
		send_data(country, from, to, res);
	}

}

send_data = function(country, from, to, res){
	var connection = require('../app').mysqlConnection;
	var sql = '';
	if(from == '' || to == ''){
		sql = "SELECT DISTINCT O.Year, AVG(S.Population) AS Population, AVG(S.GDP) AS GDP, AVG(Health) AS Health FROM Olympics O, Statistics S WHERE S.Country LIKE '" + country + "' AND O.Year - S.Year <=3 AND O.Year - S.Year >=0 GROUP BY O.Year;"
	}
	else{
		sql = "SELECT DISTINCT O.Year, AVG(S.Population) AS Population, AVG(S.GDP) AS GDP, AVG(Health) AS Health FROM Olympics O, Statistics S WHERE S.Country LIKE '" + country + "' AND O.Year >= " + from + " AND O.Year <= " + to + " AND O.Year - S.Year <=3 AND O.Year - S.Year >=0 GROUP BY O.Year;"
	}
	console.log(sql);
	connection.query(sql, function(err, rows, fields){
		if (err) {
			console.log(err);
		}
		else {
			var results = {
				'stat': JSON.stringify(rows)
			};
			sql = "SELECT * FROM Medal_Tally WHERE Country LIKE '" + country + "';";
			console.log(sql);
			connection.query(sql, function(err, rows, fields){
				if (err) {
					console.log(err);
				}
				else {
					results['result'] = JSON.stringify(rows)
					console.log(results);
					res.send(results);
				}
			});
		}
	});
};