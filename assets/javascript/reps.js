var latitude;
var longitude;

var queryURL;


searchRep();

//$("#search").on("click", function() {
function searchRep(){
	event.preventDefault();
	// var searchTerm = ($("#search-term").val())
	// var totalResults = ($("#total-results").val())
	// var startDate = ($("#start-date").val())
	// var endDate = ($("#end-date").val())

	// startDate = startDate + '0101';
	// endDate = endDate + '0101';

	//searchTerm = "Linkin";

	//startDate = "20010101";
	//endDate = "20170101";
	      

	var queryURL = "https://openstates.org/api/v1/legislators/geo/?lat=" + latitude + "&long=" + longitude + "&apikey=8cef81cb-a1a4-48d3-86ff-0520d28f6ca6"

	console.log(queryURL);

	$.ajax({
	  url: queryURL,
	  method: "GET"
	})
	.done(function(data) {
	  var results = data.response;
	  console.log(results);
	  //console.log(response);

	  var reps = results;

	  for (var i = 0; i < reps.length; i++) {


	  	var firstName = reps[i].first_name;
	  	var lastName = reps[i].last_name

		  // var article = $("<div>");

		  // article.addClass("article");

		  // var headline = $("<div class='headline'>"+searchDocs[i].headline.main+"</div>");

 
		  // article.append(headline);
		  // $(".col-xs-10").append(article);

		  console.log(firstName);
		  console.log(lastName);
	  }


	});	



})
