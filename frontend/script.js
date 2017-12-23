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

/* map themes
=============
awesome default theme by Andrea! */

//TODO: add more styles here
//no need to add to HTML code for extra style, we auto add select options to the HTML with JS
var defaultTheme = [{featureType:"water",stylers:[{color:"#19a0d8"}]},{featureType:"administrative",elementType:"labels.text.stroke",stylers:[{color:"#ffffff"},{weight:6}]},{featureType:"administrative",elementType:"labels.text.fill",stylers:[{color:"#e85113"}]},{featureType:"road.highway",elementType:"geometry.stroke",stylers:[{color:"#efe9e4"},{lightness:-40}]},{featureType:"transit.station",stylers:[{weight:9},{hue:"#e85113"}]},{featureType:"road.highway",elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"water",elementType:"labels.text.stroke",stylers:[{lightness:100}]},{featureType:"water",elementType:"labels.text.fill",stylers:[{lightness:-100}]},{featureType:"poi",elementType:"geometry",stylers:[{visibility:"on"},{color:"#f0e4d3"}]},{featureType:"road.highway",elementType:"geometry.fill",stylers:[{color:"#efe9e4"},{lightness:-25}]}];
var assassinsTheme = [{"featureType":"all","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"all","elementType":"labels","stylers":[{"visibility":"off"},{"saturation":"-100"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40},{"visibility":"off"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"off"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#4d6059"}]},{"featureType":"landscape","elementType":"geometry.stroke","stylers":[{"color":"#4d6059"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"color":"#4d6059"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"lightness":21}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#4d6059"}]},{"featureType":"poi","elementType":"geometry.stroke","stylers":[{"color":"#4d6059"}]},{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#7f8d89"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#7f8d89"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#7f8d89"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#7f8d89"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#7f8d89"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#7f8d89"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"#7f8d89"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"color":"#7f8d89"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#2b3638"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#2b3638"},{"lightness":17}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#24282b"}]},{"featureType":"water","elementType":"geometry.stroke","stylers":[{"color":"#24282b"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.icon","stylers":[{"visibility":"off"}]}];
var styles = {"Trackr Classic" : defaultTheme, "Assassins Creed" : assassinsTheme};

// ==================================

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
	document.getElementById("map_style").innerHTML = Object.keys(styles).map(function(styleName, styleJSON) {
		return '<option value="'+styleName+'">'+styleName+'</option>'; })
	.join('');
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

function updateMapStyle() {
	map.setOptions( { styles: styles[document.getElementById("map_style").value] } );
}

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

var exampleJSONResponse = JSON.parse('{"text" : "lol"}');
var whyDoesThisFail = {"text":"RT @PostGradProblem: In preparation for the NFL lockout, I will be spending twice as much time analyzing my fantasy baseball team during ...","truncated":true,"in_reply_to_user_id":null,"in_reply_to_status_id":null,"favorited":false,"source":"<a href=\"http://twitter.com/\" rel=\"nofollow\">Twitter for iPhone</a>","in_reply_to_screen_name":null,"in_reply_to_status_id_str":null,"id_str":"54691802283900928","entities":{"user_mentions":[{"indices":[3,19],"screen_name":"PostGradProblem","id_str":"271572434","name":"PostGradProblems","id":271572434}],"urls":[],"hashtags":[]},"contributors":null,"retweeted":false,"in_reply_to_user_id_str":null,"place":null,"retweet_count":4,"created_at":"Sun Apr 03 23:48:36 +0000 2011","retweeted_status":{"text":"In preparation for the NFL lockout, I will be spending twice as much time analyzing my fantasy baseball team during company time. #PGP","truncated":false,"in_reply_to_user_id":null,"in_reply_to_status_id":null,"favorited":false,"source":"<a href=\"http://www.hootsuite.com\" rel=\"nofollow\">HootSuite</a>","in_reply_to_screen_name":null,"in_reply_to_status_id_str":null,"id_str":"54640519019642881","entities":{"user_mentions":[],"urls":[],"hashtags":[{"text":"PGP","indices":[130,134]}]},"contributors":null,"retweeted":false,"in_reply_to_user_id_str":null,"place":null,"retweet_count":4,"created_at":"Sun Apr 03 20:24:49 +0000 2011","user":{"notifications":null,"profile_use_background_image":true,"statuses_count":31,"profile_background_color":"C0DEED","followers_count":3066,"profile_image_url":"http://a2.twimg.com/profile_images/1285770264/PGP_normal.jpg","listed_count":6,"profile_background_image_url":"http://a3.twimg.com/a/1301071706/images/themes/theme1/bg.png","description":"","screen_name":"PostGradProblem","default_profile":true,"verified":false,"time_zone":null,"profile_text_color":"333333","is_translator":false,"profile_sidebar_fill_color":"DDEEF6","location":"","id_str":"271572434","default_profile_image":false,"profile_background_tile":false,"lang":"en","friends_count":21,"protected":false,"favourites_count":0,"created_at":"Thu Mar 24 19:45:44 +0000 2011","profile_link_color":"0084B4","name":"PostGradProblems","show_all_inline_media":false,"follow_request_sent":null,"geo_enabled":false,"profile_sidebar_border_color":"C0DEED","url":null,"id":271572434,"contributors_enabled":false,"following":null,"utc_offset":null},"id":54640519019642880,"coordinates":null,"geo":null},"user":{"notifications":null,"profile_use_background_image":true,"statuses_count":351,"profile_background_color":"C0DEED","followers_count":48,"profile_image_url":"http://a1.twimg.com/profile_images/455128973/gCsVUnofNqqyd6tdOGevROvko1_500_normal.jpg","listed_count":0,"profile_background_image_url":"http://a3.twimg.com/a/1300479984/images/themes/theme1/bg.png","description":"watcha doin in my waters?","screen_name":"OldGREG85","default_profile":true,"verified":false,"time_zone":"Hawaii","profile_text_color":"333333","is_translator":false,"profile_sidebar_fill_color":"DDEEF6","location":"Texas","id_str":"80177619","default_profile_image":false,"profile_background_tile":false,"lang":"en","friends_count":81,"protected":false,"favourites_count":0,"created_at":"Tue Oct 06 01:13:17 +0000 2009","profile_link_color":"0084B4","name":"GG","show_all_inline_media":false,"follow_request_sent":null,"geo_enabled":false,"profile_sidebar_border_color":"C0DEED","url":null,"id":80177619,"contributors_enabled":false,"following":null,"utc_offset":-36000},"id":54691802283900930,"coordinates":null,"geo":null};
//whyDoesThisFail = JSON.stringify(whyDoesThisFail);
//var win = JSON.parse(whyDoesThisFail);
//console.log(whyDoesThisFail.text);
//var request = new XMLHttpRequest();
//request.open("GET", "URLgoesHere", true);
//callback:  

//API requests to our server:

//    /hashtag/[hashtagHere]   = just s
//    /hashtag/[hashtagHere]/place/[coordinatesHere] e.g. /place/

//TODO: cache queries maybe? to use another HTML5 featureType
//TODO: semantic markup and ARIA framework
//TODO: use history API to change URL with map searches
//TODO: analysis of data + plotting graphs (maybe use d3.js as covered in the lecture?)


// Twitter example would be GET https://api.twitter.com/1.1/search/tweets.json?q=%23freebandnames&since_id=24012619984051000&max_id=250126199840518145&result_type=mixed&count=4
// but isn't server meant to do that? don't we need to come up with an API to make requests to the server?

//request.send();


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

//when using this function check for failure return value of -1
function processJSONTweet(jsonTweet){
	if(jsonTweet.coordinates){
		addMarkerToMap(jsonTweet.coordinates);
		//TODO: check if these need to be converted
	}
	//if coordinates is null then use user.location (the location they set in their profile)
	else if(jsonTweet.user.location){
		geocoder.geocode({'address': tweet.user.location}, function(results, status) {
			if (status === 'OK') {
				if (results[0]) {
					addMarkerToMap(results[0].geometry.location, results[0].formatted_address);
				}
			}
			else{
				console.log("Error geocoding JSON user location");
				return -1;
			}
		});	
	}
	else {
		console.log("JSON contained no tweet or user location");
		return -1;
	}
	return jsonTweet; //is this necessary? depends what we do after
}

//check browser supports HTML5 History API
if(!!(window.history && history.pushState)){
	
	//history.pushState({}, null, '#/hashtag/searchEntry') //add new history entry and change to that URL without reloading page
	//history.replaceState(state, null, url) //replace current history entry
	//remember these URLs don't exist so user can't refresh page or share URL - need to fix this somehow??
	
}

//TODO: fix links so not using # href: https://stackoverflow.com/questions/134845/which-href-value-should-i-use-for-javascript-links-or-javascriptvoid0?rq=1




