/**
 * Module dependencies.
 */
var express = require('express')
  , routes = require('./routes/index')
  , search = require('./routes/search')
  , autocomplete = require('./routes/autocomplete')
  , players_info = require('./routes/players_info')
  , analyse_country = require('./routes/analyse_country')
  , analyse_players = require('./routes/analyse_players')
  , http = require('http')
  , path = require('path')
  , stylus = require("stylus")
  , nib = require("nib")
  , bodyParser = require('body-parser')
  , mongodb = require('mongodb')
  , mysql = require('mysql')
;

// Initialize express
var app = express();
// .. and our app
init_app(app);

// When we get a request for {app}/ we should call routes/index.js

app.get('/', routes.home);

app.get('/search/sports', search.search_sports);
app.get('/search/players', search.search_players);
app.get('/autocomplete-player', autocomplete.autocomplete_player);
app.get('/autocomplete-country', autocomplete.autocomplete_country);
app.get('/autocomplete-sport', autocomplete.autocomplete_sport);
app.get('/autocomplete-event', autocomplete.autocomplete_event);

app.get('/analyse/country', analyse_country.analyse);
app.get('/analyse/country/get-data', analyse_country.get_data);
app.get('/analyse/players', analyse_players.analyse);
app.get('/analyse/players/get-data', analyse_players.get_data);

app.post('/search/players', search.query_players);
app.post('/players', players_info.players_info);

// Listen on the port we specify
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

///////////////////
// This function compiles the stylus CSS files, etc.
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

//////
// This is app initialization code
function init_app() {
	// all environments
	app.set('port', process.env.PORT || 8080);
	
	// Use Jade to do views
	app.set('views', __dirname + '/views');
	app.engine('html', require('ejs').renderFile);
	app.set('view engine', 'ejs');

	app.use(express.favicon());
	// Set the express logger: log to the console in dev mode
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	// Use Stylus, which compiles .styl --> CSS
	app.use(stylus.middleware(
	  { src: __dirname + '/public'
	  , compile: compile
	  }
	));
	app.use(express.static(path.join(__dirname, 'public')));

	// development only
	if ('development' == app.get('env')) {
	  app.use(express.errorHandler());
	}

	var MongoClient = mongodb.MongoClient;
	var url = 'mongodb://devanshu:vrgp14&vra@ec2-52-91-123-32.compute-1.amazonaws.com:27017/admin';
	var mongoConnection;
	MongoClient.connect(url, function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
			exports.mongoConnection = null;
		} 
		else {
			console.log('Connection established to', url);
			exports.mongoConnection = db;
		}
	});
	var mysqlConnection;
	exports.mysqlConnection = mysql.createConnection({
		host     : 'cis550.cautcaubut2r.us-east-1.rds.amazonaws.com',
		user     : 'cis550_group14',
		password : 'vrgp14&vra',
		database : 'olympics'
	});
}
