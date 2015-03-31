$( document ).ready(function() {


localData = { }; // Initialise global object to store local data
topicCount = $("#slide-left .ch-title").size() - 2; // Minus 2 accounts for intro and summary.
currentPage = "";
QuizPassed = false;


// Load data from cookie
if($.cookie('progress') != undefined)
{
	localData = JSON.parse( $.cookie('progress') );
	console.log( JSON.parse( $.cookie('progress') ) );
}


loadContent("0.1"); // Load intro page
updateProgressBar();

/* Create circle for each title */

$.each($("#slide-left .ch-title"), function(key, value){
	
	var titleID = $(this).data("topic")
	
	$(this).prepend("<div class='circle' id='circles-" + titleID + "'></div>");	
	
	Circles.create({
		id:         'circles-' + titleID ,
		value:		'0',
		radius:     15,
		width:      5,
		text:       '',
		colors:     ['#999999', '#5AEA5B']
	});
	
	
});




/* FUNCTIONS */


function loadContent(page)
{	
	currentPage = String(page);		
	$('#course-content').load("content/" + page + ".html");		// Load page contents
}
		

function updateProgressBar()
{
	
	$.each($("#progress-bar div"), function(key, value){
		
		var topicNumber = $(this).attr('id').slice(14);
		
		if( localData[topicNumber] == $("[data-topic=" + topicNumber + "]").data("sections") ) // If user has completed final topic section
		{
			$(this).removeClass("grey");
			
		}
		
		
	});
}

function updateCircles()
{
	$.each($("#slide-left .ch-title"), function(key, value){
		
		
		var topicNumber = $(this).data("topic");
		var lastSection = $(this).data("sections")
		
		if( localData[topicNumber] != undefined )
		{
			
			var percentage = (localData[topicNumber] / lastSection) * 100;
			var circleID = "circles-" + topicNumber;
			
			Circles.create({
				id:         'circles-' + topicNumber ,
				value:		percentage,
				radius:     15,
				width:      5,
				text:       '',
				colors:     ['#999999', '#5AEA5B']
			});

		}
		
	});
		
}

/* LEAVE APP - BROSWER CLOSE OR NAVIGATE AWAY */

$(window).bind("beforeunload", function() 
{ 
		// Save current progress
		
		$.cookie('progress', JSON.stringify( localData ));
		
		// Save last page viewed 
		$.cookie('last_location', window.location.hash);
	
})




	
	function changePage(page, context)
	{	
			
				
				
		if(page != null)
		{	
				console.log("sdfsdfsd");
				var currentTopic = currentPage.substring(0,1);	// Get current topic - used to record progress
				var currentSection = currentPage.substring(2);	// Get current section - used to record progress
				
				var nextTopic = String(page).substring(0,1);	// Get next topic - used to 
				var nextSection = String(page).substring(2);
				var lastSection = $("[data-topic=" + nextTopic + "]").data("sections");	// Get last section of next topic - used to determine if on last page of topic
				
				
					
					loadContent(page);	// Change page content
					
					console.log(page);
					$("#descriptor h4").html(  $("[data-topic=" + nextTopic + "] h3 strong").html() );
					
					$('#slide-left').removeClass('openslide-left'); 												// Close menu if open
					$('#slide-right').removeClass('openslide-right'); 												// Close menu if open
					$('#course-content').removeClass('faded');														// Restore opacity
					
					$("#progress-text").html("Progress " + nextTopic + " of " + topicCount);					// Change progress text
					
					
					
					
					
					// Save Progress
					
					if(context == "next")
					{
						
						if(currentTopic in localData)	// If topic exists in object
						{
							if(localData[currentTopic] < currentSection)
							{
								localData[currentTopic] = currentSection;
							}
						}
						
						else
						{
							console.log("New");
							localData[currentTopic] = currentSection;
						}
						
						console.log(localData);
						
						updateProgressBar();
						
						
						
						if(currentSection == lastSection) // If last page
						{
							if(QuizPassed == true)
							{
								QuizPassed = false; // Reset variable	
								loadContent("summary");	// Change page content
							}
						}
						
						
						
						
					}
					
					window.location.hash = page;								// Add content location to URL hash
					
		
				
			}
	} // Close changePage() function


	/* UI BUTTONS */
		
	// HELP BUTTON CLICK
	$('.help').click(function(){
			
		
		if($('#slide-left').hasClass('openslide-left')) // If the left menu is open
		{
			$('#course-content').addClass('faded');
		}
		
		else
		{
			$('#course-content').toggleClass('faded');
		}
		
		$('#slide-right').toggleClass('openslide-right');
		$('#slide-left').removeClass('openslide-left'); // Close menu if open
	});
	
	
		
	
	// MENU BUTTON CLICK
	$('#menu-button').click(function(){
		
		
		if( !$("#slide-left").hasClass("openslide-left")  )// If menu is currently closed
		{
			updateCircles();
		}
		
		if($('#slide-right').hasClass('openslide-right')) // If the right menu is open
		{
			$('#course-content').addClass('faded');
		}
		
		else
		{
			$('#course-content').toggleClass('faded');
		}
		
		$('#slide-left').toggleClass('openslide-left');
		$('#slide-right').removeClass('openslide-right'); // Close menu if open
		
	
		
	});
	
	// MENU TITLE SELECT 
	$('.ch-title').click(function(){	
		changePage( $(this).data("topic") + ".1", "menu"); // Pass in previous page filename
	});
		
	// PREVIOUS PAGE
	$('#left').click(function(){	
		changePage(previous, "previous"); // Pass in previous page filename
	});
	
	// NEXT BUTTON 
	$('#right').click(function(){
		changePage(next, "next"); // Pass in next page filename
	});
	


// validate contact form

function validateForm() {
    var x = document.forms["myForm"]["fname"].value;
    var y = document.forms["myForm"]["email"].value;
    if ((x == null || x == "") || (y == null || y == "")) {
        $('.alert-message').css({'visibility':'visible'});
        return false;
    }
}

// multiple choice quiz 



}); // Close document ready
	

