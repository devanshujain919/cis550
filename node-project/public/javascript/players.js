$('.clickable-row').on('click', function(e){
	console.log($(this).data('name'));
	console.log($(this).data('country'));

	var form = $('<form>', {
	    method: 'post',
	    action: '/players/',
	    data: {
			name: $(this).data('name'),
			country: $(this).data('country')
		}
    });
    form.append($('<input>', {
    	'name': 'name',
    	'value': $(this).data('name')
    }));
    form.append($('<input>', {
    	'name': 'country',
    	'value': $(this).data('country')
    }));
    form.submit();
});