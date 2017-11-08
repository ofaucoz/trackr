"use strict";

var canvasLayer;
var context;
var resolutionScale = window.devicePixelRatio || 1;
var map;
var geocoder;
var markers;
var defaultLocation = new google.maps.LatLng(51.5, -0.12);	//London coords

function makeMap() {
	var mapOptions = {
	center: defaultLocation,
	zoom: 10,
	mapTypeId: google.maps.MapTypeId.HYBRID
	}
	
	map = new google.maps.Map(document.getElementById("map"), mapOptions);
	markers = [];
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
	//TODO maybe
	//no code here in example but think you need the function even if empty
}

function update() {
	//TODO maybe
	
	context.clearRect(0, 0, canvasLayer.canvas.width, canvasLayer.canvas.height);
	context.fillStyle = 'rgba(230, 77, 26, 1)';
	//blah blah blah a load of other stuff should go here
	//ok turns out that rubbish was quite important
	
	var mapProjection = map.getProjection();
	context.setTransform(1, 0, 0, 1, 0, 0); //reset transform from last update - identity matrix
	
	// scale is 2 ^ zoom + we account for resolutionScale
	var scale = Math.pow(2, map.zoom) * resolutionScale;
	context.scale(scale, scale);
	
	var offset = mapProjection.fromLatLngToPoint(canvasLayer.getTopLeft());
	context.translate(-offset.x, -offset.y);
	
	var worldPoint = mapProjection.fromLatLngToPoint(defaultLocation);
	context.fillRect(worldPoint.x, worldPoint.y, 0.5, 0.5);
	
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
	}
	
	function handleGeolocationError() {
		alert("Geolocation failed.");
	}
	
	return false; //stops link reloading page?
}

function searchUserInputLocation() {
	var userInput = document.getElementById('search_address').value;
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
			}
			else {
				alert('Error: no results found');
			}
		}
		else {
			alert ('Geocoder failed due to: ' + status);
		}
	});
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

//idea: draw Canvas circle with centre approx. location of Tweet
//for super vague Tweet locations like 'Texas'
//note Google has its own way of adding map circles in its API. much much better
//but that isn't using HTML5 Canvas, ugh