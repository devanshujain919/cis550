exports.analyse = function(req, res){
	res.render('analyse_players', {});
};

exports.get_data = function(req, res){
	var player = '';
	var country = '';
	var sport = '';
	var event = '';

	if(req.body.player){
		player = req.body.player;
		if(req.body.country){
			country = req.body.country;
			if(req.body.sport){
				sport = req.body.sport;
				if(req.body.event){
					event = req.body.event;
				}
			}
		}
	}
	if(player == '' || country == ''){
		res.send({is_error: true});
	}
	else{
		//send_data(country, sport, event, res);
	}

}