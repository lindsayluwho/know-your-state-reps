var latitude;
var longitude;

var repID;

var queryURL;

var senatorLoaded = false;

var assembly1Loaded = false;
var assembly2Loaded = false;


searchRep()

//test

//$("#search").on("click", function() {
function searchRep(){
	//event.preventDefault();
	// var searchTerm = ($("#search-term").val())
	// var totalResults = ($("#total-results").val())
	// var startDate = ($("#start-date").val())
	// var endDate = ($("#end-date").val())

	// startDate = startDate + '0101';
	// endDate = endDate + '0101';

	//searchTerm = "Linkin";

	//startDate = "20010101";
	//endDate = "20170101";

	latitude = 40.960201;
	longitude = -74.297324;
	      

	var queryURL = "https://openstates.org/api/v1/legislators/geo/?lat=" + latitude + "&long=" + longitude + "&apikey=8cef81cb-a1a4-48d3-86ff-0520d28f6ca6"

	console.log(queryURL);

	$.ajax({
	  url: queryURL,
	  method: "GET"
	})
	.done(function(data) {
//	  var results = data.response;
	  //console.log(results);
	  console.log(data);



	  for (var i = 0; i < data.length; i++) {


	  	var firstName = data[i].first_name;
	  	var lastName = data[i].last_name;

	  	//console.log(data[i].chamber);

	  	if (data[i].chamber=="upper") {
	  		if (!senatorLoaded) {
	  		$("#senator").html(data[i].full_name + "<br>" + "Office: State Senator" + "<br>" + "District: " + data[i].district + "<br>"  );

	  		senatorLoaded = true;
	  		//console.log(data[i].full_name);
	  		}
	  	}

	  	if (data[i].chamber=="lower") {
	  		if (!assembly1Loaded) {
	  		$("#assembly1").html(data[i].full_name + "<br>" + "Office: State Assembly" + "<br>" + "District: " + data[i].district + "<br>" );

	  		assembly1Loaded = true;
	  		//console.log(data[i].full_name);
	  		} else{
  				if (!assembly2Loaded) {
  					$("#assembly2").html(data[i].full_name + "<br>" + "Office: State Assembly" + "<br>" + "District: " + data[i].district + "<br>" );

  					assembly2Loaded = true;
  					//console.log(data[i].full_name);
  					};
	  		}
	  	}	  	

		  // var article = $("<div>");

		  // article.addClass("article");

		  // var headline = $("<div class='headline'>"+searchDocs[i].headline.main+"</div>");

 
		  // article.append(headline);
		  // $(".col-xs-10").append(article);

		  //console.log(firstName);
		  //console.log(lastName);
	  }


	});	



}
