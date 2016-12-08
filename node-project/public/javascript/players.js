$(document).ready(function(){

    console.log("hello");

    $('#search-btn').on('click', function(e){
        e.preventDefault();

        if($('#player-name').val() == '' && $('#player-country').val() == ''){
            alert('Provide at least one filed: Name / Country');
            return ;
        }

        $('#search-form').submit();
    })

    $('.clickable-row').on('click', function(e){

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

    $('#player-name').autocomplete({
        source: function(req, res){
            console.log("jello");
            $.ajax({
                data: {
                    name: req.term,
                },
                dataType: 'json',
                url: '/autocomplete-player',
                type: 'GET',
                success: function(data){
                    console.log(data);
                    var complete_data = [];
                    for(var i = 0 ; i < data.length ; i ++){
                        complete_data.push(data[i].Name);
                    }
                    res(complete_data);
                }
            });
        },
        minLength: 3
    });

    $('#player-country').autocomplete({
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
                    console.log(data);
                    var complete_data = [];
                    for(var i = 0 ; i < data.length ; i ++){
                        complete_data.push(data[i].Country);
                    }
                    res(complete_data);
                }
            });
        },
        minLength: 3
    });

});