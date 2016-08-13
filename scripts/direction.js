function action() {
	//console.log(document.getElementById('end').value);
	if (yolo === undefined) sendRequest();
	var bounds = new google.maps.LatLngBounds();
	for (var i = 0; i < returnedDiscounts.length; i++) {
		// Create a marker for each place
		var position = new google.maps.LatLng(returnedDiscounts[i].coordinates.latitude, returnedDiscounts[i].coordinates.longitude);
		bounds.extend(position);
		var marker = new google.maps.Marker({
			map: map,
			icon: 'https://mapbuildr.com/assets/img/markers/solid-pin-red.png',
			title: returnedDiscounts[i].name,
			position: position
		});
		marker.setMap(map);
		markers.push(marker);
	}
	/*if (yolo.readyState == 4) {
		calculateAndDisplayRoute();
	}*/
	map.fitBounds(bounds);
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
