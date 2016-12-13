$(document).on('ready', function(e){

	$('#search-player').on('click', function(e){

		console.log($("#name").html() + "  " + $("#country").html())


		var form = $('<form>', {
            method: 'post',
            action: '/bing/search-player/',
            data: {
                name: $("#name").html(),
                country: $("#country").html()
        	}
        });
        form.append($('<input>', {
        	'name': 'name',
        	'value': $("#name").html()
        }));
        form.append($('<input>', {
        	'name': 'country',
        	'value': $("#country").html()
        }));
        form.submit();

	});

});