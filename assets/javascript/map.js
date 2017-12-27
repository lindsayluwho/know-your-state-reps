var coordinates = null;
var latitude = null;
var longitude = null;

function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 8
        });
        infoWindow = new google.maps.InfoWindow;

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: latitude,
              lng: longitude
            };

             var marker = new google.maps.Marker({
          position: pos,
          map: map
          });

            
            map.setCenter(pos);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
      }

// Function if the request for a user's geolocation is successful
function success(response) {
    coordinates = response.coords;
    latitude = coordinates.latitude;
    longitude = coordinates.longitude;
    var url = "https://openstates.org/api/v1/legislators/geo/?lat=" + latitude + "&long=" + longitude + "&apikey=8cef81cb-a1a4-48d3-86ff-0520d28f6ca6"



    $.getJSON(url, function(data){
        console.log(data)
        $("#names").append(data[0].full_name)
    });

  console.log(url);
};

// Actual function call for geolocation.
navigator.geolocation.getCurrentPosition(success);

