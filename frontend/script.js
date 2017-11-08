"use strict";

var canvasLayer;
var context;
var resolutionScale = window.devicePixelRatio || 1;
var map;
var geocoder;
var markers;
var circles;
var defaultLocation = new google.maps.LatLng(51.5, -0.12);	//London coords

function makeMap() {
	var mapOptions = {
	center: defaultLocation,
	zoom: 10,
	mapTypeId: google.maps.MapTypeId.HYBRID
	}
	
	map = new google.maps.Map(document.getElementById("map"), mapOptions);
	markers = [];
	circles = [];
	geocoder = new google.maps.Geocoder;
	
	var clOptions = {
		map: map,
		resizeHandler: resize,
		animate: false,
		updateHandler: update,
		resolutionScale: resolutionScale
	};
	canvasLayer = new CanvasLayer(clOptions);
	context = canvasLayer.canvas.getContext('2d');
	
	google.maps.event.addListener(map, 'click', function(event) {
		var marker = new google.maps.Marker ({
			position: new google.maps.LatLng(event.latLng.lat(), event.latLng.lng()),
			map: map,
			title: 'Hello World!'
		});
		markers.push(marker);
	} );
}

function resize() {
	//TODO
}

//this draws our HTML5 Canvas map overlay
function update() {

	context.clearRect(0, 0, canvasLayer.canvas.width, canvasLayer.canvas.height);	//clears the entire canvas. Everything must be redrawn below
	context.fillStyle = 'rgba(0, 0, 255, 0.3)';										//blue with 70% transparency
	
	//NOTE: this projection section needs checking
	var mapProjection = map.getProjection();
	context.setTransform(1, 0, 0, 1, 0, 0); 										//reset transform
	var scale = Math.pow(2, map.zoom) * resolutionScale;							// scale is 2 ^ zoom + we account for resolutionScale
	context.scale(scale, scale);
	var offset = mapProjection.fromLatLngToPoint(canvasLayer.getTopLeft());
	context.translate(-offset.x, -offset.y);
	//end projection section
	
	for(var i=0; i < circles.length; i++){
		var worldPoint = mapProjection.fromLatLngToPoint(circles[i].center);
		context.beginPath();
		context.arc(worldPoint.x, worldPoint.y, circles[i].radius,0,2*Math.PI);
		context.fill();
	}
	
}

function searchUserCurrentLocation() {
	
	if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(search, handleGeolocationError);
	}
	else {
			alert("Your browser doesn't support geolocation, sorry!");
	}
	
	function search(position) {
		var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
        };
		map.setCenter(pos);
		var marker = new google.maps.Marker ({
			position: pos,
			map: map,
			title: 'Current Location'
		});
		markers.push(marker);
		var circleRadius = document.getElementById('search_radius').value;		//defaults to first option (0.01) if none selected
		circles.push({center: new google.maps.LatLng(pos), radius: circleRadius});
		update();	//redraw map overlay
	}
	
	function handleGeolocationError() {
		alert("Oops, we couldn't find you - please check if you've granted us permission to access your location.");
	}
	
	return false; //stops link reloading page?
}

function searchUserInputLocation() {
	var userInput = document.getElementById('search_address').value;
	if(!userInput) {
		alert('Please enter an address into the search box.');
	}
	else {
		geocoder.geocode({'address': userInput}, function(results, status) {
			if (status === 'OK') {
				if (results[0]) {
					map.setCenter(results[0].geometry.location);
					var marker = new google.maps.Marker ({
						position: results[0].geometry.location,
						map: map,
						title: 'Searched Location'
					});
					markers.push(marker);
					var circleRadius = document.getElementById('search_radius').value;		//defaults to first option (0.01) if none selected
					circles.push({center: results[0].geometry.location, radius: circleRadius});
					update();	//redraw map overlay
				}
			}
			else if (status == 'ZERO_RESULTS') {	
				alert('The address could not be found.');
			}
			else if (status == 'OVER_QUERY_LIMIT') {
				alert('Oops! We\'re over our Google Maps query limit, please try again later.');
			}
			else {	// server error, request timed out, etc
				alert ('Search failed due to the following error: ' + status + '. Please check your internet connection.');
			}
		});	
	}	
}

function resetMap(){
	var userConfirmed = confirm('This will delete all your markers. Are you sure?');
		if(userConfirmed){
			map.setCenter(defaultLocation);
			map.setZoom(10);
			for (var i = 0; i < markers.length; i++) {
				markers[i].setMap(null); 	//removes marker from map
			}
			markers = [];
			circles = [];
			update();						//redraw canvas
		}		
}

document.addEventListener('DOMContentLoaded', makeMap, false);   //Do I actually need this?

window.onload = function () {
	document.getElementById('find_me').addEventListener('click', function() {
		searchUserCurrentLocation();
	});
	document.getElementById('search').addEventListener('click', function() {
		searchUserInputLocation();
	});
	document.getElementById('reset').addEventListener('click', function() {
		resetMap();
	});
	var autocomplete = new google.maps.places.Autocomplete(document.getElementById('search_address'));
};

//idea: draw Canvas circle with centre approx. location of Tweet (for super vague Tweet locations like 'Texas')
/* TODO:
	* Add options for different map styles - great free themes available here: https://snazzymaps.com/, I like assassin's creed IV, becomeadinosaur, and Facebook.
	* Add labels on/off toggle
	* Also option to switch between map / satellite mode etc
	* see here for more info, also explains about map projections. https://developers.google.com/maps/documentation/javascript/maptypes?
	* also google has a map style generator https://mapstyle.withgoogle.com/
	* https://maps-apis.googleblog.com/2015/04/interactive-data-layers-in-javascript.html
	* TERRAIN VIEW
*/











