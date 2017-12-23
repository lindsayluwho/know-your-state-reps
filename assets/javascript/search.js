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

        $.ajax({
            url: url,
            method: "GET"
        }).done(function(response) {
            console.log(response);

            latitude = response.results[0].geometry.location.lat
            longitude = response.results[0].geometry.location.lng

            var uluru = { lat: latitude, lng: longitude };

            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 4,
                center: uluru
            });
            var marker = new google.maps.Marker({
                position: uluru,
                map: map
            });
            var queryURL = "https://openstates.org/api/v1/legislators/geo/?lat=" + latitude + "&long=" + longitude + "&apikey=8cef81cb-a1a4-48d3-86ff-0520d28f6ca6"
            $.ajax({
                    url: queryURL,
                    method: "GET"
                })
                .done(function(data) {
                    console.log(data);

                    for (var i = 0; i < data.length; i++) {


                        var firstName = data[i].first_name;
                        var lastName = data[i].last_name;

                        console.log(firstName);
                        console.log(lastName);

                        if (data[i].chamber == "upper") {
                            if (!senatorLoaded) {

                                $("#senator").html(data[i].full_name + "<br>" + "Office: State Senator" + "<br>" + "District: " + data[i].district + "<br>");

                                senatorLoaded = true;
                            }
                        }

                        if (data[i].chamber == "lower") {
                            if (!assembly1Loaded) {
                                $("#assembly1").html(data[i].full_name + "<br>" + "Office: State Assembly District: " + data[i].district + "<br>");

                                assembly1Loaded = true;
                            } else {
                                if (!assembly2Loaded) {
                                    $("#assembly2").html(data[i].full_name + "<br>" + "Office: State Assembly" + "<br>" + "District: " + data[i].district + "<br>");

                                    assembly2Loaded = true;
                                };
                            }
                        }

                    }


                });




        })
    })
})