var localData = { 0: 1 }; // Initialise global object to store local data
var currentPage = "0.1";
var currentTopic = "0";
var currentSection = "1";
var quizExists = false;
var quizPassed;
var context = "URL";


/* URL Hash Update */

$(window).on('hashchange', function(e){
	var fileName = String(window.location.hash);
	
	if(fileName !== "summary")
	{
		fileName = fileName.substring(1);
	}
	
	$.ajax({
    url:'content/' + fileName + '.html',
    type:'HEAD',
    error: function()
    {
       console.log("File not found");
    },
    success: function()
    {
	    console.log("File Successfully Loaded - " + fileName);
	 
		
	changePage(fileName, context);	
    }
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
		
		if(!(topicNumber in localData)) // If topic has been unlocked
		{
			$(this).addClass("faded");
			
		}
		
	});
		
}

function updateSummary()
{
	$.each($(".summary_tile"), function(key, value){
		
		
		var topicNumber = $(this).data("topic");
		var lastSection = $(this).data("sections")
		
		if( localData[topicNumber] != undefined )
		{
			
			var percentage = (localData[topicNumber] / lastSection) * 100;
			var circleID = "circles-" + topicNumber;
			
			Circles.create({
				id:         'circles-' + topicNumber ,
				value:		percentage,
				radius:     5,
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
		console.log(page);
		dotLocation = page.indexOf(".");
		nextTopic = String(page).substring(0, dotLocation);					// Get next topic - everything before dot
		nextSection = String(page).substring((dotLocation + 1));			// Get next section - everything after dot
		lastSection = $("[data-topic=" + nextTopic + "]").data("sections");	// Used to determine if on last page of topic
		containsQuiz = $("[data-topic=" + nextTopic + "]").data("quiz");	// Check if topic contains quiz using data attribute in sidemenu
		
		
		
		/* Summary Page Logic */
		/*
		if(context == "next" && nextTopic > 1 && nextSection == "1")
		{
			console.log("SDfasf");
			next = (Number(currentTopic) + 1) + 0.1;
			$('#course-content').html( $("#scrollerleft .slide-content").html() );		// Load page contents
			updateSummary();
						
						$("#descriptor h4, #progress-text").html("Course Summary");
						$("#left").addClass("faded");
						return false;			// Stop function here
		}
		*/
		
		/* Check user has progressed to this page - prevent access via URL manipulation */
		
		//if(localData[nextTopic] >= window.location.hash) // If page is present in JS object
		//else
		//{
		
			// Update progress in temporary global variable
			
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
					localData[currentTopic] = currentSection;
				}
					
				$.cookie('progress', JSON.stringify( localData )); // Update cookie
							
				updateProgressBar();				
			
				
			} // Close if context == next
		
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
		
		if(currentTopic > 0 && nextSection == lastSection && containsQuiz == true)
		{
			$("#right").addClass("faded");
		}
		
			
		// Set new current page
		currentPage = String(page);	
		currentTopic = nextTopic;		// Set current topic - used to record progress
		currentSection = nextSection;	// Set current section - used to record progress
	
		//} // Close if
		
	} // Close changePage() function






$( document ).ready(function() {

// Load data from cookie
if($.cookie('progress') != undefined)
{
	localData = JSON.parse( $.cookie('progress') );
}

window.location.hash = "0.1";
changePage("0.1", "URL");	// Load welcome page by default
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
	$('.ch-title').on("click", function(){	
		
		context = "menu";
		window.location.hash = $(this).data("topic") + ".1";								// Add content location to URL hash
		
	});
		
	// PREVIOUS PAGE
	$('#left').click(function(){	
		if(! $(this).hasClass("faded") ) // Check if greyed out
		{
			context = "previous"; // Pass in previous page filename
			window.location.hash = previous;								// Add content location to URL hash
		
		}
	});
	
	// NEXT BUTTON 
	$('#right').click(function(){
		
		if(! $(this).hasClass("faded") ) // Check if greyed out
		{
			console.log("sdfsfd");
			context = "next";
			window.location.hash = next;	
		}
	});
	





// multiple choice quiz 



}); // Close document ready
	
	
	
	
/* Validate contact form */

function validateForm() {
    var x = document.forms["myForm"]["fname"].value;
    var y = document.forms["myForm"]["email"].value;
    if ((x == null || x == "") || (y == null || y == "")) {
        $('.alert-message').css({'visibility':'visible'});
        return false;
    }
}


function checkdob(){
  if($( '#birth option:selected' ).val() == 'dob'){
    $('.age').text('01/09/1933');
  } else if($( '#birth option:selected' ).val() == 'age'){ 
    $('.age').text('29');
  } else if($( '#birth option:selected' ).val() == 'noage'){
    $('.age').text('N/A'); 
  } else if($( '#birth option:selected' ).val() == 'ageband'){
    $('.age').text('20 - 30');
  }
}

function checkstart(){
  if($( '#startpoint option:selected' ).val() == 'start'){
    $('.startpoint').text('Brooks End');
  } else if($( '#startpoint option:selected' ).val() == 'nostart'){
    $('.startpoint').text('N/A'); 
  } else if($( '#startpoint option:selected' ).val() == 'morespecific'){
    $('.startpoint').text('Brooks End, No.7');
  } else if($( '#startpoint option:selected' ).val() == 'lessspecific'){
    $('.startpoint').text('Glasgow'); 
  }
}

function checkend(){
  if($( '#endpoint option:selected' ).val() == 'end'){
    $('.endpoint').text('Tree Street');
  } else if($( '#endpoint option:selected' ).val() == 'noend'){
    $('.endpoint').text('N/A');
  } else if($( '#endpoint option:selected' ).val() == 'morespecific'){
    $('.endpoint').text('Tree Street, No.11A');
  } else if($( '#endpoint option:selected' ).val() == 'lessspecific'){
    $('.endpoint').text('New York');
  }
}

function checktime(){
  if($( '#time option:selected' ).val() == 'show'){
    $('.journey').text('17.45');
  } else if($( '#time option:selected' ).val() == 'noshow'){
    $('.journey').text('N/A');
  } else if($( '#time option:selected' ).val() == 'roundup'){
    $('.journey').text('18.00');
  } else if($( '#time option:selected' ).val() == 'rounddown'){
    $('.journey').text('17.00');
  }
}


function checkdataset(){

	var ticketlen1 = $(".ticketno1").val().length < 5;
	var ticketlen2 = $(".ticketno2").val().length < 5;
	var ticketlen3 = $(".ticketno3").val().length < 5;
	var ticketlen4 = $(".ticketno4").val().length < 5;
	var dobcorrect = $('.age:first').text() == '20 - 30';
	var startcorrect = $('.startpoint:first').text() == 'Glasgow';
	var endcorrect = $('.endpoint:first').text() == 'New York';
	var timecorrectdn = $('.journey:first').text() == '17.00';
	var timecorrectup = $('.journey:first').text() == '18.00';

    if(ticketlen1 && ticketlen2 && ticketlen3 && ticketlen4 && dobcorrect && startcorrect && endcorrect && (timecorrectdn || timecorrectup)){
    //alert('correct');
    $('#int-dataset').css({'border':'6px solid #5AEA5B'});
    $('.dataset-correct').fadeIn('slow');
    $('.dataset-correct').delay(5000).fadeOut('slow');
  } else {
    //alert('false');
    $('#int-dataset').css({'border':'6px solid #FF0000'});
    $('.dataset-wrong').fadeIn('slow');
    $('.dataset-wrong').delay(5000).fadeOut('slow');
  }
}


// order-quiz

function chkorder(){

	

		if(($(".ord1").val() == 2) && ($(".ord2").val() == 1) && ($(".ord3").val() == 3)){
			$('.ordresultmessage').append('correct');
		} else {
			$('.ordresultmessage').append('false');
		}
	

}

