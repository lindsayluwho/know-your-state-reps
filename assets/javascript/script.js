$(document).ready(function(){

		//parallax template
    $('.parallax').parallax();

    //Bill Search state selector
    $('select').material_select();

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


