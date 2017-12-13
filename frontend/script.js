"use strict";

var canvasLayer;
var context;
var resolutionScale = window.devicePixelRatio || 1;
var map;
var geocoder;
var markers;
var circles;
var defaultLocation = new google.maps.LatLng(47.1, 15.4);	//Graz coords
var defaultIcon;
var highlightedIcon;
var bounds;
var infoWindow;
var searchLatitude;
var searchLongitude;

// Map Themes
// ==========


//TODO: add more styles here
//no need to add to HTML code for extra style, we auto add select options to the HTML with JS
var defaultTheme = [{featureType:"water",stylers:[{color:"#19a0d8"}]},{featureType:"administrative",elementType:"labels.text.stroke",stylers:[{color:"#ffffff"},{weight:6}]},{featureType:"administrative",elementType:"labels.text.fill",stylers:[{color:"#e85113"}]},{featureType:"road.highway",elementType:"geometry.stroke",stylers:[{color:"#efe9e4"},{lightness:-40}]},{featureType:"transit.station",stylers:[{weight:9},{hue:"#e85113"}]},{featureType:"road.highway",elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"water",elementType:"labels.text.stroke",stylers:[{lightness:100}]},{featureType:"water",elementType:"labels.text.fill",stylers:[{lightness:-100}]},{featureType:"poi",elementType:"geometry",stylers:[{visibility:"on"},{color:"#f0e4d3"}]},{featureType:"road.highway",elementType:"geometry.fill",stylers:[{color:"#efe9e4"},{lightness:-25}]}];
var assassinsTheme = [{"featureType":"all","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"all","elementType":"labels","stylers":[{"visibility":"off"},{"saturation":"-100"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40},{"visibility":"off"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"off"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#4d6059"}]},{"featureType":"landscape","elementType":"geometry.stroke","stylers":[{"color":"#4d6059"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"color":"#4d6059"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"lightness":21}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#4d6059"}]},{"featureType":"poi","elementType":"geometry.stroke","stylers":[{"color":"#4d6059"}]},{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#7f8d89"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#7f8d89"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#7f8d89"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#7f8d89"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#7f8d89"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#7f8d89"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"#7f8d89"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"color":"#7f8d89"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#2b3638"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#2b3638"},{"lightness":17}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#24282b"}]},{"featureType":"water","elementType":"geometry.stroke","stylers":[{"color":"#24282b"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.icon","stylers":[{"visibility":"off"}]}];
var styles = {"Trackr Classic" : defaultTheme, "Assassins Creed" : assassinsTheme};


// Map Drawing
// ===========


//initialises global map variables
function makeMap() {
	
	map = new google.maps.Map(document.getElementById("map"), {
		center: defaultLocation,
		zoom: 10,
		styles: defaultTheme,
	});
	markers = [];
	circles = [];
	geocoder = new google.maps.Geocoder;
	canvasLayer = new CanvasLayer({
		map: map,
		resizeHandler: resize,
		animate: false,
		updateHandler: update,
		resolutionScale: resolutionScale
	});
	context = canvasLayer.canvas.getContext('2d');
	defaultIcon = makeMarkerIcon('0091ff');
	highlightedIcon = makeMarkerIcon('FFFF24');
	infoWindow = new google.maps.InfoWindow();
	bounds = new google.maps.LatLngBounds();
	
	//link up to database to get twitter data goes here!!!! and replaces var data
	var data = [
        {title: 'Alte Technik', location: {lat: 47.068971, lng: 15.450100}},
        {title: 'Kopernikusgasse', location: {lat: 47.064993, lng: 15.450765}},
        {title: 'Inffeldgasse', location: {lat: 47.058339, lng: 15.457897}}
    ];
	
	for (var i = 0; i < data.length; i++) {
		addMarkerToMap(data[i].location, data[i].title);
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

function updateMapStyle() {
	map.setOptions( { styles: styles[document.getElementById("map_style").value] } );
}


// Map Markers
// ===========


function addMarkerToMap(location, markerTitle){
	var marker = new google.maps.Marker ({
		position: location,
		map: map,
		title: markerTitle,
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
	bounds.extend(marker.position);
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


// Updating Display - Non-Map UI
// =============================


//TODO: if this causes problems here move it to bottom of script
window.onload = function () {	
	//hide tweet count and graphs before we have tweet results
	document.getElementById('show-on-results').style.display = 'none';
	//assign click event listeners
	document.getElementById('find_me').addEventListener('click', function() {
		searchUserCurrentLocation();
	});
	document.getElementById('search').addEventListener('click', function() {
		search();
	});
	document.getElementById('reset').addEventListener('click', function() {
		resetMap();
	});
	//add address autocomplete
	var autocomplete = new google.maps.places.Autocomplete(document.getElementById('search_address'));
	//fill map styles select element from styles array
	document.getElementById("map_style").innerHTML = Object.keys(styles).map(function(styleName, styleJSON) {
		return '<option value="'+styleName+'">'+styleName+'</option>'; })
	.join('');
	//set date limits based on current date - advisory for user only, still need to check form input
	var currentDate = new Date(Date.now());
	var minDate = new Date(new Date() - 86400000 * 7).toISOString().split('T')[0]; //7 days before current date
	currentDate = currentDate.toISOString().split('T')[0];
	document.getElementById("until_date").setAttribute("max", currentDate);	
	document.getElementById("until_date").setAttribute("min", minDate);
};
document.addEventListener('DOMContentLoaded', makeMap, false);   //Do I actually need this?

//remember these URLs don't exist so user can't refresh page or share URL - need to fix this somehow??
function updateHistory(state, relativeURL){
	if(!!(window.history && history.pushState)){	//check browser supports HTML5 History API
		//history.pushState('{}', null, './fml'); //add new history entry and change to that URL without reloading page
		//TODO: only uncomment this if running on a server e.g. on localhost rather than opening directly in browser
	}
}

//TODO: fix links so not using # href: https://stackoverflow.com/questions/134845/which-href-value-should-i-use-for-javascript-links-or-javascriptvoid0?rq=1
//TODO: add little popup to explain to user if they're on desktop that location is v approximate

function showErrorPopup(errorMsg){
	document.getElementById('search').setAttribute('data-content', errorMsg);
	$('#search').popover('show');
}


// User Search
// ===========

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
		defaultLocation = new google.maps.LatLng(pos);
		addMarkerToMap(pos, "Current Location");
		map.setCenter(pos);
		var circleRadius = document.getElementById('search_radius').value;		//defaults to first option (0.01) if none selected
		circles.push({center: defaultLocation, radius: circleRadius});
		update();	//redraw map overlay
	}
	
	function handleGeolocationError() {
		alert("Oops, we couldn't find you - please check if you've granted us permission to access your location.");
	}
	
	return false; //stops link reloading page?
}

/*
function searchUserInputLocation() {
	var userInput = document.getElementById('search_address').value;
	if(!userInput) {
		$('#search').popover('show');
	}
	else {
		$('#search').popover('hide');
		geocoder.geocode({'address': userInput}, function(results, status) {
			if (status === 'OK') {
				if (results[0]) {
					map.setCenter(results[0].geometry.location);
					addMarkerToMap(results[0].geometry.location, results[0].formatted_address); 
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
*/

function search() {
	if(!document.getElementById('hashtag').value && (latitude === null) && (longitude===null)) {
		showErrorPopup("Please enter some search criteria.");
	}
	else {	//construct server API query
		//example query http://localhost:8080/trackr/search?latitude=47.076668&longitude=15.421371&radius=1mi&hashtag=tugraz
		$('#search').popover('hide');
		var query = [];
		var error = false;
		if(latitude !== null && longitude !== null) {
			// ugh geocoding is async so need to do it as soon as they enter an address, would prefer to do it server-side tbh
			query.push('latitude= ' + searchLatitude + '&'); 
			query.push('longitude= ' + searchLongitude + '&'); 
			var radius = document.getElementById('search_radius').value ? document.getElementById('search_radius').value : 10;
			query.push('radius= ' + radius + 'km&');
		}
		if(document.getElementById('hashtag').value) {
			query.push('hashtag=' + sanitizeUserInput(document.getElementById('hashtag').value));
		}
		//if(document.getElementById('until_date').value) {
			//TODO: not implemented on server side yet
		//}
		if(!error){
			query = query.join('');
			if(query.charAt(query.length - 1) == '&'){  //remove trailing &s
				query = query.substr(0, query.length - 2);
			}
			if(window.XMLHttpRequest){
				var request = new XMLHttpRequest();
				request.onreadystatechange = processJSONResponse;
				request.open('GET', 'http://localhost:8080/trackr/search?' + query, true);
				request.send(null);
			}
			//else{
				//need alternative way of communicating with server, or just show error
			//} 
		}
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

function sanitizeUserInput(input) {
	//convert all whitespace chars to single space and remove special characters
	//important for security as we use their input in the URL
	input = input.replace(/[`~!@#$%^&*§()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
	return input.replace(/\s\s*/g, '&nbsp;');	
}


//Server Communication
//====================


function processJSONResponse(){
	if (this.readyState == 4 && this.status == 200) {	//response OK
		//updateHistory('null', query);
		document.getElementById('show-on-results').style.display = '';
		tweets = JSON.parse(this.responseText.statuses);
		for(tweet in tweets){
			processJSONTweet(tweet);
		}	
    }
	else {
		console.log("Error retrieving tweets from server");
		//TODO: cases for all possible errors/states?
	}
}

function processJSONTweet() {
	//TODO: turn this into a separate function processJSONTweet if it gets any longer
	if(jsonTweet.coordinates){
		addMarkerToMap(jsonTweet.coordinates, jsonTweet.TITLE);
		//TODO: check if these need to be converted
		document.getElementById('result_count').value += 1; //or use this.responseText.search_metadata.count
	}
	//if coordinates is null then use user.location (the location they set in their profile)
	else if(jsonTweet.user.location){
		geocoder.geocode({'address': tweet.user.location}, function(results, status) {
			if (status === 'OK') {
				if (results[0]) {
					addMarkerToMap(results[0].geometry.location, results[0].formatted_address);
					document.getElementById('result_count').value += 1;
				}
			}
			else{
				console.log("Error geocoding JSON user location");
			}
		});	
	}
	else {
		console.log("Error: tweet contained no coords or user location");
	}
}


/* TODO:
	* Also option to switch between map / satellite mode etc
	* see here for more info, also explains about map projections. https://developers.google.com/maps/documentation/javascript/maptypes?
	* also google has a map style generator https://mapstyle.withgoogle.com/
	* https://maps-apis.googleblog.com/2015/04/interactive-data-layers-in-javascript.html
	* TERRAIN VIEW
	* to consider: https://coderwall.com/p/wixovg/bootstrap-without-all-the-debt
	* check out https://fonts.google.com/
	*/

//TODO: cache queries maybe? to use another HTML5 featureType
//TODO: semantic markup and ARIA framework
//TODO: graph plotting from tweet data - Gaspar


/* BACKUP CODE
do not delete, this code will be used again once the back-end is ready to respond to AJAX queries

geocoder.geocode({'address': sanitizeUserInput(document.getElementById('search_address').value)}, function(results, status) {
				if (status === 'OK') {
					if (results[0]) {
						//this is how the request needs to be formatted for twitter API:
						//'/place/' + results[0].geometry.location.lat + ',' + results[0].geometry.location.lng + ',' + document.getElementById('search_radius') + 'km';
						//TODO: MOVE THIS CODE INTO CALLBACK FUNCTION once server API requests working
						map.setCenter(results[0].geometry.location);
						addMarkerToMap(results[0].geometry.location, results[0].formatted_address); 
						var circleRadius = document.getElementById('search_radius').value;
						circles.push({center: results[0].geometry.location, radius: circleRadius});
						update();	//redraw map overlay

					}
				}
				else if (status == 'ZERO_RESULTS') {
					showErrorPopup('The address could not be found.');
					error = true;
				}
				else if (status == 'OVER_QUERY_LIMIT') {
					showErrorPopup('Oops! We\'re over our Google Maps query limit, please try again later.');
					error = true;
				}
				else {	// server error, request timed out, etc
					showErrorPopup('Search failed due to the following error: ' + status + '. Please check your internet connection.');
					error = true;
				}
			});	 
			
			
*/

























