/**
 * Simple Homework 2 application for CIS 550
 */

/**
 * Module dependencies.
 */
var express = require('express')
  , routes = require('./routes/index')
  , search = require('./routes/search')
  , players_info = require('./routes/players_info')
  , http = require('http')
  , path = require('path')
  , stylus = require("stylus")
  , nib = require("nib")
  , bodyParser = require('body-parser')
;

// Initialize express
var app = express();
// .. and our app
init_app(app);

// When we get a request for {app}/ we should call routes/index.js

app.get('/', routes.home);

app.get('/search/sports', search.search_sports);

app.get('/search/players', search.search_players);
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

}
