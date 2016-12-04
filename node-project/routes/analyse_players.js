exports.analyse = function(req, res){
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