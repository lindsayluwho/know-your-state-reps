var latitude;
var longitude;

var repID;

var queryURL;

var senatorLoaded = false;

var assembly1Loaded = false;
var assembly2Loaded = false;


// Side Nav Initialize
$('.button-collapse').sideNav({
  menuWidth: 300, // Default is 240
  edge: 'right', // Choose the horizontal origin
  closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
}
);


function success(response) {
    coordinates = response.coords;
    latitude = coordinates.latitude;
    longitude = coordinates.longitude;
    var url = "https://openstates.org/api/v1/legislators/geo/?lat=" + latitude + "&long=" + longitude + "&apikey=8cef81cb-a1a4-48d3-86ff-0520d28f6ca6"

    searchRep(latitude, longitude)

  // console.log(url);
};

//test

//$("#search").on("click", function() {
function searchRep(latitude, longitude) {


    var queryURL = "https://openstates.org/api/v1/legislators/geo/?lat=" + latitude + "&long=" + longitude + "&apikey=8cef81cb-a1a4-48d3-86ff-0520d28f6ca6"

    // console.log("console log 1: " + queryURL);

    $.ajax({
            url: queryURL,
            method: "GET"
        })
        .done(function(data) {

            for (var i = 0; i < data.length; i++) {


                var firstName = data[i].first_name;
                var lastName = data[i].last_name;

                //console.log(data[i].chamber);

                if (data[i].chamber == "upper") {
                    if (!senatorLoaded) {
                        $("#senator").html(data[i].full_name + "<br>" + "Office: State Senator" + "<br>" + "District: " + data[i].district + "<br>");
                        $("#senator").attr("data-id", data[i].leg_id);
                        $("#senator").attr("name", data[i].full_name)
                        $("#senator").attr("isSenator", "true")
                        senatorLoaded = true;
                        //console.log(data[i].full_name);
                    }
                }

                if (data[i].chamber == "lower") {
                    if (!assembly1Loaded) {
                        $("#assembly1").html(data[i].full_name + "<br>" + "Office: State Assembly" + "<br>" + "District: " + data[i].district + "<br>");
                        $("#assembly1").attr("data-id", data[i].leg_id);
                        $("#assembly1").attr("name", data[i].full_name)
                        $("#assembly1").attr("isSenator", "false")
                        assembly1Loaded = true;
                        //console.log(data[i].full_name);
                    } else {
                        if (!assembly2Loaded) {
                            $("#assembly2").html(data[i].full_name + "<br>" + "Office: State Assembly" + "<br>" + "District: " + data[i].district + "<br>");
                            $("#assembly2").attr("data-id", data[i].leg_id);
                            $("#assembly2").attr("name", data[i].full_name)
                            $("#assembly2").attr("isSenator", "false")
                            assembly2Loaded = true;
                            //console.log(data[i].full_name);
                        };
                    }
                }

            }


        });

}

$(".card-title").click(function() {

    var legislatorID = $(this).attr("data-id");

    //build the query URL and append the leg ID to it
    var queryURL = "https://openstates.org/api/v1/legislators/" + legislatorID + "/?&apikey=8cef81cb-a1a4-48d3-86ff-0520d28f6ca6"
    // console.log(legislatorID);
    // console.log(queryURL);
    
    // Creating an AJAX call for the specific card being clicked
    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function(response) {

        // console.log("printing card");
        // console.log($("info-box"));

        if ($("#info-box").length > 0)
        {
        	var nameClicked = $("<div id='name-clicked' class='col s8'>");
	        var photoCol = $("<div id='photo-column' class='col s4'>");
        	var legName = $("<p class='card-content white-text'>").text("Name : " + response.full_name);
        	var party = $("<p class='card-content white-text'>").text("Party: " + response.party);
	        var email = $("<p class='card-content white-text'>").text("Email: " + response.email);
	        
	        var photoURL = response.photo_url;

	        var photo = $("<img src='"+ photoURL + "' class='card-content'>");
	        var offices = response.offices;
	        var phone = $("<p class='card-content white-text'>").text("Phone: " + offices[0].phone);
	        var address = $("<p class='card-content white-text'>").text("Office Address: "+ offices[0].address);
	        var committees = response.roles;
					var committeesResults = [];

        	for (i = 0; i < committees.length; i++)
        	{
        		if (committees[i].type === "committee member")
        		{
        			committeesResults.push(committees[i].committee);
        		}

        	}
        
	        var committeesDiv = $("<p class='card-content white-text'>").text("Committees: " + committeesResults.toString());

	        // console.log(committees);
	        // console.log(committeesResults);

	        // append all the sections

	        $("#card-row").html(nameClicked);
	        $("#card-row").append(photoCol)
	        photoCol.append(photo);
	        nameClicked.append(legName);
	        nameClicked.append(party);
	        nameClicked.append(address);
	        nameClicked.append(phone);
	        nameClicked.append(email);
	        nameClicked.append(committeesDiv);

        }

        else
        	{

	        var infoBox = $("<div id='info-box' class='row'>");
	        var infoCol = $("<div id='info-col' class='col s12'>");

	        var idCard = $("<div id='id-card' class='card blue-grey darken-1'>");
	        var cardBlue = $("<div class='card-content white-text'>");


	        var cardRow = $("<div class='row' id='card-row'>");
	        var nameClicked = $("<div id='name-clicked' class='col s8'>");
	        var photoCol = $("<div id='photo-column' class='col s4'>");
	        var titleRow = $("<div class='row'>");
	        var titleSpan = $("<span id='name-clicked' class='card-title'>");

	        var legName = $("<p class='card-content white-text'>").text("Name : " + response.full_name);
	        var party = $("<p class='card-content white-text'>").text("Party: " + response.party);
	        var email = $("<p class='card-content white-text'>").text("Email: " + response.email);
	        
	        var photoURL = response.photo_url;

	        var photo = $("<img src='"+ photoURL + "' class='card-content'>");
	        var offices = response.offices;
	        var phone = $("<p class='card-content white-text'>").text("Phone: " + offices[0].phone);
	        var address = $("<p class='card-content white-text'>").text("Office Address: "+ offices[0].address);
	        var committees = response.roles;
					var committeesResults = [];

	        	for (i = 0; i < committees.length; i++)
	        	{
	        		if (committees[i].type === "committee member")
	        		{
	        			committeesResults.push(committees[i].committee);
	        		}

	        	}
	        
	        var committeesDiv = $("<p class='card-content white-text'>").text("Committees: " + committeesResults.toString());

	        // console.log(committees);
	        // console.log(committeesResults);

	        // append all the sections


	        $(".section").append(infoBox);
	        $("#info-box").append(infoCol);
	        $("#info-col").append(idCard);

	        infoCol.append(idCard);
	        idCard.append(cardBlue);
	        cardBlue.append(cardRow);
	        cardRow.append(nameClicked);
	        cardRow.append(photoCol);
	        photoCol.append(photo);
	        nameClicked.append(legName);
	        nameClicked.append(party);
	        nameClicked.append(address);
	        nameClicked.append(phone);
	        nameClicked.append(email);
	        nameClicked.append(committeesDiv);

	        infoBox.append(infoCol);
	      }
        

    });


});

navigator.geolocation.getCurrentPosition(success);
