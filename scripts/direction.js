function action1() {
	//console.log(document.getElementById('end').value);
	if (yolo === undefined) sendRequest();
	placingMarker();
}

function action2() {
	if (yolo.readyState == 4) {
		calculateAndDisplayRoute();
	}
}

function placingMarker() {
	// customizing location markers & info
	//var locations = [["#JusticeForHarambe", "gorilla god", "0800838383", "harame@limbo.com", "www.google.com", 40.7128, -74.02]];
	var bounds = new google.maps.LatLngBounds();
	for (var i = 0; i < returnedDiscounts.length; i++) {
		// Create a marker for each place
		var position = new google.maps.LatLng(returnedDiscounts[i].coordinates.latitude, returnedDiscounts[i].coordinates.longitude);
		bounds.extend(position);
		var marker = new google.maps.Marker({
			map: map,
			icon: 'https://mapbuildr.com/assets/img/markers/solid-pin-red.png',
			title: returnedDiscounts[i].name,
			disc: returnedDiscounts[i].deals[0].title,
			desc: returnedDiscounts[i].deals[0].what_you_get,
			web: returnedDiscounts[i].deals[0].url,
			position: position
		});

		marker.setMap(map);
		markers.push(marker);

		bindInfoWindow(marker, map, marker.title, marker.disc, marker.desc, marker.web);
	}
	map.fitBounds(bounds);

	function bindInfoWindow(marker, map, title, disc, desc, web) {
		var infoWindowVisible = (function() {
			var currentlyVisible = false;
			return function(visible) {
				if (visible !== undefined) {
					currentlyVisible = visible;
				}
				return currentlyVisible;
			};
		}());
		iw = new google.maps.InfoWindow();
		google.maps.event.addListener(marker, 'click', function() {
			if (infoWindowVisible()) {
				iw.close();
				infoWindowVisible(false);
			} else {
				// styling of marker text (fix when have time)
				var html = "<div style='color:#000;background-color:#fff;padding:5px;width:150px;'><h4>" + title + "</h4><p>" + disc + "</p><p>" + desc + "</p><p>" + web + "</p></div>";

				iw = new google.maps.InfoWindow({
					content: html
				});
				iw.open(map, marker);
				infoWindowVisible(true);
			}
		});
	}
}

function calculateAndDisplayRoute() {
    // First, remove any existing markers from the map
	if (markers.length !== 0) {
		for (i = 0; i < markers.length; i++) markers[i].setMap(null);
	}
	console.log(markers[0]);

	// Retrieve the start and end locations and create a DirectionsRequest using travelMode value
	// travelMode can be DRIVING, BICYLING, TRANSIT, WALKING
	directionsService.route({
		origin: input.value,
		destination: "Madison Av/E 58 St, New York, NY, United States",
		travelMode: 'WALKING'
	}, function(response, status) {
		// Route the directions and pass the response to a function to create
		// markers for each step.
		if (status === 'OK') {
			directionsDisplay.setDirections(response);
			showSteps(response);
		} else {
			window.alert('Directions request failed due to ' + status);
		}
	});
}

function showSteps(directionResult) {
	// For each step, place a marker, and add the text to the marker's infowindow.
	// Also attach the marker to an array so we can keep track of it and remove it when calculating new routes.
	var myRoute = directionResult.routes[0].legs[0];
	for (var i = 0; i < myRoute.steps.length; i++) {
		var marker = markers[i] = markers[i] || new google.maps.Marker();
		marker.setMap(map);
		marker.setPosition(myRoute.steps[i].start_location);
	}
}
