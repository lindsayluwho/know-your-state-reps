$(document).ready(function() {

  function getFirstTwoWords(string){
    var split = string.split(" ")
    return(split[0] + " " + split[1])
  }


  var state = localStorage.getItem("kysr-state");


  var optionExists = false;
  var optionExists = ($("#select-state option[value="+state+"]").length > 0);

  if (state!==null && optionExists) {
    $(".select-dropdown").val(state).change();
    $(":selected").val(state);
  }

  $("#bill-search-form").on("submit", function(event) {
    event.preventDefault();

    $(".results").empty();

    $("#results-div").detach();
    $("#results-div").remove();

    $("#detail-box").detach();
    $("#detail-box").remove();


    var searchTerm = $("#bill-input").val().trim();
    var state = $(":selected").val();
    console.log(state);

    var queryUrl = "https://openstates.org/api/v1/bills/?state=" + state + "&q=" + searchTerm + "&apikey=8cef81cb-a1a4-48d3-86ff-0520d28f6ca6&per_page=10"
    console.log(queryUrl);

    $.ajax({
      url: queryUrl,
      method: "GET"
    })
    .done(function(data) {

    var resultsDiv = $("<div id='results-div'>");

    var resultBox = $("<div id='result-box' class='row'>");
      var resultCol = $("<div class='col s12'>");
      var resultCard = $("<div id='bill-card' class='card cyan darken-1'>");
      var resultBlue = $("<div class='card-content white-text'>");
      var resultRow = $("<div class='row' id='bill-card-row'>");
      var resultTable = $("<ul class='collapsible popout' data-collapsible='accordion'>");


      resultRow.prepend("<h5 id='result-head'>Search Results</h5><br>");
      resultRow.append("<hr>");

      resultRow.append(resultTable);
      resultBlue.append(resultRow);
     resultCard.append(resultBlue);
     resultCol.append(resultCard);
     resultBox.append(resultCard);
     resultsDiv.append(resultBox);

    for (var i = 0; i < data.length; i++) {

      var tRow = $("<li>");
      var billTitle = $("<div class='collapsible-header cyan darken-1'>" + data[i].title + "</div>");

     tRow.append(billTitle);

     var billBody = $("<div class='collapsible-body cyan'>");
     
     billBody.append("<span>Date Created: " + data[i].created_at + "<br></span>");
     billBody.append("<span>Last Update: " + data[i].updated_at + "<br></span>");
     billBody.append("<span>Bill ID:" + data[i].bill_id + "<br></span>");
     
     if(data[i].chamber === "upper"){
      billBody.append("<span>Created by: Senate<br></span>");
     }

     if(data[i].chamber === "lower"){
      billBody.append("<span>Created by: Assembly<br></span>");
     }

     var moreInfoTd = $("<span>");
     var moreInfoLink = $("<a>");
     moreInfoLink.text("Click for more");
     moreInfoLink.attr("data-billId", data[i].id);
     moreInfoLink.attr("class", "more-info");
     moreInfoLink.attr("href", "#detailBoxJump");
     moreInfoTd.append(moreInfoLink);
     billBody.append(moreInfoTd);

     tRow.append(billBody);
     resultTable.append(tRow);
        
      }
      $(".parallax-container").attr("style","height: 400px;");
      $(".results").append("<div class='container'><div class='section'><div id='results-area'>");
      $(".results").append("<div class='parallax-container' style='height: 200px;'><div class='parallax'><img src='assets/american_flag_flag_waving_american_usa_american_flag_waving_united_states-834559.jpg' class='responsive-img' style='display: block;'>");

      $("#results-area").append(resultsDiv);

          // COLLAPSIBLE

      $('.collapsible').collapsible();
      
    })
  })






  $(document).on("click", ".more-info", function() {

    $("#detail-box").detach();
    $("#detail-box").remove();

    console.log($(this).attr("data-billId"));

    

    var billId = $(this).attr("data-billId");

    console.log("https://openstates.org/api/v1/bills/" + billId + "/?&apikey=8cef81cb-a1a4-48d3-86ff-0520d28f6ca6");

    $.ajax({
        url: "https://openstates.org/api/v1/bills/" + billId + "/?&apikey=8cef81cb-a1a4-48d3-86ff-0520d28f6ca6",
        method: "GET"
      }) 
      .done(function(results) {


      var detailBox = $("<div id='detail-box' class='row'>");
      var detailCol = $("<div class='col s12'>");
      var detailCard = $("<div id='detail-card' class='card cyan darken-1'>");
      var detailBlue = $("<div class='card-content white-text'>");
      var detailRow = $("<div class='row' id='bill-card-row'>");
 
     
     detailRow.prepend("<h4 id='detail-head'>Additional Bill Information</h4><br>");
     detailRow.prepend("<a name='detailBoxJump'></a>");
     // detailRow.prepend("<a NAME='detailBoxJump'>");
     // resultRow.append("<p>Date Created: " + data[i].created_at + "</p><br>");
     // resultRow.append("<p>Last Update: " + data[i].updated_at + "</p><br>");
     // resultRow.append("<p>Bill ID: " + data[i].bill_id + "</p><br>");
     var linkHeadDiv = $("<div>");
     var linkHead = $("<h6>").html("<strong>Click below for the bill's documentation</strong><br>");
     var linkPDiv = $("<div>");
     var linkP = $("<p>");

     var yesHeadDiv = $("<div>");
     var yesHead = $("<br><h6>").html('<strong>Number of "Yes" Votes</strong><br>');
     var yesCountDiv = $("<div>");
     var yesCount = $("<p id='number-of-yes-votes'>");
     yesCount.text("No vote recorded");

     var yesNameHeadDiv = $("<div>");
      var yesNameHead = $("<br><h6>").html('<strong>Names of Reps Who Voted "Yes"</strong>');
      var nameListDiv = $("<div>");
      var nameList = $("<p id='names-of-yes-reps'>");
      nameList.text("No vote recorded");

      var comYesHeadDiv = $("<div>");
      var comYesHead = $("<br><h6>").html('<strong>Number of "Yes" Votes from the Committee</strong><br>');
      var comYesCountDiv = $("<div>");
      var comYesCount = $("<p id='number-of-com-yes'>");
      comYesCount.text("No vote recorded");

      var comYesNameHeadDiv = $("<div>");
      var comYesNameHead = $("<br><h6>").html('<strong>Names of Committee Members Who Voted "Yes"</strong>');
      var comNameListDiv = $("<div>");
      var comNameList = $("<p  id='names-of-com-yes'>");
      comNameList.text("No vote recorded");


      linkHeadDiv.append(linkHead);
      linkPDiv.append(linkP);
      yesHeadDiv.append(yesHead);
      yesCountDiv.append(yesCount);
      yesNameHeadDiv.append(yesNameHead);
      nameListDiv.append(nameList);
      comYesCountDiv.append(comYesCount);
      comNameListDiv.append(comNameList);
      comYesHeadDiv.append(comYesHead);
      comYesNameHeadDiv.append(comYesNameHead);

      detailRow.append(linkHeadDiv);
      detailRow.append(linkPDiv);
      detailRow.append(yesHeadDiv);
      detailRow.append(yesCountDiv)
      detailRow.append(yesNameHeadDiv);
      detailRow.append(nameListDiv);
      detailRow.append(comYesHeadDiv);
      detailRow.append(comYesCountDiv)
      detailRow.append(comYesNameHeadDiv);
      detailRow.append(comNameListDiv);


     detailBlue.append(detailRow);
     detailCard.append(detailBlue);
     detailCol.append(detailCard);
     detailBox.append(detailCard);
     $("#results-area").append(detailBox);

        for (var i = 0; i<results.votes.length; i++) {

          var votes = results.votes[i];

          if(votes.motion === "3RDG FINAL PASSAGE"){
            
            yesCount.text(votes.yes_count);
            nameList.empty();

            for (var j = 0; j < votes.yes_votes.length; j++) {

              var yesVotes = votes.yes_votes[j];
              nameList.append(yesVotes.name + " | ");
              
            }

            console.log($("#names-of-yes-reps").text());
            var ridOfLine = $("#names-of-yes-reps").text().substr(0, (($("#names-of-yes-reps").text().length) - 2)) ;
            $("#names-of-yes-reps").text(ridOfLine);
            console.log(ridOfLine);
            console.log($("#names-of-yes-reps").text().length);
          }

        }



        for (var i = 0; i < results.versions.length; i++) {
          var url = results.versions[i].url;

          var urlLink = $("<a>");
          urlLink.attr("href", url);
          urlLink.attr("id", "more-details");
          urlLink.text("Version " + (i+1) + " ");
          urlLink.attr("target", "_blank");

          linkP.append(urlLink);
        }



        for (var i = 0; i<results.votes.length; i++) {

          var votes = results.votes[i];

          if(votes.motion === "Reported favorably out of committee" || getFirstTwoWords(votes.motion) === "Committee vote"){
            
            comYesCount.text(votes.yes_count);
            comNameList.empty();

            for (var j = 0; j < votes.yes_votes.length; j++) {

              var yesVotes = votes.yes_votes[j];
              comNameList.append(yesVotes.name + " | ");
              
            }

            var ridOfLine = $("#names-of-com-yes").text().substr(0, (($("#names-of-com-yes").text().length) - 2)) ;
            $("#names-of-com-yes").text(ridOfLine);
          }

        }

       
    
        
      })

      

      
  })

})