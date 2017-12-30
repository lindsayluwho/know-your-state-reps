$(document).ready(function() {
	$("#billSearch").on("click", function() {
		event.preventDefault();
		var searchTerm = $("#bill-input").val().trim();

		var queryUrl = "https://openstates.org/api/v1/bills/?state=nj&q=" + searchTerm + "&apikey=8cef81cb-a1a4-48d3-86ff-0520d28f6ca6&per_page=10"
  

	  $.ajax({
	    url: queryUrl,
	    method: "GET"
	  })
	  .done(function(data) {

	  var resultsDiv = $("<div id='results-div'>");

	  for (var i = 0; i < data.length; i++) {


	  var resultBox = $("<div id='result-box' class='row'>");
      var resultCol = $("<div class='col s12'>");
      var resultCard = $("<div id='bill-card' class='card blue-grey darken-1'>");
      var resultBlue = $("<div class='card-content white-text'>");
      var resultRow = $("<div class='row' id='bill-card-row'>");
 
     
     resultRow.prepend("<h5 id='result-head'>" + data[i].title + "</h5><br>");
     resultRow.append("<p>Date Created: " + data[i].created_at + "</p><br>");
     resultRow.append("<p>Last Update: " + data[i].updated_at + "</p><br>");
     resultRow.append("<p>Bill ID: " + data[i].bill_id + "</p><br>");
     
     if(data[i].chamber === "upper"){
     	resultRow.append("<p>Bill created by your: Senate</p><br>");
     }

     if(data[i].chamber === "lower"){
     	resultRow.append("<p>Bill created by your: Assembly</p><br>");
     }

     var moreInfoLink = $("<a>");
     moreInfoLink.text("Click here to find out more");
     moreInfoLink.attr("data-billId", data[i].id);
     moreInfoLink.attr("class", "more-info");

     resultRow.append(moreInfoLink);
     

     resultBlue.append(resultRow);
     resultCard.append(resultBlue);
     resultCol.append(resultCard);
     resultBox.append(resultCard);
     resultsDiv.append(resultBox);
	  	
	  		
	  	}

	  	$(".white").append(resultsDiv);
			
		})
	})





	$(document).on("click", ".more-info", function() {

		$("#detail-card").detach();
		$("#detail-card").remove();

		console.log($(this).attr("data-billId"));



		

		var billId = $(this).attr("data-billId");

		$.ajax({
        url: "https://openstates.org/api/v1/bills/" + billId + "/?&apikey=8cef81cb-a1a4-48d3-86ff-0520d28f6ca6",
        method: "GET"
      }) 
      .done(function(results) {


      var detailBox = $("<div id='detail-box' class='row'>");
      var detailCol = $("<div class='col s12'>");
      var detailCard = $("<div id='detail-card' class='card blue-grey darken-1'>");
      var detailBlue = $("<div class='card-content white-text'>");
      var detailRow = $("<div class='row' id='bill-card-row'>");
 
     
     detailRow.prepend("<h4 id='detail-head'>Detailed Bill Information</h4><br>");
     // resultRow.append("<p>Date Created: " + data[i].created_at + "</p><br>");
     // resultRow.append("<p>Last Update: " + data[i].updated_at + "</p><br>");
     // resultRow.append("<p>Bill ID: " + data[i].bill_id + "</p><br>");
     var linkHead = $("<h6>").html("<strong>Click below for the bill's documentation</strong><br>");
     var linkP = $("<p>");
     var yesHead = $("<br><h6>").html('<strong>Number of "Yes" Votes</strong><br>');
     var yesCount = $("<p>");
      var yesNameHead = $("<br><h6>").html('<strong>Names of Reps Who Voted "Yes"</strong>');
      var nameList = $("<p>");
      var comYesHead = $("<br><h6>").html('<strong>Number of "Yes" Votes from the Committee</strong><br>');
      var comYesCount = $("<p>");
      var comYesNameHead = $("<br><h6>").html('<strong>Names of Committee Members Who Voted "Yes"</strong>');
      var comNameList = $("<p>");

   	  detailRow.append(linkHead);
   	  detailRow.append(linkP);
      detailRow.append(yesHead);
      detailRow.append(yesCount)
      detailRow.append(yesNameHead);
      detailRow.append(nameList);
      detailRow.append(comYesHead);
      detailRow.append(comYesCount)
      detailRow.append(comYesNameHead);
      detailRow.append(comNameList);


     detailBlue.append(detailRow);
     detailCard.append(detailBlue);
     detailCol.append(detailCard);
     detailBox.append(detailCard);
     $(".white").append(detailBox);

      	for (var i = 0; i<results.votes.length; i++) {

      		var votes = results.votes[i];

      		if(votes.motion === "3RDG FINAL PASSAGE"){
      			
      			yesCount.append(votes.yes_count);

      			for (var j = 0; j < votes.yes_votes.length; j++) {

      				var yesVotes = votes.yes_votes[j];
      				nameList.append(yesVotes.name + " | ");
      				
      			}
      		}

      	}



      	for (var i = 0; i < results.versions.length; i++) {
      		var url = results.versions[i].url;

      		var urlLink = $("<a>");
      		urlLink.attr("href", url);
      		urlLink.text("Version " + (i+1) + " | ");
      		urlLink.attr("target", "_blank");

      		linkP.append(urlLink);
      	}



      	for (var i = 0; i<results.votes.length; i++) {

      		var votes = results.votes[i];

      		if(votes.motion === "Reported favorably out of committee"){
      			
      			comYesCount.append(votes.yes_count);

      			for (var j = 0; j < votes.yes_votes.length; j++) {

      				var yesVotes = votes.yes_votes[j];
      				comNameList.append(yesVotes.name + " | ");
      				
      			}
      		}

      	}
      	
      })

	})

})