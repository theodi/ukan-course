$( document ).ready(function() {

/* Update greyed out buttons */

$('#left').removeClass('faded');
		$('#right').removeClass('faded');
		
		if(previous == null)
		{	
			$("#left").addClass('faded');
		}
		
		if(next == null)
		{
			$("#right").addClass('faded');
		}
		





});