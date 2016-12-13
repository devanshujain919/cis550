var Bing = require('node-bing-api')({ accKey: "6b143762bd1f455bbd91ca561a283dfb" });

exports.bing_search = function(req, res){
  console.log(req.body);

  	var q = "olympics " + req.body.edition + " " + req.body.season + " " + req.body.sports + " " + req.body.events; 
	
	Bing.web(encodeURIComponent(q), {
	    top: 10 // Number of results (max 50)
	  }, function(error, response, body){	  
	    console.log(body.webPages.value);
	    res.render('bing_results', {result: body.webPages.value}); 
	  });
	
  	

};