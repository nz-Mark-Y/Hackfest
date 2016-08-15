var currentLocation;
var map;
var markers = [];
var directionsService;
var directionsDisplay;
var input;
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
	    mapTypeId: google.maps.MapTypeId.ROADMAP,
		styles: [{"featureType":"administrative.land_parcel","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"simplified"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"hue":"#f49935"}]},{"featureType":"road.highway","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"hue":"#fad959"}]},{"featureType":"road.arterial","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"visibility":"simplified"}]},{"featureType":"road.local","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"hue":"#a1cdfc"},{"saturation":30},{"lightness":49}]}]
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
	if (currentLocation !== undefined) {	// if the search box has been used at least once
	    var range = document.getElementById("range-slider")[0].value;
		document.getElementById("loading").className += " is-active";
		getCity(range);
	}
}

function getCity(range) {
	var xmlhttp = new XMLHttpRequest();
	var returnedCity;
	var arrayNum;
	var cityString;
	xmlhttp.onreadystatechange = function() {
		// http://www.w3schools.com/xml/dom_httprequest.asp
    	if (xmlhttp.readyState == 4 ) {
        	if (xmlhttp.status == 200) {
        		returnedCity = JSON.parse(xmlhttp.responseText);
				arrayNum = returnedCity.results.length - 4;  // index of returnedCity.results array, which gives full name of location typed
				cityString = cityPuller(returnedCity.results[arrayNum].formatted_address);
				getDiscounts(cityString, range);
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

function getDiscounts(city_name, radius) {
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
    xmlhttp2.open("GET", "https://vast-bastion-98645.herokuapp.com/getdealsforlocation?lat=" + currentLocation.lat() + "&lon=" + currentLocation.lng() + "&location=" + city_name + "&radius_filter=" + (21000-radius), true);
    xmlhttp2.send();
}

function cityPuller(cityString) {
	if (cityString.indexOf(',') != -1) {
    	var segments = cityString.split(',');
		cityString = segments[0];
		if (cityString.indexOf('-') != -1) {
			segments = cityString.split('-');
			cityString = segments[0];
		}
	}
	cityString = cityString.replace(/[0-9]/g, '');
	return cityString;
}
