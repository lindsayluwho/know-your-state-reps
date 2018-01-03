var latitude;
var longitude;

var repID;

var queryURL;

var senatorLoaded = false;

var assembly1Loaded = false;
var assembly2Loaded = false;

function getState(address) {

    address = address.split("").filter((letter) => {
        return letter != ","
    })

    address = address.join("")
    // console.log(address);

    var split = address.split(" ")
    // console.log(split);

    var twoLettersOnly = split.filter((word) => {
        return word.length === 2;
    })

    return twoLettersOnly[twoLettersOnly.length - 1]
}


var getBills = (representative, isSenator, latitude, longitude) => {

    var latitude = localStorage.getItem("latitude");
    var longitude = localStorage.getItem("longitude");

    console.log(latitude);
    console.log(longitude);

    $("#bill-box").remove();

    // This function takes a name "Dave Brudner" and returns it in last name, comma, first name form ("Brudner, Dave")
    // Works with middle names too. Doesn't work with full names with more than 3 names
    var lastNameCommaFirstName = (name) => {

        var name = name.split(" ")

        if (name.length === 2) {
            var firstName = name[0]
            var lastName = name[1]
            var lastNameCommaFirstName = lastName + ", " + firstName;
            return lastNameCommaFirstName
        }

        if (name.length === 3) {
            var lastName = name[2]
            var firstAndMiddle = name[0] + " " + name[1]
            var lastNameCommaFirstName = lastName + ", " + firstAndMiddle
            return lastNameCommaFirstName
        }
    }

    // Change name into last name, first name so we can search later for yes votes in a bill
    var repName = representative
    var lastNameCommaFirstName = lastNameCommaFirstName(repName);

    var state;
    // Url to retrieve 10 bills
    console.log("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&key=AIzaSyANSUk1NNP2yDUSd94AklPQonusBBP16PI");
    $.ajax({
            url: "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&key=AIzaSyANSUk1NNP2yDUSd94AklPQonusBBP16PI",
            method: "GET"
        })
        .done(function(data) {

            var state = getState(data.results[3].formatted_address)

            // var state = "nj"
            // console.log("HI")
            // if (!data.results[1]) {
            //     console.log(data.results[1])

            // }
            
            // else {
            //     console.log("SDF")
            //     console.log(data)
            // } 

            // if (data.results[1].address_components[4].short_name) {
            //     state = data.results[1].address_components[4].short_name;
            //     console.log(state);    
            // }
            
            

        

    var queryUrl = "https://openstates.org/api/v1/bills/?state=" + state + "&search_window=session&apikey=8cef81cb-a1a4-48d3-86ff-0520d28f6ca6&per_page=10"


    // ajax call to get 10 bills
    $.ajax({
            url: queryUrl,
            method: "GET"
        }).done(function(data) {


            var billBox = $("<div id='bill-box' class='row'>");
            var billCol = $("<div class='col s12'>");
            var billCard = $("<div id='bill-card' class='card cyan darken-1'>");
            var billBlue = $("<div class='card-content white-text'>");
            var cardRow = $("<div class='row' id='bill-card-row'>");
            var billNameHead = $("<th style='width:40%;padding:0 20px 0 0'>").text("Bill Info");
            var voteHead = $("<th>").text("How Your Rep Voted");
            var senateHead = $("<th style='width:18%'>").text("How It Did in the Senate");
            var assemblyHead = $("<th>").text("How It Did in the Assembly");
            var dateHead = $("<th>").text("Date Introduced");


            cardRow.prepend("<h5 id='vote-head'>Recent Voting History</h5>");
            cardRow.append("<hr>");
            cardRow.append(billNameHead);
            cardRow.append(voteHead);
            cardRow.append(senateHead);
            cardRow.append(assemblyHead);
            cardRow.append(dateHead);


            billBlue.append(cardRow);
            billCard.append(billBlue);
            billCol.append(billCard);
            billBox.append(billCard);
            $(".cards-section").append(billBox);

            // Filters through returned data for bill Id's and does another ajax call for detailed bill info with each bill id. 
            for (var i = 0; i < data.length; i++) {

                var billId = (data[i].id)
                var bills = []

                // console.log("https://openstates.org/api/v1/bills/" + billId + "/?&apikey=8cef81cb-a1a4-48d3-86ff-0520d28f6ca6")
                // Console logs detailed bill url.
                // console.log("https://openstates.org/api/v1/bills/" + billId + "/?&apikey=8cef81cb-a1a4-48d3-86ff-0520d28f6ca6")

                $.ajax({
                        url: "https://openstates.org/api/v1/bills/" + billId + "/?&apikey=8cef81cb-a1a4-48d3-86ff-0520d28f6ca6",
                        method: "GET"
                    })
                    .done(function(results) {
                        // Creates bill object
                        var bill = {}

                        // Bill votes default to no or other. We change the vote to yes later. This is easier and faster than writing 3 loops to search through bill's voting records, but this can be changed if we'd like.
                        bill.vote = "no or other"
                        bill.senateVote = "No vote reported";
                        bill.assemblyVote = "No vote reported";

                        // Loops through bill object looking for a motion with the string "3RDG FINAL PASSAGE," which indicates a final vote. We need this differentiate from committee votes. Chamber === upper because this is a search for a senator.
                        for (var i = 0; i < results.votes.length; i++) {

                            if (results.votes[i].motion === "3RDG FINAL PASSAGE" && results.votes[i].chamber === "upper" && isSenator === "true") {

                                // After finding the vote array for final vote, not a committee vote, we loop through and look for senator's name. If we find it, we change bill.vote = yes;
                                // IMPORTANT: variable in this loop is 'j' not 'i.'
                                // We're still looping through the array we found "3RDG FINAL PASSAGE" in, so we need ot include result.votes[i].
                                // We also need to add yes_vote[j], because we're looping through the result.votes[i] array.
                                // I've tested this on 2 senators and the checked the results myself and it appears to work.

                                for (var j = 0; j < results.votes[i].yes_votes.length; j++) {
                                    if (results.votes[i].yes_votes[j].name === lastNameCommaFirstName) {
                                        bill.vote = "yes";
                                    }
                                }
                            }

                            if (results.votes[i].motion === "3RDG FINAL PASSAGE" && results.votes[i].chamber === "lower" && isSenator === "false") {

                                // After finding the vote array for final vote, not a committee vote, we loop through and look for senator's name. If we find it, we change bill.vote = yes;
                                // IMPORTANT: variable in this loop is 'j' not 'i.'
                                // We're still looping through the array we found "3RDG FINAL PASSAGE" in, so we need ot include result.votes[i].
                                // We also need to add yes_vote[j], because we're looping through the result.votes[i] array.
                                // I've tested this on 2 senators and the checked the results myself and it appears to work.

                                for (var j = 0; j < results.votes[i].yes_votes.length; j++) {
                                    if (results.votes[i].yes_votes[j].name === lastNameCommaFirstName) {
                                        bill.vote = "yes";
                                    }
                                }
                            }
                        }
                        for (var i = 0; i < results.actions.length; i++) {


                            bill.dateIntroduced = moment(results.actions[0].date).format("MM/DD/YYYY");
                            bill.name = results.title;

                            // Defaults to no vote. If a vote is found below, bill.senateVote is changed


                            if (results.actions[i].action.indexOf("Passed Senate") != -1) {
                                bill.senateVote = results.actions[i].action
                            }

                            if (results.actions[i].action.indexOf("Passed Assembly") != -1) {
                                bill.assemblyVote = results.actions[i].action
                            }


                        }
                        bills.push(bill);

                        var billRow = $("<tr>")
                        var billName = $("<td>")
                        var billVote = $("<td>")
                        var billSenate = $("<td>")
                        var billAssembly = $("<td>")
                        var billDate = $("<td>")


                        billName.text(bill.name);
                        billVote.text(bill.vote);
                        billSenate.text(bill.senateVote);
                        billAssembly.text(bill.assemblyVote);
                        billDate.text(bill.dateIntroduced);


                        billRow.append(billName);
                        billRow.append(billVote);
                        billRow.append(billSenate);
                        billRow.append(billAssembly);
                        billRow.append(billDate);

                        cardRow.append(billRow);

                    })
            }
            console.log(bills);

        })
    })
}

function success(response) {
    coordinates = response.coords;
    latitude = coordinates.latitude;
    longitude = coordinates.longitude;

    localStorage.setItem("latitude", latitude);
    localStorage.setItem("longitude", longitude);

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
    console.log(queryURL);

    // Creating an AJAX call for the specific card being clicked
    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function(response) {

        // console.log("printing card");
        // console.log($("info-box"));

        if ($("#info-box").length > 0) {
            $("#info-box").detach();
            $("#info-box").remove();
        }

        console.log(response);

        var infoBox = $("<div id='info-box'>");
        var infoCol = $("<div id='info-col'>");

        var idCard = $("<div id='id-card' class='card cyan darken-1'>");
        var cardBlue = $("<div class='card-content white-text'>");


        var cardRow = $("<div class='row' id='card-row'>");
        var nameClicked = $("<div id='name-clicked' class='col s12 m10'>");
        var photoCol = $("<div id='photo-column' class='col s12 m2'>");
        var titleRow = $("<div class='row'>");
        var titleSpan = $("<span id='name-clicked' class='card-title'>");

        var legName = $("<span class='card-title white-text'>").html(response.full_name);
        var party = $("<p class='card-content white-text'>").html("<div><strong>Party</strong></div>" + response.party);
        var email = $("<p class='card-content white-text'>").html("<div><strong>Email</strong></div>" + response.email);

        var photoURL = response.photo_url;

        var photo = $("<img src='" + photoURL + "' class='image'>");
        var offices = response.offices;
        var phone = $("<p class='card-content white-text'>").html("<div><strong>Phone</strong></div>" + offices[0].phone);
        var address = $("<p class='card-content white-text'>").html("<div><strong>Office Address</strong></div>"+ offices[0].address);
        var committees = response.roles;
        var committeesResults = [];
        var committeesDiv = $("<p class='card-content white-text'>").html("<div><strong>Committees: </strong></div>");

        var name = $("<div class='name'>")
        name.append(response.full_name)

        // var table = $("<table class='table repTable'>")
        // var tableHeader = $("<thead>")
        // var tableBody = $("<tbody>")

        // var tableHeaderRow = $("<tr>")
        // tableHeaderRow.append("<th class='cell'>Party</th>")
        // tableHeaderRow.append("<th class='cell'>Phone Number</th>")
        // tableHeaderRow.append("<th class='cell'>Email Address</th>")
        // tableHeaderRow.append("<th class='cell'>Office Address</th>")
        // tableHeaderRow.append("<th class='cell'>Committees</th>")

        // var tableBodyRow = $("<tr>")



        // tableBodyRow.append(`<td class='cell'>${response.party}</td>`)
        // tableBodyRow.append(`<td class='cell'>${offices[0].phone}</td>`)
        // tableBodyRow.append(`<td class='cell'>${response.email}</td>`)
        // tableBodyRow.append(`<td class='cell'>${offices[0].address}</td>`)
        // tableBodyRow.append("<td class='cell'>Lots of text over and over, Lots of text over and over, ")
        

        var committees = $("<td class='cell'>");

        // tableHeader.append(tableHeaderRow)
        // table.append(tableHeader);

        for (i = 0; i < committees.length; i++) {
            if (committees[i].type === "committee member") {
                committeesResults.push(committees[i].committee);
            }
        }

        console.log(committeesResults)
        // tableBody.append(tableBodyRow)
        // table.append(tableBody);

        $(".section").append(infoBox);
        $("#info-box").append(infoCol);
        $("#info-col").append(idCard);

        infoCol.append(idCard);
        idCard.append(cardBlue);
        cardBlue.append(cardRow);
        cardRow.append(name);
        cardRow.append(photoCol);
        photoCol.append(photo);
        cardRow.append(nameClicked);
        // nameClicked.append(table);
        // nameClicked.append(legName);
        nameClicked.append(party);
        nameClicked.append(address);
        nameClicked.append(phone);
        nameClicked.append(email);
        nameClicked.append(committeesDiv);

        infoBox.append(infoCol);

        var lastLatitude = localStorage.getItem("latitude");
        var lastLongitude = localStorage.getItem("longitude");
        var isSenator = "true";

        getBills(response.full_name, isSenator, latitude, longitude)
    });


});


$("#location-search").click(function() {

    senatorLoaded = false;
    assembly1Loaded = false;
    assembly2Loaded = false;

    navigator.geolocation.getCurrentPosition(success);

});

var lastLatitude = localStorage.getItem("latitude");
var lastLongitude = localStorage.getItem("longitude");

// console.log (lastLatitude);
// console.log (lastLongitude);

if (lastLatitude == null && lastLongitude == null) {
    console.log("success");
    $("#location-search").click(function() {

        senatorLoaded = false;
        assembly1Loaded = false;
        assembly2Loaded = false;
        navigator.geolocation.getCurrentPosition(success);
    });
} else {
    var url = "https://openstates.org/api/v1/legislators/geo/?lat=" + lastLatitude + "&long=" + lastLongitude + "&apikey=8cef81cb-a1a4-48d3-86ff-0520d28f6ca6"

    searchRep(lastLatitude, lastLongitude)
};