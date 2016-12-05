$(document).ready(function(){

	var chart_data = null;

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

	var submitForm = function(){
		console.log("submitting...");
		var valuesToSubmit = $('#query-form').serialize();
		console.log(valuesToSubmit);
		$.ajax({
			type: "POST",
			url: "/analyse/country/get-data",
			data: valuesToSubmit,
			dataType: "JSON",
			beforeSend: function() {
				$('#query-btn').addClass('active');
				$('#chart').empty();
				$('#chart-region').hide();
				chart_data = null;
			},
			success: function(result){
				$('#query-btn').removeClass('active');
				$('#chart-region').show();
				chart_data = result;
				console.log(result);
				drawChart(result);
			},
			error: function(result){
				$('#query-btn').removeClass('active');
				console.log(result);
			}
		});
	};

	$(window).on('resize', function() {
		if(chart_data == null){
			drawChart(chart_data);
		}
	});

	var drawChart = function(data){
		new Morris.Line({
			// ID of the element in which to draw the chart.
			element: 'chart',
			// Chart data records -- each entry in this array corresponds to a point on
			// the chart.
			data: [
				{ year: '2008', value: 20, value1: 30 },
				{ year: '2009', value: 10, value1: 25 },
				{ year: '2010', value: 5, value1: 22 },
				{ year: '2011', value: 5, value1: 55 },
				{ year: '2012', value: 20, value1: 65 }
			],
			// The name of the data record attribute that contains x-values.
			xkey: 'year',
			// A list of names of data record attributes that contain y-values.
			ykeys: ['value', 'value1'],
			// Labels for the ykeys -- will be displayed when you hover over the
			// chart.
			labels: ['Value','Value1']
		});
	}

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

})