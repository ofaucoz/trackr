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
var debugMode = true;	//set this to false to disable hard-coded JSON "response" from "server"

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
	userLocationSet = false;
	resultCount = 0;
	
}

function resize() {
	//CanvasLayer requires this definition
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

//TODO: this should also clear all user input in form fields
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
	
	//TODO: we need to clear all user input in form fields but it's probably best to use HTML5 form reset button
	//document.getElementById('hashtag').value = '';
	//document.getElementById('search_address').value = '';
	//document.getElementById('search_radius').value = ??;
	//document.getElementById('until_date').value = '';
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
	
	return false; //stops link reloading page?
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
			radius = radius.replace(/ /g,''); //remove space
			query.push('radius=' + radius + '&');
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
			if(debugMode){
				console.log("DEBUG MODE, loading hard-coded tweet, not from server");
				console.log("Query is " + query);
				var debugTweets = '{"statuses":[{"coordinates":{"coordinates":[47.070794,15.438391],"type":"Point"},"favorited":false,"truncated":false,"created_at":"Mon Sep 24 03:35:21 +0000 2012","id_str":"250075927172759552","entities":{"urls":[],"hashtags":[{"text":"freebandnames","indices":[20,34]}],"user_mentions":[]},"in_reply_to_user_id_str":null,"contributors":null,"text":"Aggressive Ponytail #freebandnames","metadata":{"iso_language_code":"en","result_type":"recent"},"retweet_count":0,"in_reply_to_status_id_str":null,"id":250075927172759550,"geo":null,"retweeted":false,"in_reply_to_user_id":null,"place":null,"user":{"profile_sidebar_fill_color":"DDEEF6","profile_sidebar_border_color":"C0DEED","profile_background_tile":false,"name":"Sean Cummings","profile_image_url":"http://a0.twimg.com/profile_images/2359746665/1v6zfgqo8g0d3mk7ii5s_normal.jpeg","created_at":"Mon Apr 26 06:01:55 +0000 2010","location":"LA, CA","follow_request_sent":null,"profile_link_color":"0084B4","is_translator":false,"id_str":"137238150","entities":{"url":{"urls":[{"expanded_url":null,"url":"","indices":[0,0]}]},"description":{"urls":[]}},"default_profile":true,"contributors_enabled":false,"favourites_count":0,"url":null,"profile_image_url_https":"https://si0.twimg.com/profile_images/2359746665/1v6zfgqo8g0d3mk7ii5s_normal.jpeg","utc_offset":-28800,"id":137238150,"profile_use_background_image":true,"listed_count":2,"profile_text_color":"333333","lang":"en","followers_count":70,"protected":false,"notifications":null,"profile_background_image_url_https":"https://si0.twimg.com/images/themes/theme1/bg.png","profile_background_color":"C0DEED","verified":false,"geo_enabled":true,"time_zone":"Pacific Time (US & Canada)","description":"Born 330 Live 310","default_profile_image":false,"profile_background_image_url":"http://a0.twimg.com/images/themes/theme1/bg.png","statuses_count":579,"friends_count":110,"following":null,"show_all_inline_media":false,"screen_name":"sean_cummings"},"in_reply_to_screen_name":null,"source":"Twitter for Mac","in_reply_to_status_id":null},{"coordinates":{"coordinates":[47.098387,15.398423],"type":"Point"},"favorited":false,"truncated":false,"created_at":"Fri Sep 21 23:40:54 +0000 2012","id_str":"249292149810667520","entities":{"urls":[],"hashtags":[{"text":"FreeBandNames","indices":[20,34]}],"user_mentions":[]},"in_reply_to_user_id_str":null,"contributors":null,"text":"Thee Namaste Nerdz. #FreeBandNames","metadata":{"iso_language_code":"pl","result_type":"recent"},"retweet_count":0,"in_reply_to_status_id_str":null,"id":249292149810667520,"geo":null,"retweeted":false,"in_reply_to_user_id":null,"place":null,"user":{"profile_sidebar_fill_color":"DDFFCC","profile_sidebar_border_color":"BDDCAD","profile_background_tile":true,"name":"Chaz Martenstein","profile_image_url":"http://a0.twimg.com/profile_images/447958234/Lichtenstein_normal.jpg","created_at":"Tue Apr 07 19:05:07 +0000 2009","location":"Durham, NC","follow_request_sent":null,"profile_link_color":"0084B4","is_translator":false,"id_str":"29516238","entities":{"url":{"urls":[{"expanded_url":null,"url":"http://bullcityrecords.com/wnng/","indices":[0,32]}]},"description":{"urls":[]}},"default_profile":false,"contributors_enabled":false,"favourites_count":8,"url":"http://bullcityrecords.com/wnng/","profile_image_url_https":"https://si0.twimg.com/profile_images/447958234/Lichtenstein_normal.jpg","utc_offset":-18000,"id":29516238,"profile_use_background_image":true,"listed_count":118,"profile_text_color":"333333","lang":"en","followers_count":2052,"protected":false,"notifications":null,"profile_background_image_url_https":"https://si0.twimg.com/profile_background_images/9423277/background_tile.bmp","profile_background_color":"9AE4E8","verified":false,"geo_enabled":false,"time_zone":"Eastern Time (US & Canada)","description":"You will come to Durham, North Carolina. I will sell you some records then, here in Durham, North Carolina. Fun will happen.","default_profile_image":false,"profile_background_image_url":"http://a0.twimg.com/profile_background_images/9423277/background_tile.bmp","statuses_count":7579,"friends_count":348,"following":null,"show_all_inline_media":true,"screen_name":"bullcityrecords"},"in_reply_to_screen_name":null,"source":"web","in_reply_to_status_id":null},{"coordinates":null,"favorited":false,"truncated":false,"created_at":"Fri Sep 21 23:30:20 +0000 2012","id_str":"249289491129438208","entities":{"urls":[],"hashtags":[{"text":"freebandnames","indices":[29,43]}],"user_mentions":[]},"in_reply_to_user_id_str":null,"contributors":null,"text":"Mexican Heaven, Mexican Hell #freebandnames","metadata":{"iso_language_code":"en","result_type":"recent"},"retweet_count":0,"in_reply_to_status_id_str":null,"id":249289491129438200,"geo":null,"retweeted":false,"in_reply_to_user_id":null,"place":null,"user":{"profile_sidebar_fill_color":"99CC33","profile_sidebar_border_color":"829D5E","profile_background_tile":false,"name":"Thomas John Wakeman","profile_image_url":"http://a0.twimg.com/profile_images/2219333930/Froggystyle_normal.png","created_at":"Tue Sep 01 21:21:35 +0000 2009","location":"Andritz Graz ?sterreich","follow_request_sent":null,"profile_link_color":"D02B55","is_translator":false,"id_str":"70789458","entities":{"url":{"urls":[{"expanded_url":null,"url":"","indices":[0,0]}]},"description":{"urls":[]}},"default_profile":false,"contributors_enabled":false,"favourites_count":19,"url":null,"profile_image_url_https":"https://si0.twimg.com/profile_images/2219333930/Froggystyle_normal.png","utc_offset":-18000,"id":70789458,"profile_use_background_image":true,"listed_count":1,"profile_text_color":"3E4415","lang":"en","followers_count":63,"protected":false,"notifications":null,"profile_background_image_url_https":"https://si0.twimg.com/images/themes/theme5/bg.gif","profile_background_color":"352726","verified":false,"geo_enabled":false,"time_zone":"Eastern Time (US & Canada)","description":"Science Fiction Writer, sort of. Likes Superheroes, Mole People, Alt. Timelines.","default_profile_image":false,"profile_background_image_url":"http://a0.twimg.com/images/themes/theme5/bg.gif","statuses_count":1048,"friends_count":63,"following":null,"show_all_inline_media":false,"screen_name":"MonkiesFist"},"in_reply_to_screen_name":null,"source":"web","in_reply_to_status_id":null},{"coordinates":null,"favorited":false,"truncated":false,"created_at":"Fri Sep 21 22:51:18 +0000 2012","id_str":"249279667666817024","entities":{"urls":[],"hashtags":[{"text":"freebandnames","indices":[20,34]}],"user_mentions":[]},"in_reply_to_user_id_str":null,"contributors":null,"text":"The Foolish Mortals #freebandnames","metadata":{"iso_language_code":"en","result_type":"recent"},"retweet_count":0,"in_reply_to_status_id_str":null,"id":249279667666817020,"geo":null,"retweeted":false,"in_reply_to_user_id":null,"place":null,"user":{"profile_sidebar_fill_color":"BFAC83","profile_sidebar_border_color":"615A44","profile_background_tile":true,"name":"Marty Elmer","profile_image_url":"http://a0.twimg.com/profile_images/1629790393/shrinker_2000_trans_normal.png","created_at":"Mon May 04 00:05:00 +0000 2009","location":"Mariatrost Graz","follow_request_sent":null,"profile_link_color":"3B2A26","is_translator":false,"id_str":"37539828","entities":{"url":{"urls":[{"expanded_url":null,"url":"http://www.omnitarian.me","indices":[0,24]}]},"description":{"urls":[]}},"default_profile":false,"contributors_enabled":false,"favourites_count":647,"url":"http://www.omnitarian.me","profile_image_url_https":"https://si0.twimg.com/profile_images/1629790393/shrinker_2000_trans_normal.png","utc_offset":-21600,"id":37539828,"profile_use_background_image":true,"listed_count":52,"profile_text_color":"000000","lang":"en","followers_count":608,"protected":false,"notifications":null,"profile_background_image_url_https":"https://si0.twimg.com/profile_background_images/106455659/rect6056-9.png","profile_background_color":"EEE3C4","verified":false,"geo_enabled":false,"time_zone":"Central Time (US & Canada)","description":"Cartoonist, Illustrator, and T-Shirt connoisseur","default_profile_image":false,"profile_background_image_url":"http://a0.twimg.com/profile_background_images/106455659/rect6056-9.png","statuses_count":3575,"friends_count":249,"following":null,"show_all_inline_media":true,"screen_name":"Omnitarian"},"in_reply_to_screen_name":null,"source":"Twitter for iPhone","in_reply_to_status_id":null}],"search_metadata":{"max_id":250126199840518140,"since_id":24012619984051000,"refresh_url":"?since_id=250126199840518145&q=%23freebandnames&result_type=mixed&include_entities=1","next_results":"?max_id=249279667666817023&q=%23freebandnames&count=4&include_entities=1&result_type=mixed","count":4,"completed_in":0.035,"since_id_str":"24012619984051000","query":"%23freebandnames","max_id_str":"250126199840518145"}}';
				processJSONResponse(debugTweets);
			}
			else {
				var request = new XMLHttpRequest();
				request.onreadystatechange = processJSONResponse;
				request.open('GET', 'http://localhost:8080/trackr/search?' + query, true);
				request.send(null);
				//updateHistory('null', query);	            //TODO: fix HTML5 history usage - this doesn't update page
			}
			
		}
		else{
			console.log("Sorry, your browser doesn't support AJAX - please try a more up-to-date browser!");
			//TODO: alternatives here?
		} 
	}
}


//TODO: sanitizeUserInput for autocomplete too? or does Google's code handle that
function sanitizeUserInput(input) {
	//convert all whitespace chars to single space and remove special characters
	//important for security as we use their input in the URL
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
			console.log("Error retrieving tweets from server");
		}
	}
}

//Adds marker for tweet if it has coords or a user location. Displays location and tweet text only.
//See https://developer.twitter.com/en/docs/tweets/data-dictionary/overview/tweet-object for details of tweet properties
function processTweet(tweet) {
	if(tweet.coordinates){	
		var coords = tweet.coordinates.coordinates;    //this looks bizarre I know but it's right
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

map.setCenter(results[0].geometry.location);
				addMarkerToMap(results[0].geometry.location, results[0].formatted_address); 
				var circleRadius = document.getElementById('search_radius').value;		//defaults to first option (0.01) if none selected
				circles.push({center: results[0].geometry.location, radius: circleRadius});
				update();	//redraw map overlay
*/

























