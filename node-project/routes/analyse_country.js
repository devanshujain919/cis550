exports.analyse = function(req, res){
	res.render('analyse_country', {});
};

exports.get_data = function(req, res){
	var country = '';
	var sport = '';
	var event = '';

	if(req.body.country){
		country = req.body.country;
		if(req.body.sport){
			sport = req.body.sport;
			if(req.body.event){
				event = req.body.event;
			}
		}
	}

	if(country == ''){
		res.end({is_error: true});
	}
	else{
		send_data(country, sport, event, res);
	}

}

send_data = function(country, sport, event, res){
	var connection = require('../app').mysqlConnection;
	var sql = "SELECT DISTINCT O.Year, AVG(S.Population) AS Population, AVG(S.GDP) AS GDP, AVG(Health) AS Health FROM Olympics O, Statistics S WHERE S.Country LIKE '" + country + "' AND O.Year - S.Year <=3 AND O.Year - S.Year >=0 GROUP BY O.Year;"
	console.log(sql);
	connection.query(sql, function(err, rows, fields){
		if (err) {
			console.log(err);
		}
		else {
			var results = {
				'stat': JSON.stringify(rows)
			};
			if(sport == ''){
				sql = "SELECT * FROM Medal_Tally WHERE Country LIKE '" + country + "';";
				console.log(sql);
				connection.query(sql, function(err, rows, fields){
					if (err) {
						console.log(err);
					}
					else {
						results['rows'] = JSON.stringify(rows)
						res.send(results);
					}
				});
			}
			else if(event == ''){
				sql = "SELECT * FROM Athlete_won WHERE Country LIKE '" + country + "' AND Sport LIKE '" + sport + "';";
				console.log(sql);
				connection.query(sql, function(err, rows, fields){
					if (err) {
						console.log(err);
					}
					else {
						results['rows'] = JSON.stringify(rows)
						res.send(results);
					}
				});
			}
			else{
				sql = "SELECT * FROM Athlete_won WHERE Country LIKE '" + country + "' AND Sport LIKE '" + sport + "' AND Event LIKE '" + event +"';";
				console.log(sql);
				connection.query(sql, function(err, rows, fields){
					if (err) {
						console.log(err);
					}
					else {
						results['rows'] = JSON.stringify(rows)
						res.send(results);
					}
				});
			}
		}
	});
};