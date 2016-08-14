function action() {
	//console.log(document.getElementById('end').value);
	if (yolo === undefined) sendRequest();
	placingMarker();
	/*if (yolo.readyState == 4) {
		calculateAndDisplayRoute();
	}*/
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

		if (web.substring(0, 7) != "http://") {
			link = "http://" + web;
		} else {
			link = web;
		}

		marker.setMap(map);
		markers.push(marker);

		bindInfoWindow(marker, map, locations[i][0], discounts, description, web, link);
	}
	map.fitBounds(bounds);
	/*for (i = 0; i < locations.length; i++) {
		if (locations[i][1] == 'undefined') {
			discounts = '';
		} else {
			discounts = locations[i][1];
		}
		if (locations[i][2] == 'undefined') {
			description = '';
		} else {
			description = locations[i][2];
		}
		if (locations[i][3] == 'undefined') {
			web = '';
		} else {
			web = locations[i][3];
		}
		marker = new google.maps.Marker({
			icon: 'https://mapbuildr.com/assets/img/markers/solid-pin-red.png',
			position: new google.maps.LatLng(locations[i][4], locations[i][5]),
			map: map,
			title: locations[i][0],
			disc: discounts,
			desc: description,
			web: web
		});
	}*/

	function bindInfoWindow(marker, map, title, disc, desc, web, link) {
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
				var html = "<div style='color:#000;background-color:#fff;padding:5px;width:150px;'><h4>" + title + "</h4><p>" + disc + "<p><p>" + desc + "<p><a href='" + link + "'' >" + web + "<a></div>";

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
