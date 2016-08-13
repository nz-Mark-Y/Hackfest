function action() {
	//console.log(document.getElementById('end').value);
	sendRequest();
	calculateAndDisplayRoute(directionsDisplay, directionsService, markers, stepDisplay, map);
}

function calculateAndDisplayRoute(directionsDisplay, directionsService, markers, stepDisplay, map) {
    // First, remove any existing markers from the map
    markers[0].setMap(null);

	// Retrieve the start and end locations and create a DirectionsRequest using travelMode value
	// travelMode can be DRIVING, BICYLING, TRANSIT, WALKING
	directionsService.route({
		origin: city_name,
		destination: "Microsoft Store - Fifth Avenue, 5th Avenue, New York, NY",
		travelMode: 'WALKING'
	}, function(response, status) {
		// Route the directions and pass the response to a function to create
		// markers for each step.
		if (status === 'OK') {
			document.getElementById('warnings-panel').innerHTML = '<b>' + response.routes[0].warnings + '</b>';
			directionsDisplay.setDirections(response);
			showSteps(response, markers, stepDisplay, map);
		} else {
			window.alert('Directions request failed due to ' + status);
		}
	});
}

function showSteps(directionResult, markers, stepDisplay, map) {
	// For each step, place a marker, and add the text to the marker's infowindow.
	// Also attach the marker to an array so we can keep track of it and remove it when calculating new routes.
	var myRoute = directionResult.routes[0].legs[0];
	for (var i = 0; i < myRoute.steps.length; i++) {
		var marker = markers[i] = markers[i] || new google.maps.Marker();
		marker.setMap(map);
		marker.setPosition(myRoute.steps[i].start_location);
		attachInstructionText(stepDisplay, marker, myRoute.steps[i].instructions, map);
	}
}

function attachInstructionText(stepDisplay, marker, text, map) {
	google.maps.event.addListener(marker, 'click', function() {
		// Open an info window when the marker is clicked on, containing the text of the step.
		stepDisplay.setContent(text);
		stepDisplay.open(map, marker);
	});
}
