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
		changePage(fileName, context);	
    }
});
	
	
});


/* FUNCTIONS */



function dynamicContent()
{	
	
	
	
	
	$(".hide_me p").addClass("ignore");
	// Wrap list item content in span

		$.each($(".content-left li"), function(key, value){
		
		$(this).wrapInner("<span></span>");
		});
		

// Shorten Paragraphs
		$.each($(".content-left p:not(.ignore)"), function(key, value){
		
		
		var characterLimit = 150;
		
		if(	$(this).text().length > characterLimit )	// If paragraph is longer than character limit
		{	
			
			
			var beforeCut = $(this).html().substr(0, characterLimit);
			var afterCut = $(this).html().substr(characterLimit);
			// Extract extra text
			$(this).html(""); 
			$(this).append("<span class='beforeCut'>" + beforeCut + "</span>");
			$(this).append("<span class='elipsis'>...</span>");
			
			$(this).append("<span class='afterCut'>" + afterCut + "</span>");
			$(this).append("<button type='button' class='show_hide'>Show</button>");
		}
		
		});
		
		
		
		$.each($(".hide_me"), function(key, value){
		
		
		$(this).html("<span class='elipsis'>...</span><span class='afterCut'>" + $(this).html() + "</span>")
		$(this).append("<button type='button' class='show_hide'>Show</button>");
		
		
		});
		
		
		
		$(".show_hide").click(function(){
			
			if($(this).html() == "Show") 
			{ 
				$(this).html("Hide");
				$(this).prevAll(".elipsis").toggle();
			}
				 
			else
			{ 
				$(this).html("Show"); 
				$(this).prevAll(".elipsis").toggle();
			}
				
			$(this).prev(".afterCut").delay(500).toggle();
			
			
		});
	

}

function updateProgressBar()
{
	
	$.each($("#progress-bar div"), function(key, value){
		
		var topicNumber = $(this).attr('id').slice(14);
		
		if( localData[topicNumber] >= $("[data-topic=" + topicNumber + "]").data("sections") ) // If user has completed final topic section
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
		dotLocation = String(page).indexOf(".");
		nextTopic = String(page).substring(0, dotLocation);					// Get next topic - everything before dot
		nextSection = String(page).substring((dotLocation + 1));			// Get next section - everything after dot
		lastSection = $("[data-topic=" + nextTopic + "]").data("sections");	// Used to determine if on last page of topic
		containsQuiz = $("[data-topic=" + nextTopic + "]").data("quiz");	// Check if topic contains quiz using data attribute in sidemenu
		
		
		// Check access to page
		var allowed = true;
		
		if(context == "URL") // If the page is being access by URL manipulation
		{
			console.log(context);
			
			/* Check user has progressed to this page - prevent access via URL manipulation */
				
			if(nextTopic > 0) 
			{
			
				allowed = false;
				
				if(nextSection == 1) // If trying to get to first page in section
				{
					var previousTopic = parseInt(nextTopic - 1);
					var previousLastSection = $("[data-topic=" + previousTopic + "]").data("sections");	// Used to determine if on last page of previous topic
				
					if(localData[previousTopic] >= previousLastSection)
					{
						allowed = true;
					}
				}
				
				else // If going to any other page
				{
					if(parseInt(nextSection) == parseInt(localData[nextTopic]) + parseInt(1))
					{
						allowed = true;
					}
					
				}
				
			}
		
		}
		
				
		// Update progress 
						
		if(context == "next")
		{
			if(currentTopic in localData)	// If topic exists in object
			{
				if(parseInt(localData[currentTopic]) < parseInt(currentSection) )
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
		
		
		if( allowed == true)
		{	
			$('#course-content').load("content/" + page + ".html");		// Load page contents
			window.scrollTo(0,0)			;							// Position screen at top of page
				
			// Update UI Elements
			$("#descriptor h4").html(  $("[data-topic=" + nextTopic + "] h3 strong").html() );
			$('#slide-left').removeClass('openslide-left'); 										// Close menu if open
			$('#slide-right').removeClass('openslide-right'); 										// Close menu if open
			$('#course-content').removeClass('faded');												// Restore opacity
			$("#progress-text").html("Section " + nextSection + " of " + lastSection);				// Change progress text
			
			
			// Summary Page
			if(nextSection > lastSection)
			{
				console.log( $("#slide-left .slide-content").html()  );
				$("#left").addClass("faded");
				$("#descriptor h4").html("Topic Summary");
				$(".content-left").append( $("#slide-left .slide-content").html() );
			}
			
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
		
		} // Close if
		
		
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
			context = "next";
			window.location.hash = next;	
		}
	});
	








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




function checkpassclass(){
  if($( '#passclass option:selected' ).val() == 'range'){
    $('.passclass').text('1-3');
  } else if ($( '#passclass option:selected' ).val() == 'asis'){
    $('.passclass.pc-1').text('3');
    $('.passclass.pc-2').text('2');
    $('.passclass.pc-3').text('1');
    $('.passclass.pc-4').text('3');
  }
}

function checksurvived(){
  if($( '#survived option:selected' ).val() == 'na'){
    $('.survived').text('N/A');
  } else if($( '#survived option:selected' ).val() == 'asis'){
    $('.survived.sv-1').text('1');
    $('.survived.sv-2').text('0');
    $('.survived.sv-3').text('1');
    $('.survived.sv-4').text('0');
  } 
}

function checkname(){
  if($( '#passname option:selected' ).val() == 'blank'){
    $('.passname').text('');
  } else if($( '#passname option:selected' ).val() == 'asis'){
    $('.passname.pn-1').text('de Messemaeker, Mrs. Guillaume Joseph (Emma)');
    $('.passname.pn-2').text('Levy, Mr. Rene Jacques');
    $('.passname.pn-3').text('Barkworth, Mr. Algernon Henry Wilson');
    $('.passname.pn-4').text('Goodwin, Miss. Lillian Amy');
  } else if($( '#passname option:selected' ).val() == 'hash'){
    $('.passname.pn-1').text('#A001AH');
    $('.passname.pn-2').text('#A001XY');
    $('.passname.pn-3').text('#A001TG');
    $('.passname.pn-4').text('#A001UW');
	}
}




function checksex(){
  if($( '#passsex option:selected' ).val() == 'na'){
    $('.passsex').text('N/A');
  } else if($( '#passsex option:selected' ).val() == 'asis'){
    $('.passsex.ps-1').text('female');
    $('.passsex.ps-2').text('male');
    $('.passsex.ps-3').text('male');
    $('.passsex.ps-4').text('female');
  } 
}

function checkdob(){
  if($( '#birth option:selected' ).val() == 'age'){ 
    $('.birth.dob1').text('36');
    $('.birth.dob2').text('36');
    $('.birth.dob3').text('80');
    $('.birth.dob4').text('16');
  } else if($( '#birth option:selected' ).val() == 'noage'){
    $('.birth').text('N/A'); 
  } else if($( '#birth option:selected' ).val() == 'ageband'){
    $('.birth.dob1').text('30-40');
    $('.birth.dob2').text('36-40');
    $('.birth.dob3').text('70-80');
    $('.birth.dob4').text('10-20');
  }
}

function checkfare(){
  if($( '#fare option:selected' ).val() == 'show'){
    $('.fare.fr-1').text('17.400');
    $('.fare.fr-2').text('12.875');
    $('.fare.fr-3').text('30.000');
    $('.fare.fr-4').text('46.900');
  } else if($( '#fare option:selected' ).val() == 'noshow'){
    $('.fare').text('');
  } else if($( '#fare option:selected' ).val() == 'roundup'){
    $('.fare.fr-1').text('18.000');
    $('.fare.fr-2').text('13.000');
    $('.fare.fr-3').text('30.000');
    $('.fare.fr-4').text('47.000');
  } 
}


function checkdataset(){

	var namecorrect_one = $( '#passname option:selected' ).val() == 'blank';
	var namecorrect_two = $( '#passname option:selected' ).val() == 'hash';
	var dobcorrect = $( '#birth option:selected' ).val() == 'ageband';
	var survivecorrect = $( '#survived option:selected' ).val() == 'asis';
	var classcorrect = $( '#passclass option:selected' ).val() == 'range';
	var sexcorrect = $( '#passsex option:selected' ).val() == 'asis';
	var farecorrectup = $( '#fare option:selected' ).val() == 'roundup';
	var farecorrectnone = $( '#fare option:selected' ).val() == 'noshow';

    if(dobcorrect && survivecorrect && classcorrect && sexcorrect && (farecorrectup || farecorrectnone) && (namecorrect_one || namecorrect_two)){
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
			$('.ordresultmessage').delay(5000).fadeOut('slow');
		}
	
				$("#right").removeClass("faded");

}

function chkorder1(){

	

		if(($(".orderquiz1 .ord1").val() == 3) && ($(".orderquiz1 .ord2").val() == 2) && ($(".orderquiz1 .ord3").val() == 1)){
			$('.orderquiz1 .ordresultmessage').append('correct');
		} else {
			$('.orderquiz1 .ordresultmessage').append('false');
			$('.orderquiz1 .ordresultmessage').delay(5000).fadeOut('slow');
		}
	
				$("#right").removeClass("faded");

}

function chkorder2(){

	

		if(($(".orderquiz2 .ord1").val() == 1) && ($(".orderquiz2 .ord2").val() == 3) && ($(".orderquiz2 .ord3").val() == 2)){
			$('.ordresultmessage').append('correct');
		} else {
			$('.orderquiz2 .ordresultmessage').append('false');
			$('.orderquiz2 .ordresultmessage').delay(5000).fadeOut('slow');
		}
	
				$("#right").removeClass("faded");

}

