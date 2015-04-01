var localData = { }; // Initialise global object to store local data
var currentPage = "0.1";
var currentTopic = "0";
var currentSection = "1";
var quiz = false;
var quizPassed;

$( document ).ready(function() {


// Load data from cookie
if($.cookie('progress') != undefined)
{
	localData = JSON.parse( $.cookie('progress') );
}


changePage("0.1"); // Load intro page
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
	$.each($(".ch-title"), function(key, value){
		
		
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
		console.log("Change Page");
		
		if(page == null) // Either first or last page
		{
			if(context == "next")
			{
				if(currentTopic in localData)	// If topic exists in object
				{
					if(localData[currentTopic] < currentSection)
					{
						console.log("New Section");
						localData[currentTopic] = currentSection;
					}
				}
				
				else
				{
					console.log("New Topic");
					localData[currentTopic] = currentSection;
				}
									
				
				if(currentTopic > 0 && currentSection == lastSection) // If last page
				{	
					if(quizPassed == true)
					{
						$('#course-content').html( $("#scrollerleft .slide-content").html() );		// Load page contents
						updateCircles();
						quizPassed = false; 	// Reset variable	
				
					}
				}
				
			}

		}
		
		else
		{
			
		nextTopic = String(page).substring(0,1);	// Get next topic - used to 
		nextSection = String(page).substring(2);
		lastSection = $("[data-topic=" + nextTopic + "]").data("sections");	// Used to determine if on last page of topic
		
		
		// Save Progress in Cookie
		
		$('#course-content').load("content/" + page + ".html");		// Load page contents
			
			
		// Update UI Elements
		$("#descriptor h4").html(  $("[data-topic=" + nextTopic + "] h3 strong").html() );
		$('#slide-left').removeClass('openslide-left'); 										// Close menu if open
		$('#slide-right').removeClass('openslide-right'); 										// Close menu if open
		$('#course-content').removeClass('faded');												// Restore opacity
		$("#progress-text").html("Section " + nextSection + " of " + lastSection);				// Change progress text
		
		
		// Previous - Next Buttons
		$("#left, #right").removeClass("faded");

		if(nextSection == 1)
		{
			$("#left").addClass("faded");
		}
		console.log(quiz);
		if(currentTopic > 0 && nextSection == lastSection)
		{
			$("#right").addClass("faded");
		}
			
		console.log(localData);			
		window.location.hash = page;								// Add content location to URL hash
			
		// Set new current page
		currentPage = String(page);	
		currentTopic = currentPage.substring(0,1);	// Get current topic - used to record progress
		currentSection = currentPage.substring(2);	// Get current section - used to record progress
			
		} // Close else	
		
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
		if(! $(this).hasClass("faded") ) // Check if greyed out
		{
		changePage(previous, "previous"); // Pass in previous page filename
		}
	});
	
	// NEXT BUTTON 
	$('#right').click(function(){
		
		if(! $(this).hasClass("faded") ) // Check if greyed out
		{
		changePage(next, "next"); // Pass in next page filename
		}
	});
	




// multiple choice quiz 



}); // Close document ready
	
// validate contact form

function validateForm() {
    var x = document.forms["myForm"]["fname"].value;
    var y = document.forms["myForm"]["email"].value;
    if ((x == null || x == "") || (y == null || y == "")) {
        $('.alert-message').css({'visibility':'visible'});
        return false;
    }
}
