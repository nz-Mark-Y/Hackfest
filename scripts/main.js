var currentLocation;
var map;
var markers = [];
var directionsService;
var directionsDisplay;
var yolo;
var input;
var city_name;
var returnedDiscounts;

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
	document.getElementById("loading").className += " is-active";
	getCity(range);
}

function getCity(range) {
	var xmlhttp = new XMLHttpRequest();
	yolo = xmlhttp;
	var returnedCity;
	var arrayNum;
	xmlhttp.onreadystatechange = function() {
		// http://www.w3schools.com/xml/dom_httprequest.asp
    	if (xmlhttp.readyState == 4 ) {
        	if (xmlhttp.status == 200) {
        		returnedCity = JSON.parse(xmlhttp.responseText);
				arrayNum = returnedCity.results.length;
				arrayNum -= 3;
				city_name = returnedCity.results[arrayNum].formatted_address;
				getDiscounts(currentLocation.lat(), currentLocation.lng(), city_name, range);
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

function getDiscounts(lat, lng, city_name, radius) {
	var xmlhttp2 = new XMLHttpRequest();
	xmlhttp2.onreadystatechange = function() {
    	if (xmlhttp2.readyState == 4 ) {
        	if (xmlhttp2.status == 200) {
        		returnedDiscounts = JSON.parse(xmlhttp2.responseText);
				action1();
        	}
        	else if (xmlhttp2.status == 400) {
            	alert('There was an error 400');
        	}
        	else {
            	alert('Something else other than 200 was returned');
        	}
			document.getElementById("loading").className = "mdl-spinner mdl-js-spinner";
    	}
	};
    xmlhttp2.open("GET", "https://vast-bastion-98645.herokuapp.com/getdealsforlocation?lat=" + lat + "&lon=" + lng + "&location=" + city_name + "&radius_filter=" + (radius*1000), true);
    xmlhttp2.send();
}
