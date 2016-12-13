/**
 * Module dependencies.
 */
var express = require('express')
  , routes = require('./routes/index')
  , search_players = require('./routes/search_players')
  , search_sports = require('./routes/search_sports')
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
  , passport = require('passport')
  , mongoose = require('mongoose')
  , session = require('express-session')
  , flash = require('connect-flash')
  , bing = require('./routes/bing')
;


// Initialize express
var app = express();
// .. and our app
init_app(app);

// When we get a request for {app}/ we should call routes/index.js

app.get('/', routes.login_index);
app.get('/home', routes.home);

app.get('/search/players', search_players.search_players);
app.get('/autocomplete-player', autocomplete.autocomplete_player);
app.get('/autocomplete-country', autocomplete.autocomplete_country);
app.get('/autocomplete-sport', autocomplete.autocomplete_sport);
app.get('/autocomplete-event', autocomplete.autocomplete_event);

app.get('/search/sports', search_sports.do_ref);
app.get('/analyse/country', analyse_country.analyse);

app.get('/analyse/players', analyse_players.analyse);

app.post('/analyse/players/get-data', analyse_players.get_data);
app.get('/analyse/players/get-data-country', analyse_players.get_data_country);
app.get('/analyse/players/get-data-sport', analyse_players.get_data_sport);
app.get('/analyse/players/get-data-event', analyse_players.get_data_event);

app.post('/analyse/country/get-data', analyse_country.get_data);
app.post('/analyse/country/get-year-to', analyse_country.get_year_to);
app.post('/search/players', search_players.query_players);
app.post('/players', players_info.players_info);

app.get('/search/sports/get_events', search_sports.do_event); //this is for the ajax file
app.get('/search/sports/get_season', search_sports.do_season);
app.get('/search/sports/get_sport', search_sports.do_sport);
app.post('/search/sports', search_sports.sports_query); //post method defined for data transferred by user from sports.ejs page.

app.post('/bing/search-sport', bing.bing_search_sport);
app.post('/bing/search-player', bing.bing_search_player);

require('./config/passport')(passport);
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


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

	app.use(express.static(path.join(__dirname, 'public')));
	app.use(express.bodyParser());

	// required for passport
	app.use(session({
	    secret: 'olympediaproject', // session secret
	    resave: true,
	    saveUninitialized: true
	}));
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session


	app.use(express.favicon());
	// Set the express logger: log to the console in dev mode
	app.use(express.logger('dev'));
	
	app.use(express.methodOverride());
	app.use(app.router);
	// Use Stylus, which compiles .styl --> CSS
	app.use(stylus.middleware(
	  { src: __dirname + '/public'
	  , compile: compile
	  }
	));
	

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
	
	mongoose.connect(url); // connect to our database

	var mysqlConnection;
	exports.mysqlConnection = mysql.createConnection({
		host     : 'cis550.cautcaubut2r.us-east-1.rds.amazonaws.com',
		user     : 'cis550_group14',
		password : 'vrgp14&vra',
		database : 'olympics'
	});
}
