$(document).ready(function(){

	var global_chart_data = null;

	var player_chart = null;

	$('#query-form').validate({
		rules: {
			'player':{
				required: true
			},
			'country': {
				required: true
			},
			'events': {
				required: function(e){
					return $('#sport').val().length > 0;
				}
			}
		},
		messages: {
			'player':{
				required: 'Please input the Player\'s Name'
			},
			'country': {
				required: 'Please input the Player\'s Country'
			},
			'eventss': {
				required: 'Please input the Sporting Event'
			}
		},
		submitHandler: function(){
			submitForm();
		}
	});


	var submitForm = function(){
		console.log("submitting...");
		var valuesToSubmit = $('#query-form').serializeArray();
		console.log(valuesToSubmit);

		$.ajax({
			type: "POST",
			url: "/analyse/players/get-data",
			data: valuesToSubmit,
			dataType: "JSON",
			beforeSend: function() {
				$('#query-btn').addClass('active');
			},
			success: function(result){
				console.log(result);
				$('#query-btn').removeClass('active');
				$('#chart-region').show();
				process(result);
			
				// TODO
			},
			error: function(result){
				$('#query-btn').removeClass('active');
				console.log(result);
			}
		});
	};

	var process = function(data){
		var result = data.result;
		var player= data.player;
		var country= data.country;
		var sport= data.sport;
		var events= data.events;

		var chart_data= {};

		console.log('data: ')
		console.log(data)

		for(var i = 0 ; i < result.length ; i ++){
			if(!(result[i]['Year'] in chart_data)){
				chart_data[result[i]['Year']] = {};
				if(!('gold' in chart_data[result[i]['Year']])){
					chart_data[result[i]['Year']]['gold'] = 0;
				}
				if(!('silver' in chart_data[result[i]['Year']])){
					chart_data[result[i]['Year']]['silver'] = 0;
				}
				if(!('bronze' in chart_data[result[i]['Year']])){
					chart_data[result[i]['Year']]['bronze'] = 0;
				}
			}
			
			if(result[i]['medal'] == 'GOLD'){
				chart_data[result[i]['Year']]['gold'] += 1;
			}
			if(result[i]['medal'] == 'SILVER'){
				chart_data[result[i]['Year']]['silver'] += 1;
			}
			if(result[i]['medal'] == 'BRONZE'){
				chart_data[result[i]['Year']]['bronze'] += 1;
			}
		}
		console.log(chart_data);
		var processed_chart_data = [];
		for(var key in chart_data){
			processed_chart_data.push({
				'Year': key,
				'Gold': chart_data[key]['gold'],
				'Silver': chart_data[key]['silver'],
				'Bronze': chart_data[key]['bronze']
			});
		}
		console.log('processed')
		console.log(processed_chart_data);
		global_chart_data = processed_chart_data;
		drawChart(processed_chart_data, player, country, sport, events);
		return processed_chart_data;
	}


	var drawChart = function(result, player, country, sport, events){
		$('#player-chart').empty();
		if(result.length > 0){
			$('#player-heading').show();
			$('#player-heading').html('Olympics Records for ' + player + '. <label class="checkbox-inline"><input class="chart-filter" id="summer-gold" type="checkbox" value="gold" checked>Gold</label><label class="checkbox-inline"><input class="chart-filter" id="summer-silver" type="checkbox" value="silver" checked>Silver</label><label class="checkbox-inline"><input class="chart-filter" id="summer-bronze" type="checkbox" value="bronze" checked>Bronze</label>');
			player_chart = new Morris.Bar({
				// ID of the element in which to draw the chart.
				element: 'player-chart',
				barGap: 1,
				barSizeRatio:0.1,
				// Chart data records -- each entry in this array corresponds to a point on
				// the chart.
				data: result,
				// The name of the data record attribute that contains x-values.
				xkey: 'Year',
				xLabels: 'year',
				// A list of names of data record attributes that contain y-values.
				ykeys: ['Gold', 'Silver', 'Bronze'],
				// Labels for the ykeys -- will be displayed when you hover over the
				// chart.
				labels: ['Gold','Silver','Bronze'],

				barColors: ['#FFDF00', '#C0C0C0', '#CD7F32'],

				resize: true,

				hoverCallback: function(index, options, content) {
					var data = options.data[index];
					var content = '';

					content += '<div class="morris-hover-row-label"> Year: ' + data['Year'] + ' </div>';
					if('Gold' in data){
						content += '<div class="morris-hover-point" style="color: #FFDF00"> Gold: ' + data['Gold'] + ' </div>';
					}
					if('Silver' in data){
						content += '<div class="morris-hover-point" style="color: #C0C0C0"> Silver: ' + data['Silver'] + ' </div>';
					}
					if('Bronze' in data){
						content += '<div class="morris-hover-point" style="color: #CD7F32"> Bronze: ' + data['Bronze'] + ' </div>';
					}
					return content;
				}
			});
		}
		else{
			$('#player-heading').html('No record for ' + player);
		}
	}

	$('body').on('click', '.chart-filter', function(e){
		var chart = null;
		var data = null;

		if(!$(this).is(':checked')){
			if($(this).parent().parent().find('input[id!=' + $(this).attr('id') + ']:checked').length == 0){
				$(this).prop('checked', true);
				alert('At least one check box should be selected.');
				return ;
			}
		}

		if($(this).parent().parent().attr('id') == 'player-heading'){
			chart = player_chart;
			data = JSON.parse(JSON.stringify(global_chart_data));
			if(!$('#summer-gold').is(":checked")){
				for(var i = 0 ; i < data.length ; i ++){
					delete data[i]['Gold'];
				}
			}
			if(!$('#summer-silver').is(":checked")){
				for(var i = 0 ; i < data.length ; i ++){
					delete data[i]['Silver'];
				}
			}

			if(!$('#summer-bronze').is(":checked")){
				for(var i = 0 ; i < data.length ; i ++){
					delete data[i]['Bronze'];
				}
			}
		}
		else{
			console.log('Something weird happened');
		}
		
		console.log(data);
		console.log(player_chart);
		chart.setData(data);
	});


		$('#player').autocomplete({

		    source: function(req, res){

        	$('#country').attr({'disabled': 'disabled'});
        	$('#country').empty();
			$('#sport').attr({'disabled': 'disabled'});
			$('#sport').empty();
			$('#events').attr({'disabled': 'disabled'});
			$('#events').empty();

            console.log("auto_complete_on");
            $.ajax({
                data: {
                    name: req.term,
                },
                dataType: 'json',
                url: '/autocomplete-player',
                type: 'GET',
                success: function(data){
                    if(data.length == 0){
                		var result = [
							{
								label: 'No matches found', 
								value: req.term
							}
						];
						res(result);
                	}
                	else{
	                    console.log(data);
	                    var complete_data = [];
	                    for(var i = 0 ; i < data.length ; i ++){
	                        complete_data.push(data[i].Name);
	                    }
	                    res(complete_data);
                   	}
                   	$('#player').trigger('change');
                }
            });
        },
        minLength: 2
    });

	
    
	$('#player').on('keydown focus change autocompleteselect', function(e){
		console.log($('#player'));
		
		if($('#player').val().length > 0){
			$('#country').removeAttr('disabled');

			$.ajax({
					data: {	player:$('#player').val() }, //binding data to sports value selected
					dataType: 'json',                  //defining the type of data expected by the ajax to come back
					url:'/analyse/players/get-data-country',   //correspons to app.js file
					type: 'GET',                       //app.get in app.js
					success: function(data){		   
						console.log(data);
						var html='<option value=NULL>-------</option>';
						for(var i=0;i<data.length;i++)
						{	
							
							html+='<option value="'+ data[i].Country +'">'+ data[i].Country + '</option>';
						}
						$('#country')
    					.find('option')
    					.remove()
    					.end()
    					.append(html);
    					//.val('whatever')

					}


			})

		}
		else{
			$('#country')
			.find('option')
			.val('');
			$('#country').attr({
				'disabled': 'disabled'
			});
		}
	});

	$('#country').on('change', function(e){
		console.log($('#country'));
		
		if($('#country').val().length > 0){
			$('#sport').removeAttr('disabled');
			
			$.ajax({
					data: {	player:$('#player').val(), country:$('#country').val() }, //binding data to sports value selected
					dataType: 'json',                  //defining the type of data expected by the ajax to come back
					url:'/analyse/players/get-data-sport',   //correspons to app.js file
					type: 'GET',                       //app.get in app.js
					success: function(data){	
							   
						var html='<option value=NULL>-------</option>';
						for(var i=0;i<data.length;i++)
						{	
							
							html+='<option value="'+ data[i].Sport +'">'+ data[i].Sport + '</option>';
						}
						$('#sport')
    					.find('option')
    					.remove()
    					.end()
    					.append(html);
    					//.val('whatever')

					}


			})

		}
		else{
			$('#sport')
			.find('option')
			.val('NULL');
			$('#sport').attr({
				'disabled': 'disabled'
			});
		}
	});

	$('#sport').on('change', function(e){
		console.log($('#sport'));
		
		if($('#sport').val().length > 0){
			$('#events').removeAttr('disabled');

			$.ajax({
					data: {	player:$('#player').val(), country:$('#country').val(), sport:$('#sport').val() }, //binding data to sports value selected
					dataType: 'json',                  //defining the type of data expected by the ajax to come back
					url:'/analyse/players/get-data-event',   //correspons to app.js file
					type: 'GET',                       //app.get in app.js
					success: function(data){		   
						console.log(data);
						var html='<option value=NULL>-------</option>';
						for(var i=0;i<data.length;i++)
						{	
							
							html+='<option value="'+ data[i].Event +'">'+ data[i].Event + '</option>';
						}
						$('#events')
    					.find('option')
    					.remove()
    					.end()
    					.append(html);
    					//.val('whatever')

					}


			})

		}
		else{
			$('#events')
			.find('option')
			.val('NULL');
			$('#event').attr({
				'disabled': 'disabled'
			});
		}
	});
});