$(document).ready(function(){

		//parallax template
    $('.parallax').parallax();

    //Bill Search state selector
    $('select').material_select();

    //overlay close button
    $("#close-x").click(function(){
    	$(".info-overlay").css("top", "-580px");
    });

    //overlay open caret
    $("#expand-caret").click(function(){
    	$(".info-overlay").css("top","0px");
    });



      // Side Nav Initialize
	$('.button-collapse').sideNav({
	  menuWidth: 300, // Default is 240
	  edge: 'right', // Choose the horizontal origin
	  closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
	}
	);

	$(".navClose").click(function() {
	    $('.button-collapse').sideNav('hide');
	});	
});


