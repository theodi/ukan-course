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

				Circles.create({
					id:         'circles-2',
					value:		'75',
					radius:     15,
					width:      5,
					text:       '',
					colors:     ['#999999', '#5AEA5B']
				});

				Circles.create({
					id:         'circles-3',
					value:		'75',
					radius:     15,
					width:      5,
					text:       '',
					colors:     ['#999999', '#5AEA5B']
				});

				Circles.create({
					id:         'circles-4',
					value:		'75',
					radius:     15,
					width:      5,
					text:       '',
					colors:     ['#999999', '#5AEA5B']
				});

				Circles.create({
					id:         'circles-5',
					value:		'75',
					radius:     15,
					width:      5,
					text:       '',
					colors:     ['#999999', '#5AEA5B']
				});

				Circles.create({
					id:         'circles-6',
					value:		'75',
					radius:     15,
					width:      5,
					text:       '',
					colors:     ['#999999', '#5AEA5B']
				});

				Circles.create({
					id:         'circles-7',
					value:		'75',
					radius:     15,
					width:      5,
					text:       '',
					colors:     ['#999999', '#5AEA5B']
				});

				Circles.create({
					id:         'circles-8',
					value:		'75',
					radius:     15,
					width:      5,
					text:       '',
					colors:     ['#999999', '#5AEA5B']
				});

				Circles.create({
					id:         'circles-9',
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

var next = 'content/chapter_one.html';
	var previous = '';



	$('#right').click(function(){
		$('#course-content').load(next);
	});
	$('#left').click(function(){
		$('#course-content').load(previous);
	});

