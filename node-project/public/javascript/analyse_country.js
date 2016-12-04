$(document).ready(function(){

	$('#query-form').validate({
		rules: {
			'country': {
				required: true
			},
			'event': {
				required: function(e){
					return $('#sport').val().length > 0;
				}
			}
		},
		messages: {
			'country': {
				required: 'Please input the Country'
			},
			'event': {
				required: 'Please input the Sporting Event'
			}
		},
		submitHandler: function(){
			submitForm();
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
			},
			success: function(result){
				$('#query-btn').removeClass('active');
				// TODO
			},
			error: function(result){
				$('#query-btn').removeClass('active');
				console.log(result);
			}
		});
	};


	$('#sport').on('change keyup paste', function(e){
		console.log('hehh');
		console.log(">>" + $('#sport').val().length + "<<<<<")
		if($('#sport').val().length > 0){
			$('#event').removeAttr('disabled');
		}
		else{
			$('#event').attr({
				'disabled': 'disabled'
			});
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
        minLength: 4
    });

    $('#sport').autocomplete({
        source: function(req, res){
            console.log("jello");
            $.ajax({
                data: {
                    sport: req.term,
                },
                dataType: 'json',
                url: '/autocomplete-sport',
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
	                        complete_data.push(data[i].Sport);
	                    }
	                    res(complete_data);
                   	}
                }
            });
        },
        minLength: 4
    });

    $('#event').autocomplete({
        source: function(req, res){
            console.log("jello");
            $.ajax({
                data: {
                    event: req.term,
                    sport: $('#sport').val()
                },
                dataType: 'json',
                url: '/autocomplete-event',
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
	                        complete_data.push(data[i].Event);
	                    }
	                    res(complete_data);
                   	}
                }
            });
        },
        minLength: 4
    });

})