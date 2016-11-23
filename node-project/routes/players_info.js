function find_player(res, name, country){
	var collection = require('../app').mongoConnection.collection('players');
	console.log(name);
	console.log(country);
	collection.findOne({"_id.name": name, "_id.country": country}).then(function(result){
		console.log(result);
		var connection = require('../app').mysqlConnection;
		var sql = "SELECT Year, Season, Sport, Event, medal FROM Athlete_won WHERE Name LIKE '" + name + "' AND Country LIKE '" + country + "';"
		console.log(sql);
		connection.query(sql, function(err, rows, fields){
			if (err) {
				console.log(err);
				res.render('players_info', {mongo_result: result, is_mongo_result: true});
			}
			else {
				console.log(rows);
				res.render('players_info', {mongo_result: result, is_mongo_result: true, mysql_result: rows, is_mysql_result: true});
			}
		});
	});
}

exports.players_info = function(req, res){
	var name = "";
	var country = "";
	console.log(req.body.name);
	console.log(req.body.country);
	if(req.body.name){
		name = req.body.name;
	}
	if(req.body.country){
		country = req.body.country;
	}	
	var result = find_player(res, name, country);
};