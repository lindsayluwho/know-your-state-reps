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
function searchRep() {


    latitude = 40.960201;
    longitude = -74.297324;


    var queryURL = "https://openstates.org/api/v1/legislators/geo/?lat=" + latitude + "&long=" + longitude + "&apikey=8cef81cb-a1a4-48d3-86ff-0520d28f6ca6"

    console.log("console log 1: " + queryURL);

    $.ajax({
            url: queryURL,
            method: "GET"
        })
        .done(function(data) {
            //	  var results = data.response;
            //console.log(results);
            //console.log(data);



            for (var i = 0; i < data.length; i++) {


                var firstName = data[i].first_name;
                var lastName = data[i].last_name;

                //console.log(data[i].chamber);

                if (data[i].chamber == "upper") {
                    if (!senatorLoaded) {
                        $("#senator").html(data[i].full_name + "<br>" + "Office: State Senator" + "<br>" + "District: " + data[i].district + "<br>");
                        $("#senator").attr("data-id", data[i].leg_id);
                        senatorLoaded = true;
                        //console.log(data[i].full_name);
                    }
                }

                if (data[i].chamber == "lower") {
                    if (!assembly1Loaded) {
                        $("#assembly1").html(data[i].full_name + "<br>" + "Office: State Assembly" + "<br>" + "District: " + data[i].district + "<br>");
                        $("#assembly1").attr("data-id", data[i].leg_id);
                        assembly1Loaded = true;
                        //console.log(data[i].full_name);
                    } else {
                        if (!assembly2Loaded) {
                            $("#assembly2").html(data[i].full_name + "<br>" + "Office: State Assembly" + "<br>" + "District: " + data[i].district + "<br>");
                            $("#assembly2").attr("data-id", data[i].leg_id);
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
    console.log(legislatorID);
    console.log(queryURL);
    // Creating an AJAX call for the specific card being clicked
    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function(response) {
        //      	console.log(response.length)
        // for (var i = 0; i < response.length; i++) {

        console.log("printing card");

        var infoBox = $("<div id='info-box' class='row'>");
        var infoCol = $("<div id='info-col' class='col s12'>");

        var idCard = $("<div id='id-card' class='card blue-grey darken-1'>");
        var cardBlue = $("<div class='card-content white-text'>");


        var cardRow = $("<div class='row'>");
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
        // append all the sections


        // $(".section").append(myDIV);


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

        infoBox.append(infoCol);

        // $("#info-box").append(infoCol)



        // append to the main


        console.log(response);

        // }
    });


});