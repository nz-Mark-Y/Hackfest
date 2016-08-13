var currentLocation;
var map;
var markers = [];
var directionsService;
var directionsDisplay;
var city_name;
var xmlhttp;
var input;

function init() {
	var mapOptions = {
	    center: new google.maps.LatLng(40.7128, -74.02),
	    zoom: 12,
	    zoomControl: true,
	    zoomControlOptions: {
	    	style: google.maps.ZoomControlStyle.DEFAULT,
	    },
	    disableDoubleClickZoom: true,
	    mapTypeControl: false,
	    scaleControl: true,
	    scrollwheel: true,
	    panControl: true,
	    streetViewControl: false,
	    draggable: true,
	    overviewMapControl: false,
	    overviewMapControlOptions: {
	    	opened: false,
	    },
	    mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	// Instantiate a directions service.
	directionsService = new google.maps.DirectionsService();

	map = new google.maps.Map(document.getElementById('googlemaps'), mapOptions);

	// Create a renderer for directions and bind it to the map.
	directionsDisplay = new google.maps.DirectionsRenderer({map: map});

	// Create the search box and link it to the UI element.
	input = /** @type {HTMLInputElement} */(document.getElementById('pac-input'));
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

	var searchBox = new google.maps.places.SearchBox(/** @type {HTMLInputElement} */(input));

	// Listen for the event fired when the user selects an item from the pick list. Retrieve the matching places for that item.
	google.maps.event.addListener(searchBox, 'places_changed', function() {
		var places = searchBox.getPlaces();

		if (places.length === 0) {
			return;
		}
		for (var i = 0, marker; marker = markers[i]; i++) {
			marker.setMap(null);
		}

		// For each place, get the icon, place name, and location.
		markers = [];
		var bounds = new google.maps.LatLngBounds();
		for (var i = 0, place; place = places[i]; i++) {
			var image = {
				url: place.icon,
				size: new google.maps.Size(71, 71),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(17, 34),
				scaledSize: new google.maps.Size(25, 25)
			};

			// Create a marker for each place.
			var marker = new google.maps.Marker({
				map: map,
				icon: image,
				title: place.name,
				position: place.geometry.location
			});

			currentLocation = marker.position;

			markers.push(marker);
			bounds.extend(place.geometry.location);
		}
		map.fitBounds(bounds);
	});

	// Bias the SearchBox results towards places that are within the bounds of the current map's viewport.
	google.maps.event.addListener(map, 'bounds_changed', function() {
		searchBox.setBounds(map.getBounds());
	});
}

google.maps.event.addDomListener(window, 'load', init);

function sendRequest() {
    var range = document.getElementById("range-slider")[0].value;
	var city = getCity(currentLocation.lat(), currentLocation.lng());
}

function getCity() {
	xmlhttp = new XMLHttpRequest();
	var returnedData;
	var arrayNum;
	xmlhttp.onreadystatechange = function() {
		// http://www.w3schools.com/xml/dom_httprequest.asp
    	if (xmlhttp.readyState == 4 ) {
        	if (xmlhttp.status == 200) {
        		returnedData = JSON.parse(xmlhttp.responseText);
				arrayNum = returnedData.results.length;
				arrayNum -= 3;
				city_name = returnedData.results[arrayNum].formatted_address;
				console.log(city_name);
				return returnedData.results[arrayNum].formatted_address;
        	}
        	else if (xmlhttp.status == 400) {
            	alert('There was an error 400');
        	}
        	else {
            	alert('Something else other than 200 was returned');
        	}
    	}
	};
    xmlhttp.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?latlng="+ currentLocation.lat() + "," + currentLocation.lng() + "&key=AIzaSyDNd5W4yaBOAbaxyrWyM1mPli6CP8GKY44", true);
    xmlhttp.send();
}

function placingMarker() {
	// customizing location markers & info
	var locations = [["harambe", "gorilla", "0800838383", "harame@limbo.com", "www.google.com", 40.7128, -74.02]];
	for (i = 0; i < locations.length; i++) {
		if (locations[i][1] == 'undefined') {
			description = '';
		} else {
			description = locations[i][1];
		}
		if (locations[i][2] == 'undefined') {
			telephone = '';
		} else {
			telephone = locations[i][2];
		}
		if (locations[i][3] == 'undefined') {
			email = '';
		} else {
			email = locations[i][3];
		}
		if (locations[i][4] == 'undefined') {
			web = '';
		} else {
			web = locations[i][4];
		}
		marker = new google.maps.Marker({
			icon: 'https://mapbuildr.com/assets/img/markers/solid-pin-red.png',
			position: new google.maps.LatLng(locations[i][5], locations[i][6]),
			map: map,
			title: locations[i][0],
			desc: description,
			tel: telephone,
			email: email,
			web: web
		});
		if (web.substring(0, 7) != "http://") {
			link = "http://" + web;
		} else {
			link = web;
		}
		bindInfoWindow(marker, map, locations[i][0], description, telephone, email, web, link);
	}

	function bindInfoWindow(marker, map, title, desc, telephone, email, web, link) {
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
				var html = "<div style='color:#000;background-color:#fff;padding:5px;width:150px;'><h4>" + title + "</h4><p>" + desc + "<p><p>" + telephone + "<p><a href='" + link + "'' >" + web + "<a></div>";

				iw = new google.maps.InfoWindow({
					content: html
				});
				iw.open(map, marker);
				infoWindowVisible(true);
			}
		});
	}
}

function getDiscounts() {
	xmlhttp = new XMLHttpRequest();
	var returnedData;
	var arrayNum;
	xmlhttp.onreadystatechange = function() {
    	if (xmlhttp.readyState == 4 ) {
        	if (xmlhttp.status == 200) {
        		returnedData = JSON.parse(xmlhttp.responseText);
        	}
        	else if (xmlhttp.status == 400) {
            	alert('There was an error 400');
        	}
        	else {
            	alert('Something else other than 200 was returned');
        	}
    	}
	};
    xmlhttp.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?latlng="+ currentLocation.lat() + "," + currentLocation.lng() + "&key=AIzaSyDNd5W4yaBOAbaxyrWyM1mPli6CP8GKY44", true);
    xmlhttp.send();
}