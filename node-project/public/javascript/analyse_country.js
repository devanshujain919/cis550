$(document).ready(function(){

	var chart_data = null;

	var valuesToSubmit = null;

	var summer_chart = null;

	var winter_chart = null;

	$.validator.addMethod("notEqualTo", function(value, element, param) {
		var notEqual = true;
		value = $.trim(value);
		for (i = 0; i < param.length; i++) {
	        if (value == param[i]){
	        	notEqual = false;
	        }
	    }
	    return this.optional(element) || notEqual;
	}, 'Please choose a different value');

	$('#query-form').validate({
		rules: {
			'country': {
				required: true
			},
			'from': {
				notEqualTo: function(e){
					if($('#to').val() != '0'){
						return ['0'];
					}
					else{
						return [];
					}
				}
			},
			'to': {
				notEqualTo: function(e){
					if($('#from').val() != '0'){
						return ['0'];
					}
					else{
						return [];
					}
				}
			}
		},
		messages: {
			'country': {
				required: 'Please input the Country'
			},
			'from': {
				notEqualTo: 'Please input the From Range'
			},
			'to': {
				notEqualTo: 'Please input the To Range'
			}
		},
		submitHandler: function(){
			submitForm();
		}
	});

	$('#country').autocomplete({
        source: function(req, res){
            console.log("jello");
            $.ajax({
                data: {
                    country: req.term,
                },
                dataType: 'json',
                url: '/autocomplete-country',
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
	                        complete_data.push(data[i].Country);
	                    }
	                    res(complete_data);
                   	}
                }
            });
        },
        minLength: 3
    });

	$('#from').on('change', function(e){
		if($('#from').val() != '0'){
			$('#to').removeAttr('disabled');
			$.ajax({
				type: "POST",
				url: "/analyse/country/get-year-to",
				data: {
					'year_from': $('#from').val()
				},
				dataType: "JSON",
				success: function(data){
					console.log(data);
					var html='<option value="0"></option>';
					for(var i = 0 ; i < data.year_to.length ; i ++){	
						html += '<option value="'+ data.year_to[i].Year +'">'+ data.year_to[i].Year + '</option>';
					}
					$('#to').find('option').remove().end().append(html);
				}
			});
		}
		else{
			$('#to option[value="0"]').prop('selected', true);
			$('#to').attr({
				'disabled': 'disabled'
			});
		}
	});

	$(window).on('resize', function() {
		if(chart_data != null){
			drawChart(chart_data);
		}
	});

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

		if($(this).parent().parent().attr('id') == 'summer-heading'){
			chart = summer_chart;
			data = JSON.parse(JSON.stringify(chart_data['Summer']));
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
		else if($(this).parent().parent().attr('id') == 'winter-heading'){
			chart = winter_chart;
			data = JSON.parse(JSON.stringify(chart_data['Winter']));
			if(!$('#winter-gold').is(":checked")){
				for(var i = 0 ; i < data.length ; i ++){
					delete data[i]['Gold'];
				}
			}
			if(!$('#winter-silver').is(":checked")){
				for(var i = 0 ; i < data.length ; i ++){
					delete data[i]['Silver'];
				}
			}

			if(!$('#winter-bronze').is(":checked")){
				for(var i = 0 ; i < data.length ; i ++){
					delete data[i]['Bronze'];
				}
			}
		}
		else{
			console.log('Something weird happened');
		}
		
		console.log(data);
		console.log(chart_data);
		chart.setData(data);
	});

	var submitForm = function(){
		console.log("submitting...");
		valuesToSubmit = {
			'country': $('#country').val(),
			'from': $('#from').val(),
			'to': $('#to').val()
		};
		console.log(valuesToSubmit);
		$.ajax({
			type: "POST",
			url: "/analyse/country/get-data",
			data: valuesToSubmit,
			dataType: 'json',
			beforeSend: function() {
				$('#query-btn').addClass('active');
				$('#chart').empty();
				$('#chart-region').hide();
				$('#country-table').hide();
				chart_data = null;
			},
			success: function(result){
				$('#query-btn').removeClass('active');
				$('#chart-region').show();
				$('#country-table').show();
				console.log(result);
				process(result);
			},
			error: function(result){
				$('#query-btn').removeClass('active');
				console.log(result);
			}
		});
	};

	var process = function(data){
		var result = data.result;
		var statistics = data.stat;
		var processedData = {
			'Summer': [], 
			'Winter': [], 
			'Country': valuesToSubmit['country'], 
			'From': valuesToSubmit['from'], 
			'To': valuesToSubmit['to'],
			'Statistics': statistics
		};
		for(var i = 0 ; i < result.length ; i ++){
			if(result[i]['Season'] == 'Summer'){
				processedData['Summer'].push({
					'Year': String(result[i].Year),
					'Gold': result[i].Gold,
					'Silver': result[i].Silver,
					'Bronze': result[i].Bronze,
				});
			}
			if(result[i]['Season'] == 'Winter'){
				processedData['Winter'].push({
					'Year': String(result[i].Year),
					'Gold': result[i].Gold,
					'Silver': result[i].Silver,
					'Bronze': result[i].Bronze,
				});
			}
		}
		chart_data = processedData;
		drawChart(processedData);
		showTable(processedData);
		return processedData;
	}

	var showTable = function(result){
		var stats = result['Statistics'];
		var heading = '';
		console.log(stats);
		$('#country-gdp-table tbody').empty();
		
		if(stats.length == 0){
			heading = 'No information available for ' + result['Country'] + ' for the given range of years / filters.';
			$('#country-table-heading').text(heading);
			return ;
		}
		if(result['From'] == 0){
			heading = 'Table for ' + result['Country'] + ' (Year, GDP, Population, Health)';
		}
		else{
			heading = 'Table for ' + result['Country'] + ' (Year, GDP, Population, Health) from ' + result['From'] + ' to ' + result['To'];	
		}
		$('#country-table-heading').text(heading);

		var content = '';
		for(var i = 0 ; i < stats.length ; i ++){
			content += '<tr><td class="text-center">' + stats[i]['Year'] + '</td><td class="text-center">' + ((stats[i]['GDP'] == null) ? 'N/A' : stats[i]['GDP']) + '</td><td class="text-center">' + ((stats[i]['Population'] == null) ? 'N/A' : stats[i]['Population']) + '</td><td class="text-center">' + ((stats[i]['Health'] == null) ? 'N/A' : stats[i]['Health']) + '</td></tr>';
		}
		$('#country-gdp-table tbody').html(content);
	}

	var drawChart = function(result){
		$('#summer-chart').empty();
		if(result['Summer'].length > 0){
			if(result['From'] == 0){
				$('#summer-heading').html('Summer Olympics Records for ' + result['Country'] + ' over all the Years. <label class="checkbox-inline"><input class="chart-filter" id="summer-gold" type="checkbox" value="gold" checked>Gold</label><label class="checkbox-inline"><input class="chart-filter" id="summer-silver" type="checkbox" value="silver" checked>Silver</label><label class="checkbox-inline"><input class="chart-filter" id="summer-bronze" type="checkbox" value="bronze" checked>Bronze</label>');
			}
			else{
				$('#summer-heading').html('Summer Olympics Records for ' + result['Country'] + ' from ' + result['From'] + ' to ' + result['To'] + '. <label class="checkbox-inline"><input class="chart-filter" id="summer-gold" type="checkbox" value="gold" checked>Gold</label><label class="checkbox-inline"><input class="chart-filter" id="summer-silver" type="checkbox" value="silver" checked>Silver</label><label class="checkbox-inline"><input class="chart-filter" id="summer-bronze" type="checkbox" value="bronze" checked>Bronze</label>');
			}
			summer_chart = new Morris.Line({
				// ID of the element in which to draw the chart.
				element: 'summer-chart',
				// Chart data records -- each entry in this array corresponds to a point on
				// the chart.
				data: result['Summer'],
				// The name of the data record attribute that contains x-values.
				xkey: 'Year',
				xLabels: 'year',
				// A list of names of data record attributes that contain y-values.
				ykeys: ['Gold', 'Silver', 'Bronze'],
				// Labels for the ykeys -- will be displayed when you hover over the
				// chart.
				labels: ['Gold','Silver','Bronze'],

				lineColors: ['#FFDF00', '#C0C0C0', '#CD7F32'],

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
			$('#summer-heading').html('No record for Summer Olympics for ' + result['Country'] + ' for the given range of years / filters.');
		}
		$('#winter-chart').empty();
		if(result['Winter'].length > 0){
			if(result['From'] == 0){
				$('#winter-heading').html('Winter Olympics Records for ' + result['Country'] + ' over all the Years. <label class="checkbox-inline"><input class="chart-filter" id="winter-gold" type="checkbox" value="gold" checked>Gold</label><label class="checkbox-inline"><input class="chart-filter" id="winter-silver" type="checkbox" value="silver" checked>Silver</label><label class="checkbox-inline"><input class="chart-filter" id="winter-bronze" type="checkbox" value="bronze" checked>Bronze</label>');
			}
			else{
				$('#winter-heading').html('Winter Olympics Records for ' + result['Country'] + ' from ' + result['From'] + ' to ' + result['To'] + '. <label class="checkbox-inline"><input class="chart-filter" id="winter-gold" type="checkbox" value="gold" checked>Gold</label><label class="checkbox-inline"><input class="chart-filter" id="winter-silver" type="checkbox" value="silver" checked>Silver</label><label class="checkbox-inline"><input class="chart-filter" id="winter-bronze" type="checkbox" value="bronze" checked>Bronze</label>');
			}
			winter_chart = new Morris.Line({
				// ID of the element in which to draw the chart.
				element: 'winter-chart',
				// Chart data records -- each entry in this array corresponds to a point on
				// the chart.
				data: result['Winter'],
				// The name of the data record attribute that contains x-values.
				xkey: 'Year',
				// A list of names of data record attributes that contain y-values.
				ykeys: ['Gold', 'Silver', 'Bronze'],
				// Labels for the ykeys -- will be displayed when you hover over the
				// chart.
				labels: ['Gold','Silver','Bronze'],

				lineColors: ['#FFDF00', '#C0C0C0', '#CD7F32'],

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
			$('#winter-heading').html('No record for Winter Olympics for ' + result['Country'] + ' for the given range of years / filters.');
		}
	}

})