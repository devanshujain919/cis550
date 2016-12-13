$(document).ready(function(){
		console.log("hello");
		


		$('#edition').on('change',function(e){
			console.log($('#edition').val());

			$.ajax({
					data: {	edition:$('#edition').val() }, //binding data to edition value selected
					dataType: 'json',                  //defining the type of data expected by the ajax to come back
					url:'/search/sports/get_season',   //correspons to app.js file
					type: 'GET',                       //app.get in app.js
					success: function(data){		   
						console.log(data);
						var html='<option value=NULL>-------</option>';
						
						for(var i=0;i<data.length;i++)
						{	
							
							html+='<option value="'+ data[i].Season +'">'+ data[i].Season + '</option>';
						}
						$('#season')
    					.find('option')
    					.remove()
    					.end()
    					.append(html);
    					//.val('whatever')

					}


			})


		});

		$('#season').on('change',function(e){
			console.log($('#season').val());

			$.ajax({
					data: {	season:$('#season').val(), edition:$('#edition').val() }, //binding data to season value selected
					dataType: 'json',                  //defining the type of data expected by the ajax to come back
					url:'/search/sports/get_sport',   //correspons to app.js file
					type: 'GET',                       //app.get in app.js
					success: function(data){		   
						console.log(data);
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


		});



		$('#sport').on('change',function(e){
			console.log($('#sport').val());

			$.ajax({
					data: {	season:$('#season').val(), edition:$('#edition').val(), sport:$('#sport').val() }, //binding data to sports value selected
					dataType: 'json',                  //defining the type of data expected by the ajax to come back
					url:'/search/sports/get_events',   //correspons to app.js file
					type: 'GET',                       //app.get in app.js
					success: function(data){		   
						console.log(data);
						var html='';
						var j=0;
						for(var i=0;i<data.length;i++)
						{	
							if(j==0)
							{
								html+='<option value=NULL> ------------ </option>';
								j++;
							}
							
							html+='<option value="'+ data[i].Event +'">'+ data[i].Event + '</option>';
						}
						$('#event')
    					.find('option')
    					.remove()
    					.end()
    					.append(html);
    					//.val('whatever')

					}


			})


		});

		$('#search').on('click',function(e){
			e.preventDefault();
			var sport=$('#sport').val();
			var sport_event=$('#event').val()
			if(sport=='NULL' && sport_event!='NULL')
			{
	     	    alert("Can't Enter Event Without Sports");
	     		return;
	        }
	        else{

	        		console.log('search_start');
	        		
	        		$('#search_sport').submit();

	        		 
	            }

		});


});