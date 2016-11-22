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

function find_players(res, name, country){
	console.log(dbConnection == null);
	var collection = dbConnection.collection('players');
	var regexName = new RegExp(name);
	var regexCountry = new RegExp(country);
	console.log(regexName);
	console.log(regexCountry);
	collection.find({"_id.name": {$regex: regexName, $options: 'i'}, "_id.country": {$regex: regexCountry, $options: 'i'}}, {"_id":1}).toArray().then(function(result){
		console.log(result);
		res.render('players', {result: result, is_result: true});
	});
}

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