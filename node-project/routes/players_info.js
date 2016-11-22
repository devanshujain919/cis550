var mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient;

var url = 'mongodb://devanshu:vrgp14&vra@ec2-52-91-123-32.compute-1.amazonaws.com:27017/admin';

var dbConnection;

connect();

function connect(){
	MongoClient.connect(url, function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
			dbConnection = null;
		} 
		else {
			console.log('Connection established to', url);
			dbConnection = db;
		}
	});
	console.log(dbConnection == null);
}

function find_player(res, name, country){
	console.log(dbConnection == null);
	var collection = dbConnection.collection('players');
	console.log(name);
	console.log(country);
	collection.findOne({"_id.name": name, "_id.country": country}).then(function(result){
		console.log(result);
		res.render('players_info', {result: result, is_result: true});
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