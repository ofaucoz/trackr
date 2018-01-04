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
var userLocationSet;
var resultCount;
var debugMode = false;	//set this to false to disable hard-coded JSON "response" from "server"
var circleSelectedNum = -1; //Select which circles to modify with canvas
var quantityCircles = 0; //How many circles are in the map (for canvas)

// Map Themes
// ==========


//TODO: add more styles here
//no need to add to HTML code for extra style, we auto add select options to the HTML with JS
var defaultTheme = [{featureType:"water",stylers:[{color:"#19a0d8"}]},{featureType:"administrative",elementType:"labels.text.stroke",stylers:[{color:"#ffffff"},{weight:6}]},{featureType:"administrative",elementType:"labels.text.fill",stylers:[{color:"#e85113"}]},{featureType:"road.highway",elementType:"geometry.stroke",stylers:[{color:"#efe9e4"},{lightness:-40}]},{featureType:"transit.station",stylers:[{weight:9},{hue:"#e85113"}]},{featureType:"road.highway",elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"water",elementType:"labels.text.stroke",stylers:[{lightness:100}]},{featureType:"water",elementType:"labels.text.fill",stylers:[{lightness:-100}]},{featureType:"poi",elementType:"geometry",stylers:[{visibility:"on"},{color:"#f0e4d3"}]},{featureType:"road.highway",elementType:"geometry.fill",stylers:[{color:"#efe9e4"},{lightness:-25}]}];
var assassinsTheme = [{"featureType":"all","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"all","elementType":"labels","stylers":[{"visibility":"off"},{"saturation":"-100"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40},{"visibility":"off"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"off"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#4d6059"}]},{"featureType":"landscape","elementType":"geometry.stroke","stylers":[{"color":"#4d6059"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"color":"#4d6059"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"lightness":21}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#4d6059"}]},{"featureType":"poi","elementType":"geometry.stroke","stylers":[{"color":"#4d6059"}]},{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#7f8d89"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#7f8d89"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#7f8d89"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#7f8d89"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#7f8d89"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#7f8d89"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"#7f8d89"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"color":"#7f8d89"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#2b3638"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#2b3638"},{"lightness":17}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#24282b"}]},{"featureType":"water","elementType":"geometry.stroke","stylers":[{"color":"#24282b"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.icon","stylers":[{"visibility":"off"}]}];
var styles = {"Trackr Classic" : defaultTheme, "Assassins Creed" : assassinsTheme};

//Map Canvas
//===========

function resize() {
	//Do not delete, CanvasLayer requires this definition
}

//Draws HTML5 canvas overlay
function update() {

	context.clearRect(0, 0, canvasLayer.canvas.width, canvasLayer.canvas.height);	//clears the entire canvas. Everything must be redrawn below
	context.fillStyle = 'rgba(0, 0, 255, 0.3)';										//blue with 70% transparency

	var mapProjection = map.getProjection();
	context.setTransform(1, 0, 0, 1, 0, 0); 										//reset transform
	var scale = Math.pow(2, map.zoom) * resolutionScale;							// scale is 2 ^ zoom + we account for resolutionScale
	context.scale(scale, scale);
	var offset = mapProjection.fromLatLngToPoint(canvasLayer.getTopLeft());
	context.translate(-offset.x, -offset.y);

	//draw circles
	for(var i=0; i < circles.length; i++){
		var worldPoint = mapProjection.fromLatLngToPoint(circles[i].center);
		context.beginPath();
		context.arc(worldPoint.x, worldPoint.y, circles[i].radius,0,2*Math.PI);
		context.fill();
		if (quantityCircles < circles.length) { //if there is any new circle, select it to increase/decrease its radius by default
			circleSelectedNum = circles.length-1;
			quantityCircles = circles.length;
		}
	}
}

//Finds circle corresponding to selected marker
function selectCircle(marker) {
	 for(var i=0; i<markers.length; i++){
		 if(marker.position === markers[i].position){
			 circleSelectedNum = i;
			 break;
		 }else{
			 circleSelectedNum = -1;
		 }
	 }
}

 //Increase size of selected circle
 function increaseRadius() {
	 circles[circleSelectedNum].radius *=1.2;
	 update();
 }

 //Decrease size of selected circle
 function decreaseRadius() {
	 circles[circleSelectedNum].radius *=0.8;
	 update();
 }

 //Increase size of all circles
 function allIncreased() {
	for(var i=0; i < circles.length; i++){
		circles[i].radius*=1.2;
	}
	update();
 }

 //Decrease size of all circles
 function allDecreased() {
	for(var i=0; i < circles.length; i++){
		circles[i].radius*=0.8;
	}
	update();
 }



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
	userLocationSet = false;
	resultCount = 0;

}

function updateMapStyle() {
	map.setOptions( { styles: styles[document.getElementById("map_style").value] } );
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
		quantityCircles = 0;
		update();						//redraw canvas
	});

	document.getElementById('reset_cancel').addEventListener('click', function() {
		$('#reset').popover('hide');
	});

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
	document.getElementById('increase').addEventListener('click', function() {
		increaseRadius();
	});
	document.getElementById('decrease').addEventListener('click', function() {
		decreaseRadius();
	});
	document.getElementById('increaseAll').addEventListener('click', function() {
		allIncreased();
	});
	document.getElementById('decreaseAll').addEventListener('click', function() {
		allDecreased();
	});
	//add address autocomplete, get coords automatically on address change
	var autocomplete = new google.maps.places.Autocomplete(document.getElementById('search_address'));
	google.maps.event.addListener(autocomplete, 'place_changed', function() {
		searchLatitude = autocomplete.getPlace().geometry.location.lat();
		searchLongitude = autocomplete.getPlace().geometry.location.lng();
	});

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
	document.getElementById("overlayButton").onclick = function() {
		document.getElementById("overlayButtonTab").classList.add("active");
		document.getElementById("mapButtonTab").classList.remove("active");
		document.getElementById("overlayFrame").style.display = "block";
	}
	document.getElementById("mapButton").onclick = function(){
		document.getElementById("mapButtonTab").classList.add("active");
		document.getElementById("overlayButtonTab").classList.remove("active");
		hideOverlay();
	}
};
document.addEventListener('DOMContentLoaded', makeMap, false);   //Do I actually need this?

//used to hide project documentation overlay onclick
function hideOverlay(){
	document.getElementById("overlayFrame").style.display = "none";
}

//remember these URLs don't exist so user can't refresh page or share URL - need to fix this somehow??
function updateHistory(state, relativeURL){
	if(!!(window.history && history.pushState)){	//check browser supports HTML5 History API
		//history.pushState('{}', null, './fml'); //add new history entry and change to that URL without reloading page
	}
}

function showErrorPopup(errorMsg){
	document.getElementById('search').setAttribute('data-content', errorMsg);
	$('#search').popover('show');
}

//THIS ARRAY NEEDS TO BE REPLACED WITH THE TWEET DATA
//you could add tweet data to global arrays in processTweet() which gets called for each tweet in the response
var data = 
[
{country: "Austria", count: 128167},
{country: "Bulgaria", count: 451492},
{country: "Costa Rica", count: 276782},
{country: "Denmark", count: 427853},
{country: "Estonia", count: 289702},
{country: "Finnland", count: 228568},
{country: "Georgia", count: 203415},
{country: "Honduras", count: 223488},
{country: "Indonesia", count: 245015},
{country: "Jamaica", count: 289988},
];

function makeGraph() {
	var svg = d3.select("svg"),
    margin = {top: 20, right: 50, bottom: 70, left: 10},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

	var x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
	var y = d3.scaleLinear().rangeRound([height, 0]);
	x.domain(data.map(function(d) { return d.country; }));
	y.domain([0, d3.max(data, function(d) { return d.count; })]);

	var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	g.append("g")
    	.attr("class", "axis axis--x")
    	.attr("transform", "translate(0," + height + ")")
    	.call(d3.axisBottom(x));
  
	//svg.select("g")
	g.selectAll("text")
		.attr("transform", "translate(-16,25) rotate(-65)");
  
  
	/*svg.selectAll("text")
	  .data(data)
	  .enter()
	  .append("text")
	  .text(function(d) {
		return d; })*/
	  //.attr("transform"," translate(-16,25) rotate(-65)");
  
	g.append("g")
	    .attr("class", "axis axis--y")
	    .call(d3.axisRight(y).ticks(10).tickSize(width))
	    .append("text")
	    //.attr("transform", "translate(" + width + ",0)", "rotate(-90)")
		.attr("transform", "rotate(-90)")
	    .attr("y", 6)
	    .attr("dy", "0.71em")
	    .attr("text-anchor", "end");

	g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "#777").attr("stroke-dasharray", "2,2");
	
	g.selectAll(".bar")
	    .data(data)
	    .enter().append("rect")
	    .attr("class", "bar")
	    .attr("x", function(d) { return x(d.country); })
	    .attr("y", function(d) { return y(d.count); })
	    .attr("width", x.bandwidth())
	    .attr("height", function(d) { return height - y(d.count); });
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
		searchLatitude = position.coords.latitude;
		searchLongitude = position.coords.longitude;
		var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
        };
		defaultLocation = new google.maps.LatLng(pos);   //update defaultLocation to be user's location
		userLocationSet = true; 						 //this means we will add a marker in processJSONResponse
		document.getElementById('search_address').value = searchLatitude.toString() + ', ' + searchLongitude.toString();
	}

	function handleGeolocationError() {
		alert("Oops, we couldn't find you - please check if you've granted us permission to access your location.");
	}

	return false; //stops link reloading page
}

function search() {
	if(!document.getElementById('hashtag').value && (searchLatitude === null) && (searchLongitude===null)) {
		showErrorPopup("Please enter some search criteria.");
	}
	else {	//construct server API query
		//example query http://localhost:8080/trackr/search?latitude=47.076668&longitude=15.421371&radius=1mi&hashtag=tugraz
		$('#search').popover('hide');
		var query = [];
		if(searchLatitude !== undefined && searchLongitude !== undefined) {
			query.push('latitude=' + searchLatitude + '&');
			query.push('longitude=' + searchLongitude + '&');
			var radiusForm = document.getElementById('search_radius');
			var radius = radiusForm.options[radiusForm.selectedIndex].text;  //get currently selected label
			var numericRadius = radiusForm.options[radiusForm.selectedIndex].value;
			//var numericRadius = radiusForm.options[radiusForm.selectedIndex].value * 100;
			radius = radius.replace(/ /g,''); //remove space
			query.push('radius=' + radius + '&');
			var pos = {
					lat: searchLatitude,
					lng: searchLongitude,
				};
			circles.push({center: new google.maps.LatLng(pos), radius: numericRadius});
			console.log("circle pushed");
		}
		//if(document.getElementById('until_date').value) {
			//TODO: not implemented on server side yet
		//}
		if(document.getElementById('hashtag').value) {
			query.push('hashtag=' + sanitizeUserInput(document.getElementById('hashtag').value));
		}
		query = query.join('');
		if(query.charAt(query.length - 1) == '&'){  //remove trailing &s
			query = query.substr(0, query.length - 2);
		}

		if(window.XMLHttpRequest){
			var request = new XMLHttpRequest();
			request.onreadystatechange = processJSONResponse;
			request.open('GET', 'http://localhost:8080/trackr/search?' + query, true);
			request.send(null);
			//updateHistory('null', query);	            //TODO: fix HTML5 history usage - this doesn't update page
		}
		else{
			alert("Sorry, your browser doesn't support AJAX - please try using #trackr with a more up-to-date browser!");
		}
	}
}


//converts all whitespace chars to single space and removes special characters
//important for security as we use their input in the URL
function sanitizeUserInput(input) {
	input = input.replace(/[`~!@#$%^&*§()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
	return input.replace(/\s\s*/g, '&nbsp;');
}


//Server Communication
//====================


function processJSONResponse(debugTweets){
	if (debugMode) {
		resetResultCount();
		var tweets = JSON.parse(debugTweets); //DEBUG
		for(var i = 0; i < tweets.statuses.length; i++){
			processTweet(tweets.statuses[i]);
		}
		if(userLocationSet) {
			addMarkerToMap(defaultLocation, "Current Location");
		}
		update(); //redraw map overlay
		document.getElementById('show-on-results').style.display = '';
	}
	else {
		if (this.readyState == 4 && this.status == 200) {	//response OK
			resetResultCount();
			tweets = JSON.parse(this.responseText);
			var tweets = JSON.parse(this.responseText);
			for(var i = 0; i < tweets.length; i++){
				processTweet(tweets[i]);
			}
			if(userLocationSet) {
				addMarkerToMap(defaultLocation, "Current Location");
			}
			update(); //redraw map overlay
			document.getElementById('show-on-results').style.display = '';
			makeGraph();
		}
	}
}

//Adds marker for tweet if it has coords or a user location. Displays location and tweet text only.
//See https://developer.twitter.com/en/docs/tweets/data-dictionary/overview/tweet-object for details of tweet properties
function processTweet(tweet) {
	if(tweet.coordinates.coordinates != null){
		console.log(tweet.coordinates);
		var coords = tweet.coordinates.coordinates; 
		var pos = {
			lat: coords[0],
			lng: coords[1],
		};
		addMarkerToMap(new google.maps.LatLng(pos), tweet.text);
		incrementResultCount();
	}
	//else if(tweet.place){
		//TODO
	//}
	else if(tweet.user.location){ 		//if coordinates is null then use user.location (the location they set in their profile)
		geocoder.geocode({'address': tweet.user.location}, function(tweet){		//double anonymous functions to bake tweet data into callback
			return(function(results, status){
				if (status == google.maps.GeocoderStatus.OK) {
					if (results[0]) {
						addMarkerToMap(results[0].geometry.location, tweet.text); //TODO: fix this is undefined here bc callback has no access
						incrementResultCount();
						update();
					}
				}
				else{
					console.log("Error geocoding JSON user location");
				}
			});
		}(tweet));
	}
	else {
		console.log("Error: tweet contained no coords or user location");
	}
}

function incrementResultCount(){
	resultCount++;
	document.getElementById('result_count').innerHTML = resultCount.toString();
}

function resetResultCount(){
	resultCount = 0;
	document.getElementById('result_count').innerHTML = '0';
}

//TODO: cache queries maybe? to use another HTML5 featureType
//TODO: semantic markup and ARIA framework
//TODO: graph plotting from tweet data - Gaspar