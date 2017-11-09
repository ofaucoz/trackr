"use strict";

var canvasLayer;
var context;
var resolutionScale = window.devicePixelRatio || 1;
var map;
var geocoder;
var markers;
var circles;
var defaultLocation = new google.maps.LatLng(47.1, 15.4);	//Graz coords

/* map themes
=============
awesome default theme by Andrea! */

var defaultTheme = [{featureType:"water",stylers:[{color:"#19a0d8"}]},{featureType:"administrative",elementType:"labels.text.stroke",stylers:[{color:"#ffffff"},{weight:6}]},{featureType:"administrative",elementType:"labels.text.fill",stylers:[{color:"#e85113"}]},{featureType:"road.highway",elementType:"geometry.stroke",stylers:[{color:"#efe9e4"},{lightness:-40}]},{featureType:"transit.station",stylers:[{weight:9},{hue:"#e85113"}]},{featureType:"road.highway",elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"water",elementType:"labels.text.stroke",stylers:[{lightness:100}]},{featureType:"water",elementType:"labels.text.fill",stylers:[{lightness:-100}]},{featureType:"poi",elementType:"geometry",stylers:[{visibility:"on"},{color:"#f0e4d3"}]},{featureType:"road.highway",elementType:"geometry.fill",stylers:[{color:"#efe9e4"},{lightness:-25}]}];
var assassinsTheme = [{"featureType":"all","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"all","elementType":"labels","stylers":[{"visibility":"off"},{"saturation":"-100"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40},{"visibility":"off"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"off"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#4d6059"}]},{"featureType":"landscape","elementType":"geometry.stroke","stylers":[{"color":"#4d6059"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"color":"#4d6059"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"lightness":21}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#4d6059"}]},{"featureType":"poi","elementType":"geometry.stroke","stylers":[{"color":"#4d6059"}]},{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#7f8d89"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#7f8d89"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#7f8d89"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#7f8d89"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#7f8d89"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#7f8d89"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"#7f8d89"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"color":"#7f8d89"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#2b3638"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#2b3638"},{"lightness":17}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#24282b"}]},{"featureType":"water","elementType":"geometry.stroke","stylers":[{"color":"#24282b"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.icon","stylers":[{"visibility":"off"}]}];

// ==================================

function makeMap() {
	
	var mapOptions = {
		center: defaultLocation,
		zoom: 10,
		styles: defaultTheme,
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
	
	var defaultIcon = makeMarkerIcon('0091ff');
	var highlightedIcon = makeMarkerIcon('FFFF24');
	var infoWindow = new google.maps.InfoWindow();
	
	//link up to database to get twitter data goes here!!!! and replaces var data
	var data = [
        {title: 'Alte Technik', location: {lat: 47.068971, lng: 15.450100}},
        {title: 'Kopernikusgasse', location: {lat: 47.064993, lng: 15.450765}},
        {title: 'Inffeldgasse', location: {lat: 47.058339, lng: 15.457897}}
    ];
	
	var bounds = new google.maps.LatLngBounds();
	for (var i = 0; i < data.length; i++) {
		var marker = new google.maps.Marker ({
			position: data[i].location,
			title: data[i].tweet,
			map: map,
			animation: google.maps.Animation.DROP,
			icon: defaultIcon
		});
		//Marker changes colour on mouseover
		marker.addListener('mouseover', function() {
           this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
           this.setIcon(defaultIcon);
        });
		//Open an infowindow when clicked which shows the tweet
        marker.addListener('click', function() {
            populateInfoWindow(this, infoWindow);
        });
		markers.push(marker);
		bounds.extend(markers[i].position);
	}
	map.fitBounds(bounds);
	
}

function makeMarkerIcon(markerColor){
        var markerImage = new google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
          '|40|_|%E2%80%A2',
          new google.maps.Size(21, 34),
          new google.maps.Point(0, 0),
          new google.maps.Point(10, 34),
          new google.maps.Size(21,34));
        return markerImage;
}

//only one info window allowed at a time
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already open on this marker.
    if (infowindow.marker != marker) {
		infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.position + '</div>' + marker.title);
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
			infowindow.marker = null;
		});
    }
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
		defaultLocation = new google.maps.LatLng(pos);
		var marker = new google.maps.Marker ({
			position: pos,
			map: map,
			title: 'Current Location'
		});
		markers.push(marker);
		var circleRadius = document.getElementById('search_radius').value;		//defaults to first option (0.01) if none selected
		circles.push({center: defaultLocation, radius: circleRadius});
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
		//$('#search').popover('show');
	}
	else {
		$('#search').popover('hide');
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
	
	$('#reset').popover('show');
	
	document.getElementById('reset_confirm').addEventListener('click', function() {
		$('#reset').popover('hide');
		map.setCenter(defaultLocation);
		map.setZoom(10);
		for (var i = 0; i < markers.length; i++) {
			markers[i].setMap(null); 	//removes marker from map
		}
		markers = [];
		circles = [];
		update();						//redraw canvas
	});
	
	document.getElementById('reset_cancel').addEventListener('click', function() {
		$('#reset').popover('hide');
	});
	
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
	* to consider: https://coderwall.com/p/wixovg/bootstrap-without-all-the-debt
	* ADD SEMANTIC ELEMENTS AND ARIA ACCESSIBILITY FRAMEWORK!!!
	* consider this for date time http://www.daterangepicker.com/#config  but idk if we should add more libs
	* or https://github.com/smalot/bootstrap-datetimepicker, fewer dependencies. current html5 ele not compatible with all browsers
	* this also looks interesting https://www.sitepoint.com/finding-date-picker-input-solution-bootstrap/
	* check out https://fonts.google.com/
	*/











