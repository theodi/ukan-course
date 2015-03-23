$( document ).ready(function() {


	$('#menu-button').click(function(){
		$('#slide-left').toggleClass('openslide-left');

				Circles.create({
					id:         'circles-1',
					value:		'75',
					radius:     15,
					width:      5,
					text:       '',
					colors:     ['#999999', '#5AEA5B']
				});

		});


	$('.help').click(function(){
		$('#slide-right').toggleClass('openslide-right');
	});

});