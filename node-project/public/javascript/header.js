$(document).ready(function(){

	var is_open = false;

	$('#twitter-feed-toggle').on('click', function(e){
		if(!is_open){
			is_open = true;
			$('#twitterSidePanel').width('45%');
		}
		else{
			is_open = false;
			$('#twitterSidePanel').width(0);
		}
	});

	$('.twitter-close-btn').on('click', function(e){
		$('#twitterSidePanel').width(0);
	})

	!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");

});