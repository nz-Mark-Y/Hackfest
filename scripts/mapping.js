var locations = [["AUT", -36.8532234, 174.7651262], ["University of Auckland", -36.8523335, 174.7669186]];

function initialize() {
	var myOptions = {
		center: new google.maps.LatLng(-36.853, 174.765), // have to be set if center being set later on
		zoom: 17,
		scaleControl: true,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	var map = new google.maps.Map(document.getElementById('googlemaps'), myOptions);

	for (i = 0; i < locations.length; i++) {
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(locations[i][1] + 0.000002, locations[i][2] + 0.0022),
			map: map,
			draggable: false,
			animation: google.maps.Animation.DROP
		});

		var informWind = new google.maps.InfoWindow({
			content: locations[i][0]
		});

		informWind.open(map, marker);
	}

	var infoWindow = new google.maps.InfoWindow({map: map});

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var initialLocation = new google.maps.LatLng(position.coords.latitude + 0.0004, position.coords.longitude - 0.00004);  // need to be changed after everything else is finalised
			infoWindow.setPosition(initialLocation);
			map.setCenter(initialLocation);
			infoWindow.setContent("Location found!");
		}, function() {  // if browser can't get current location
			handleLocationError(true, map.getCenter());
		});
	}

	else {  // if browser doesn't support geolocation
		handleLocationError(false, map.getCenter());
	}

	function handleLocationError(supportFlag, pos) {
		infoWindow.setPosition(pos);
		infoWindow.setContent(supportFlag?
							"Error: The Geolocation service failed!" : 
							"Error: Your browser doesn't support geolocation!");
	}
}

 function initAutocomplete() {
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -33.8688, lng: 151.2195},
          zoom: 13,
          mapTypeId: 'roadmap'
        });

        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }

          // Clear out the old markers.
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
              map: map,
              icon: icon,
              title: place.name,
              position: place.geometry.location
            }));

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          map.fitBounds(bounds);
        });
      }

google.maps.event.addDomListener(window, 'load', initialize);
