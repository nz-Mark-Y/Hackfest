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

google.maps.event.addDomListener(window, 'load', initialize);
