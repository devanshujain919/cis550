var Bing = require('node-bing-api')({ accKey: "6b143762bd1f455bbd91ca561a283dfb" });

exports.bing_search_sport = function(req, res){
  console.log(req.body);

  	var q = "olympics " + req.body.edition + " " + req.body.season + " " + req.body.sports + " " + req.body.events; 
	
	Bing.web(encodeURIComponent(q), {
	    top: 10 // Number of results (max 50)
	  }, function(error, response, body){	  
	    console.log(body.webPages.value);
	    res.render('bing_sports_results', {result: body.webPages.value}); 
	  });
	
  	

};

exports.bing_search_player = function(req, res){
  console.log(req.body);

  	var q = "olympics 2 " + req.body.name + " " + req.body.country;

  	console.log(q);
	
	Bing.web(encodeURIComponent(q), {
	    top: 10 // Number of results (max 50)
	  }, function(error, response, body){	  
	    console.log(body.webPages.value);
	    res.render('bing_players_results', {result: body.webPages.value}); 
	  });
	
  	

};