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
var circleSelectedNum = -1; //Select which circles to modify with canvas
var quantityCircles = 0; //How many circles are in the map (for canvas)
var langs = [];
var countries = [];
var geocodersToReturn = 0;

// Map Themes
// ==========


//no need to add to HTML code for extra style, we auto add select options to the HTML with JS
var defaultTheme = [{featureType:"water",stylers:[{color:"#19a0d8"}]},{featureType:"administrative",elementType:"labels.text.stroke",stylers:[{color:"#ffffff"},{weight:6}]},{featureType:"administrative",elementType:"labels.text.fill",stylers:[{color:"#e85113"}]},{featureType:"road.highway",elementType:"geometry.stroke",stylers:[{color:"#efe9e4"},{lightness:-40}]},{featureType:"transit.station",stylers:[{weight:9},{hue:"#e85113"}]},{featureType:"road.highway",elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"water",elementType:"labels.text.stroke",stylers:[{lightness:100}]},{featureType:"water",elementType:"labels.text.fill",stylers:[{lightness:-100}]},{featureType:"poi",elementType:"geometry",stylers:[{visibility:"on"},{color:"#f0e4d3"}]},{featureType:"road.highway",elementType:"geometry.fill",stylers:[{color:"#efe9e4"},{lightness:-25}]}];
var nightTheme = [{"featureType":"all","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"all","elementType":"labels","stylers":[{"visibility":"off"},{"saturation":"-100"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40},{"visibility":"off"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"off"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#4d6059"}]},{"featureType":"landscape","elementType":"geometry.stroke","stylers":[{"color":"#4d6059"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"color":"#4d6059"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"lightness":21}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#4d6059"}]},{"featureType":"poi","elementType":"geometry.stroke","stylers":[{"color":"#4d6059"}]},{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#7f8d89"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#7f8d89"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#7f8d89"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#7f8d89"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#7f8d89"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#7f8d89"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"#7f8d89"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"color":"#7f8d89"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#2b3638"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#2b3638"},{"lightness":17}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#24282b"}]},{"featureType":"water","elementType":"geometry.stroke","stylers":[{"color":"#24282b"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.icon","stylers":[{"visibility":"off"}]}];
var terraTheme = [{"featureType":"landscape","stylers":[{"hue":"#FFBB00"},{"saturation":43.400000000000006},{"lightness":37.599999999999994},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#FFC200"},{"saturation":-61.8},{"lightness":45.599999999999994},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":51.19999999999999},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":52},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#0078FF"},{"saturation":-13.200000000000003},{"lightness":2.4000000000000057},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#00FF6A"},{"saturation":-1.0989010989011234},{"lightness":11.200000000000017},{"gamma":1}]}];
var commandTheme = [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#333739"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#2ecc71"}]},{"featureType":"poi","stylers":[{"color":"#2ecc71"},{"lightness":-7}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#2ecc71"},{"lightness":-28}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#2ecc71"},{"visibility":"on"},{"lightness":-15}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#2ecc71"},{"lightness":-18}]},{"elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#2ecc71"},{"lightness":-34}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#333739"},{"weight":0.8}]},{"featureType":"poi.park","stylers":[{"color":"#2ecc71"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#333739"},{"weight":0.3},{"lightness":10}]}];
var greyTheme = [{"featureType":"administrative","elementType":"all","stylers":[{"saturation":"-100"}]},{"featureType":"administrative.province","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","elementType":"all","stylers":[{"saturation":-100},{"lightness":"50"},{"visibility":"simplified"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":"-100"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"all","stylers":[{"lightness":"30"}]},{"featureType":"road.local","elementType":"all","stylers":[{"lightness":"40"}]},{"featureType":"transit","elementType":"all","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]},{"featureType":"water","elementType":"labels","stylers":[{"lightness":-25},{"saturation":-100}]}];
var retroTheme = [{"featureType":"all","elementType":"all","stylers":[{"saturation":"-17"},{"gamma":"0.36"}]},{"featureType":"all","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"landscape.natural","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"road.local","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"road.local","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"transit","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"color":"#3f518c"}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"simplified"},{"color":"#3b7e9b"},{"lightness":52},{"saturation":"-17"},{"gamma":"0.36"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"}]}];
var secretTheme = [{"featureType":"all","elementType":"all","stylers":[{"color":"#ffffff"},{"visibility":"on"}]},{"featureType":"all","elementType":"geometry.fill","stylers":[{"color":"#d8d8d8"}]},{"featureType":"all","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"all","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"landscape.natural","elementType":"all","stylers":[{"color":"#d4dde2"},{"visibility":"on"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45},{"visibility":"off"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#bfccd4"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#ff0000"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#bfccd4"}]},{"featureType":"water","elementType":"geometry.stroke","stylers":[{"visibility":"on"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"}]}];
var styles = {"Trackr Classic" : defaultTheme, "Night" : nightTheme, "Terra" : terraTheme, "Command" : commandTheme, "Greyscale" : greyTheme, "Retro" : retroTheme, "Top Secret" : secretTheme};

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

function resetMap(boolShowConfirmation){

	if(boolShowConfirmation){
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
	
	else {
		map.setCenter(defaultLocation);
		map.setZoom(10);
		for (var i = 0; i < markers.length; i++) {
			markers[i].setMap(null); 	//removes marker from map
		}
		markers = [];
		circles = [];
		quantityCircles = 0;
		update();						//redraw canvas
	}
	
}


// Map Markers
// ===========


function addMarkerToMap(location, markerTitle, user){
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
		populateInfoWindow(this, infoWindow, user);
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
function populateInfoWindow(marker, infowindow, user) {
    // Check to make sure the infowindow is not already open on this marker.
    if (infowindow.marker != marker) {
		infowindow.marker = marker;
		var content;
		if(user != null){
			//turn twitter URLs into link to full tweet text
			//but TODO: only run first time window is opened
			var tweetLinkPosition = marker.title.lastIndexOf("https://t.co/");
			if (tweetLinkPosition > -1 && marker.title.lastIndexOf("<a href") == -1){
				//var tweetWithLinks = marker.title.replace(/https://t.co//g, "red");
				var tweetWithLink = marker.title.substr(0, tweetLinkPosition) + "<a href='" + marker.title.substr(tweetLinkPosition) + "'>" + marker.title.substr(tweetLinkPosition) + "</a>";	
				marker.title = tweetWithLink;
			}
			content = "<div style='display: flex; align-items: center;'><img src='" + user.profile_image_url_https + "' style='padding-right: 10px;'><span><strong>User: </strong><a href='https://twitter.com/" + user.screen_name + "'>" + user.name + "</a><br><strong>Location: </strong>" + marker.position + "<br><strong>Tweet: </strong>" + marker.title + "</span></div>";
		}
		else{
			content = "<div><span><strong>Location: </strong>" + marker.position + "<br>" + marker.title + "</span></div>"
		}
		infowindow.setContent(content);
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
	//makeGraph();
	//assign click event listeners
	document.getElementById('find_me').addEventListener('click', function() {
		searchUserCurrentLocation();
	});
	document.getElementById('search').addEventListener('click', function() {
		search();
	});
	document.getElementById('reset').addEventListener('click', function() {
		resetMap(true);
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
function updateHistory(relativeURL){
	if(!!(window.history && history.pushState)){	//check browser supports HTML5 History API
		history.pushState('{}', null, './' + relativeURL); 
	}
}

function showErrorPopup(errorMsg){
	document.getElementById('search').setAttribute('data-content', errorMsg);
	$('#search').popover('show');
}

function makeGraph(attribute) {
	
	var data;
	var svgName;
	if(attribute == 'lang'){
		data = langs;
		svgName = "#svg1";
	}
	else if(attribute == 'country'){
		data = countries;
		svgName = "#svg2";
	}
	var svg = d3.select(svgName),
    margin = {top: 20, right: 50, bottom: 70, left: 10},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

	var x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
	var y = d3.scaleLinear().rangeRound([height, 0]);
	x.domain(data.map(function(d) { return d.name; }));
	y.domain([0, d3.max(data, function(d) { return d.count; })]);

	var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	g.append("g")
    	.attr("class", "axis axis--x")
    	.attr("transform", "translate(0," + height + ")")
    	.call(d3.axisBottom(x));
  
	g.append("g")
	    .attr("class", "axis axis--y")
	    .call(d3.axisRight(y).ticks(10).tickSize(width))
	    .append("text")
		.attr("transform", "rotate(-90)")
	    .attr("y", 6)
	    .attr("dy", "0.71em")
	    .attr("text-anchor", "end");

	g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "#777").attr("stroke-dasharray", "2,2");
	
	g.selectAll(".bar")
	    .data(data)
	    .enter().append("rect")
	    .attr("class", "bar")
	    .attr("x", function(d) { return x(d.name); })
	    .attr("y", function(d) { return y(d.count); })
	    .attr("width", x.bandwidth())
	    .attr("height", function(d) { return height - y(d.count); });
	
	var titleText;
	if (svgName == "#svg1"){
		titleText = "Languages";
	}
	else if (svgName == "#svg2") {
		titleText = "Countries";
	}
	
	g.append("text")
    .attr("x", (width / 2))             
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")  
    .style("font-size", "10px") 
    .style("text-decoration", "underline")  
    .text(titleText);
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
		}
		if(document.getElementById('hashtag').value) {
			query.push('hashtag=' + sanitizeUserInput(document.getElementById('hashtag').value));
		}
		if(document.getElementById('until_date').value) {
			query.push('&date=' + document.getElementById('until_date').value);
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
			updateHistory('search/' + query);	//TODO THIS NEEDS FIXING
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


function processJSONResponse(){
	if (this.readyState == 4 && this.status == 200) {	//response OK
		resetResultCount();
		clearGraph();
		resetMap(false);
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
		makeGraph('lang');
	}
}

//Adds marker for tweet if it has coords or a user location. Displays location and tweet text only.
//See https://developer.twitter.com/en/docs/tweets/data-dictionary/overview/tweet-object for details of tweet properties
function processTweet(tweet) {
	var noLocation = true;
	if(tweet.coordinates.coordinates != null){
		var coords = JSON.parse(tweet.coordinates.coordinates); 
		var pos = {
			lat: coords[0],
			lng: coords[1],
		};
		if(Math.round(pos.lat) != -74){	//bizarrely, tweets often erroneously have coords for Antarctica
			addMarkerToMap(new google.maps.LatLng(pos), tweet.text, tweet.user);
			incrementResultCount();
			noLocation = false;
			addToGraph(tweet, 'lang', null);
		}
	}
	//if(noLocation && tweet.place){
		//TODO
	//}
	if(noLocation && tweet.user.location){ 										//if coordinates is null then use user.location (the location they set in their profile)
		addToGraph(tweet, 'lang', null);
		geocodersToReturn += 1;
		geocoder.geocode({'address': tweet.user.location}, function(tweet){		//double anonymous functions to bake tweet data into callback
			return(function(results, status){
				if (status == google.maps.GeocoderStatus.OK) {
					if (results[0]) {
						addMarkerToMap(results[0].geometry.location, tweet.text, tweet.user);
						incrementResultCount();
						update();
						noLocation = false;
						var country = null;
						if(results[0].address_components != null){
							for (var i = 0; i < results[0].address_components.length; i++){
								if (results[0].address_components[i].types[0] == 'country'){
										country = results[0].address_components[i].short_name;
										addToGraph(tweet, 'country', country);
								}
							}
						}
					}
				}
				else{
					console.log(status);
					console.log("Error geocoding JSON user location");
				}
			geocodersToReturn -= 1;
			if(geocodersToReturn <= 0){
				makeGraph('country');
			}
			});
		}(tweet));
	}
	else {
		console.log("Error: tweet contained no coords or user location");
	}
}

function addToGraph(tweet, attribute, country) {
	
	if(attribute == 'lang'){
		if(tweet.lang == null || tweet.lang == 'und' || tweet.lang == 'zxx') {	//language not known
			return;
		}
		var w = -1; //array index
		for(var i=0; i < langs.length; i++){
			if (langs[i].name == tweet.lang){
				w = i;
				langs[i].count += 1;
			}
		}
		if (w == -1){
			langs.push({name: tweet.lang, count: 1});
		}
	}
	
	if(attribute == 'country'){
		var w = -1; //array index
		for(var i=0; i < countries.length; i++){
			if (countries[i].name == country){
				w = i;
				countries[i].count += 1;
			}
		}
		if (w == -1){
			countries.push({name: country, count: 1});
		}
	}
	
	
}

function clearGraph(){
	langs = [];
	countries = [];
	var svg = d3.select("#svg1");
	svg.selectAll("*").remove();
	var svg = d3.select("#svg2");
	svg.selectAll("*").remove();
	geocodersToReturn = 0;
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