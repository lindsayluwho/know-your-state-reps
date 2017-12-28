$(document).ready(function() {

  
  var getBills = (representative, isSenator) => {


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
  console.log(lastNameCommaFirstName);

  // Url to retrieve 10 bills
  var queryUrl = "https://openstates.org/api/v1/bills/?state=nj&search_window=session&apikey=8cef81cb-a1a4-48d3-86ff-0520d28f6ca6&per_page=10"
  
  // ajax call to get 10 bills
  $.ajax({
    url: queryUrl,
    method: "GET"
  })
  .done(function(data) {

    var billBox = $("<div id='bill-box' class='row'>");
      var billCol = $("<div class='col s12'>");
      var billCard = $("<div id='bill-card' class='card blue-grey darken-1'>");
      var billBlue = $("<div class='card-content white-text'>");
      var cardRow = $("<div class='row' id='bill-card-row'>");
      var billNameHead = $("<th>").text("Bill Info");
      var voteHead = $("<th>").text("How Your Rep Voted");
      var senateHead = $("<th>").text("How It Did in the Senate");
      var assemblyHead = $("<th>").text("How It Did in the Assembly");
      var dateHead = $("<th>").text("Date Introduced");

     
     cardRow.prepend("<h5 id='vote-head'>Recent Voting History</h5>");
     cardRow.append(billNameHead);
     cardRow.append(voteHead);
     cardRow.append(senateHead);
     cardRow.append(assemblyHead);
     cardRow.append(dateHead);

     billBlue.append(cardRow);
     billCard.append(billBlue);
     billCol.append(billCard);
     billBox.append(billCard);
     $(".white").append(billBox);

    // Filters through returned data for bill Id's and does another ajax call for detailed bill info with each bill id. 
    for (var i=0; i<data.length; i++) {
      
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
        for (var i = 0; i<results.votes.length; i++) {

          if (results.votes[i].motion === "3RDG FINAL PASSAGE" && results.votes[i].chamber === "upper" && isSenator === "true") {
            
            // After finding the vote array for final vote, not a committee vote, we loop through and look for senator's name. If we find it, we change bill.vote = yes;
            // IMPORTANT: variable in this loop is 'j' not 'i.'
            // We're still looping through the array we found "3RDG FINAL PASSAGE" in, so we need ot include result.votes[i].
            // We also need to add yes_vote[j], because we're looping through the result.votes[i] array.
            // I've tested this on 2 senators and the checked the results myself and it appears to work.

            for (var j= 0; j < results.votes[i].yes_votes.length; j++) {
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

            for (var j= 0; j < results.votes[i].yes_votes.length; j++) {
              if (results.votes[i].yes_votes[j].name === lastNameCommaFirstName) {
                bill.vote = "yes";
              }
            }


          }                                      
        }

        

        for (var i=0; i<results.actions.length; i++) {
          

          bill.dateIntroduced = results.actions[0].date;
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
    
      console.log(bills)

  })
  }

  $(document).on("click", ".card-title", function() {
    var representativeName = ($(this).attr("name"));
    var isSenator = ($(this).attr("isSenator"));

    if ($("#bill-box").length > 0){
      $("#bill-box").remove();
    
    console.log(isSenator);

    getBills(representativeName, isSenator);

  } else {

    getBills(representativeName, isSenator);
  }

  })
  
})