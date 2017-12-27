$(document).ready(function() {
    $("#submit").on("click", function() {
        senatorLoaded = false;
		assembly1Loaded = false;
		assembly2Loaded = false;

        var location = $("#search").val()
        // var location = "13 whipple road new jersey"
        var latitude
        var longitude

        console.log(location);

        var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + location + "&key=AIzaSyANSUk1NNP2yDUSd94AklPQonusBBP16PI"

        console.log(url);

        function searchRep(latitude, longitude) {

            var queryURL = "https://openstates.org/api/v1/legislators/geo/?lat=" + latitude + "&long=" + longitude + "&apikey=8cef81cb-a1a4-48d3-86ff-0520d28f6ca6"

            console.log("console log 1: " + queryURL);

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

        $.ajax({
            url: url,
            method: "GET"
        }).done(function(response) {
            console.log(response);

            latitude = response.results[0].geometry.location.lat
            longitude = response.results[0].geometry.location.lng

            searchRep(latitude, longitude);

            var uluru = { lat: latitude, lng: longitude };

            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 8,
                center: uluru
            });
            var marker = new google.maps.Marker({
                position: uluru,
                map: map
            });
            




        })
    })
})