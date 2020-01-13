window.nbcApp = {
	self: this,
	map: {},
	geocoder: {},
	mapMarker: {},
	
	model: {
		problemDetails: "",
		problemStreet: "",
		problemLocation: "",
		objectId: "",
		name: "",
		emailAddress: "",
		phoneNumber: "",
		lat: "",
		lng: "",
		heading: "",
		pitch: "",
		zoom: "",
		problemNumber: "",
		problemDetails: "",
		internal: "",
		interactionId: "",
		userid: "",
		witness: "",
		perpName: "",
		perpAddress: "",
		perpGender: "",
		perpHeight: "",
		perpBuild: "",
		perpHairColour: "",
		perpHairStyle: "",
		perpMarks: "",
		perpAccent: "",
		perpNationality: "",
		perpVehicleReg: "",
		perpVehicleMake: "",
		perpVehicleModel: "",
		perpVehicleColour: "",
		perpVehicleStickers: "",
		perpVehicleMarks: "",
		rdoAlley: "",
		trolley: "",
		trolleyw: "",
		postref: "",
		binref: "",
		usrn: ""
	},
	
	
	addEventListeners: function() {
		var self = this;
		
		// submit the form
		$("#Submit").click(function(e){
			e.preventDefault();
			
			if(self.validateForm()){
				self.submitCase();
			}
		});
		
		/**
		 * search for a street
		 * return the results to html fields
		 * or show an error
		 */
		$(".js-search-street").click(function(e){
			e.preventDefault();
			self.hideErrors();
			
			var streetSearchStr = $("#search-street").val();
			if(nbcApp.Validation.isEmpty(streetSearchStr)){
				$(".js-street-empty").show();
			} else {
				self.searchForStreets(streetSearchStr);
			}
		});
		
		$("#mainForm").delegate("#objectId","change",function(e){
			var $selected = $(this).find("option:selected");
			var street = $selected.text();
			
			$("#problemStreet").val(street);
			
			self.searchGoogleForStreet(street);
		});
		
		$("#mainForm").delegate("#problemNumber","change",function(e){
			if($(this).val() == "Flytip"){
				$(".js-witness").show();
			} else {
				$(".js-witness").hide();
			}
		});
		
		$("#mainForm").delegate(".js-witness select","change",function(e){
			if($(this).val() === "true"){
				$(".js-perp__details").show();
			} else {
				$(".js-perp__details").hide();
			}
		});
		
		$("#mainForm").delegate("#problemNumber","change",function(e){
			if($(this).val() == "abandoned_trolley"){
				$(".js-trolley").show();
				$(".js-trolleyw").show();
			} else {
				$(".js-trolley").hide();
				$(".js-trolleyw").hide();
			}
		});
		
		$("#mainForm").delegate("#problemNumber","change",function(e){
			if($(this).val() == "broken_street_lighting"){
				$(".postref").show();
				
			} else {
				$(".postref").hide();
				
			}
		});
		$("#mainForm").delegate("#problemNumber","change",function(e){
			if($(this).val() == "overflowing_litter_bin"){
				$(".binref").show();
				
			} else {
				$(".binref").hide();
				
			}
		});
		$('#something-else').hide();
		
		//show and hide the form based on if 'Something else' option is selected
		$('#problemNumber').on('change', function(){
			$this_select = $(this);
			if($this_select.val() == 'something-else'){
				$('#something-else').show();
				$(".js-step-2").hide();
				$(".js-step-3").hide();
				$(".js-step-4").hide();
			}else {
				$('#something-else').hide();
				$(".js-step-2").show();
				$(".js-step-3").show();
				$(".js-step-4").show();
				

			}
		});
		
	},
	
	
	
	searchForStreets: function(searchStr) {
		var self = this;
		
		$(".js-street-search-ajax").show();
		$("#address-results").hide();
		
		//make the ajax call
		$.ajax({
			url:"https://api.northampton.digital/vcc/getstreetbyname",
			type:"GET",
			dataType:"JSON",
			data:{
				StreetName: searchStr
				
			},
			
			success: function(data){
				var streetN = data.results[0][1];
				if(data.results.length > 0 ){
					
					$(".js-street-search-ajax").hide();
					self.showPropertyList(data.results);
				} else {
					
					$(".js-street-noresults").show();
					$(".js-street-search-ajax").hide();
				}
			},
			error: function(jqXHR, textStatus, errorThrown){
				console.log(textStatus);
				// show error for no results
				$(".js-street-noresults").show();
				$(".js-street-search-ajax").hide();
			}
		});
	},
	
	showPropertyList: function(results) {
		/**
		 * populate the list
		 * 
		 * show the list
		 */
		var html = '<option value="false">Select</option>';
		var i;
		var len = results.length;
		for(i = 0; i < len; i++) {
			
			var address = "";
				address += results[i][1];
				
			html += '<option value="'+results[0][0]+'">'+address+'</option>';
		}
		
		$("#objectId").html(html);
		$("#address-results").show();
	},
	
	createMap: function() {
		var self = this;
		//find the container and create the map.
		var mapCanvas = document.getElementById("map_canvas");
		var mapCenter = new google.maps.LatLng(52.23740,-0.89463);
		var mapOptions = {
				center: mapCenter,
				zoom: 12,
				scrollwheel:false,
				streetViewControl: false,
				mapTypeId: 'hybrid',
				styles: [
						 {
							 "featureType": "poi",
							 "stylers": [
										 { "visibility": "off" }
										 ]
						 },{
							 "featureType": "administrative",
							 "stylers": [
										 { "visibility": "off" }
										 ]
						 }
						 ]
		};

		var sw = new google.maps.LatLng(52.182353,-0.987396);
		var ne = new google.maps.LatLng(52.30512,-0.780029);
		self.mapBounds = new google.maps.LatLngBounds(sw,ne);

		//set up map objects
		self.geocoder = new google.maps.Geocoder();
		self.map = new google.maps.Map(mapCanvas,mapOptions);
		self.mapMarker = new google.maps.Marker({
			position:  mapCenter,
			map: self.map,
			draggable:true
		});
		
		self.addMarkerListener(self.mapMarker);
	},
	
	//listens for changes to the map marker and updates address to the nearest reverse geocoded address
	addMarkerListener: function(mapMarker) {
		var self = this;
		
		//listen for the marker being dragged
		google.maps.event.addListener(mapMarker, 'dragend', function() {

			var ll = mapMarker.getPosition();
			self.mapBounds.contains(ll) ? lastPosition = ll:[ll=(new google.maps.LatLng(52.23740,-0.89463)),self.mapMarker.setPosition(new google.maps.LatLng(52.23740,-0.89463)),self.map.panTo(ll),window.alert("You have selected a location that is not in the Borouch Council boundaries. Please retry.")];
			//find the address from latlng
			self.geocoder.geocode({'latLng':ll}, function (results, status) {
				console.log(ll);
				if (status == google.maps.GeocoderStatus.OK) {
					if (results[0]){
						// populate form field with google's result
						self.setCurrentLocation(ll,results[0].formatted_address);
					}
				}
				else {
					if (status = "ZERP_RESULTS"){
						alert("Please enter a valid address");
					}
					else {
						alert("Geocode was not successful for the following reason: " + status);
					}
				}
			});

		});
	},
	
	searchGoogleForStreet: function(searchStr) {
		var self = this;
		if(searchStr.toLowerCase()=='ringway, northampton'){
			searchStr='Ring Way, Northampton';
		}
		$.ajax({
			url:"https://api.northampton.digital/vcc/getstreetbyname",
			type:"GET",
			dataType:"JSON",
			data:{streetName: searchStr},
			success: function(data)
			{
				
				if(data.results.length > 0 ) {
				 ourLat = data.results[0][2];
				 ourLong = data.results[0][3];
				 ourLatLong =  new google.maps.LatLng(ourLat, ourLong);
				
				console.log(ourLatLong);
				searchStr = searchStr + " Northampton, UK";
				address = searchStr;
				console.log(searchStr);}
				if (ourLatLong !=null){
					self.setCurrentLocation(ourLatLong,address);
					self.updateMarker(ourLatLong);
				}
				/*self.geocoder.geocode( { 'location': ourLatLong, 'bounds':self.mapBounds}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK && results[0]) {
						// move map marker, populate lat/lng
						self.setCurrentLocation(ourLatLong);
						self.updateMarker(ourLatLong);
					}
					else {
						if(status = "ZERP_RESULTS"){
							
						}
						else{
							alert("Geocode was not successful for the following reason: " + status);
						}
					}
				});*/
				
			},
			error: function(jqXHR, textStatus, errorThrown){}
		});
		
	},
	
	setCurrentLocation: function(ll,address) {
		$("#lat").val(ll.lat);
		$("#lng").val(ll.lng);
		$("#problemLocation").val(address);
	},
	
	updateMarker: function(ourLatLong) {
		this.mapMarker.setPosition(ourLatLong);
		this.map.setZoom(18);
		this.map.panTo(this.mapMarker.getPosition());
	},
	
	validateForm: function() {
		var valid  = true;

		this.hideErrors();
		this.updateModel();
		
		if(this.model.problemNumber === "false") {
			valid = false;
			$(".js-type-error").show();
		}
		
		if(this.model.objectId.length <= 0 || this.model.problemStreet.length <= 0) {
			valid = false;
			$(".js-objectId-empty").show();
			$(".js-street-empty").show();
		}
		
		if(this.model.lat.length <= 0 || this.model.lng.length <= 0 || this.model.problemLocation.length <= 0) {
			valid = false;
			$(".js-map-error").show();
		}
		
		if(this.Validation.isEmpty(this.model.name)) {
			valid = false;
			$(".js-name").show();
		}
		
		if(this.Validation.isEmpty(this.model.problemDetails)) {
			valid = false;
			$(".js-details").show();
		}

		return valid;
	},

	updateModel: function() {
		// push all values from the form into the model
		for(prop in this.model) {
			var $obj = $("#"+prop);

			if($obj.attr("type") === "checkbox") {
				if($obj.attr("checked")){
					this.model[prop] = true;
				} else {
					this.model[prop] = false;
				}
			} else {
				this.model[prop] = $obj.val() ? $obj.val() : "";
			}
		}
		
		// set the interaction id
		var interaction = nbcApp.Utils.getParameterByName("interactionId");
		this.model.interactionId = (interaction) ? interaction : "";
		
		// set the interaction id
		var usrn = nbcApp.Utils.getParameterByName("usrn");
		this.model.usrn = (usrn) ? usrn : "";
		
		var userId = nbcApp.Utils.getParameterByName("userId");
		this.model.userid = (userId) ? userId : "";
	},
	
	populateFieldsFromUrl: function() {
		
		// set name
		var name = nbcApp.Utils.getParameterByName("name");
		if(name.length > 0) {
			$("#name").val(name);
		}
		
		// set email
		var email = nbcApp.Utils.getParameterByName("email");
		if(email.length > 0) {
			$("#emailAddress").val(email);
		}
		
		// set telephone
		var tel = nbcApp.Utils.getParameterByName("tel");
		if(tel.length > 0) {
			$("#phoneNumber").val(tel);
		}
		
		// set street and search
		var street = nbcApp.Utils.getParameterByName("street");
		if(street.length > 0) {
			$("#search-street").val(street);
			$(".js-search-street").trigger("click");
		}
		
		// set the interaction id
		var interaction = nbcApp.Utils.getParameterByName("interactionId");
		this.model.interactionId = (interaction) ? interaction : "";
		
		// set the usrn
		var usrn = nbcApp.Utils.getParameterByName("usrn");
		this.model.usrn = (usrn) ? usrn : "";
		
		var userId = nbcApp.Utils.getParameterByName("userId");
		this.model.userid = (userId) ? userId : "";
		
		
	},
	
	hideErrors: function() {
		$(".error").hide();
	},

	hideFields: function() {
		$(".js-perp__details").hide();
		$("#address-results").hide();
		this.hideErrors();
	},
	//handles the ajax call to the server
	submitCase: function() {
		var testwindow = window.location.href;
		if (testwindow.includes("test")){
			var url = "https://mycouncil-test.northampton.digital/CreateCall"}
			else {url = "https://mycouncil.northampton.digital/CreateCall"}
		var self = this;
		//show a 'sending' message while call is progressing and hide the main form
		$(window).scrollTop($("content").scrollTop());
		$("#mainForm").hide();
		$(".js-ajax-wait").show();
		
		//make the ajax call
		$.ajax({
			url:url,
			type:"POST",
			dataType:"JSON",
			data: self.model,
			success: function(data){
				self.handleSuccess(data);
			},
			error: function(jqXHR, textStatus, errorThrown){
				self.handleError(alert(errorThrown));
			}
		});
	},
	
	//handle a successful form submit
	handleSuccess: function(data) {
		this.showSuccess(data.callNumber,data.slaDate);
	},

	//handle a failed form submit
	handleError: function() {
		$("#mainForm").show();
		$(".js-ajax-wait").hide();
		$(".js-confirmation").hide();
	},

	//show the confirmation details
	showSuccess: function(caseRef,date) {
		$(".js-case-ref").html(caseRef);
		
		var output = "";
		
//			if(this.model.rdoAlley == 'Yes') {
//				output +="<p>We will be investigating within</p>";
//				output += "<span>5 working days</span>";
//			} else {
			output +="<p>We will aim to resolve this </p>";
			if(date === "not available"){
				output += "<span>asap</span>";
			}else{
				output +="<span class ='caseDate'>"+date+"</span>";
			}
//			}


		$(".js-case-sla").html(output);
		$(".js-ajax-wait").hide();
		$(".js-confirmation").show();
		$(window).scrollTop($("#mainForm").scrollTop());
	},

	init: function() {
		this.hideFields(); // hide errors and form sections
		this.addEventListeners(); // add listeners to interactions
		this.populateFieldsFromUrl(); // populate any url parameters into fields
		this.createMap();
	}

}



/*--------------------------------*/
/* Utility Functions--------------*/
/*--------------------------------*/
nbcApp.Utils = {};

/**
* Parameters {String } name of the parameter
* Returns {String} a decoded value string
*/
nbcApp.Utils.getParameterByName = function(name) {
name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
results = regex.exec(location.search);
return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

/**
* Parameters {String } post code e.g NN1 1DE
* Returns {JSON Object} a list of properties
*/
nbcApp.Utils.getPropertyList = function(pc){
var url = "GetPropertyListUprn?postCode="+pc+"&callback=?";
return $.ajax({
	url: url,
	dataType:"JSONP"
});
};

/**
* Parameters {Array} and array of property objects
* Returns {String} an html string for populating a select box
*/
nbcApp.Utils.getOptionListFromProperties = function(propArr){
var html = '<option value="false">Select</option>';
for(var x = 0; x < propArr.length; x++) {
	html += '<option value="'+propArr[x].uprn+'">'+propArr[x].addressNumber+' '+propArr[x].streetName+'</option>';
}
return html;
};

/**
* Parameters {String } post code e.g NN1 1DE
* Returns {JSON Object} a list of properties
*/
nbcApp.Utils.searchForProperties = function(pc,callback, context){
$deferred = nbcApp.Utils.getPropertyList(pc);

$deferred.done(function(data){
	callback.apply(context,[data]);
});

$deferred.fail(function(data){
	callback.apply(context,[data]);
});
};

/*--------------------------------*/
/* Pub Sub -----------------------*/
/*--------------------------------*/
nbcApp.Events = (function(){
var topics = {};

return {
	subscribe: function(topic, listener) {
		// create the topic if it doesn't exist
		if(!topics[topic]) {
			topics[topic] = { queue: [] };
		}

		// add the listener to the queue
		var index = topics[topic].queue.push(listener) -1;

		// Provide handle back for the removal of the topic
		return (function(topic, index){
			return {
				remove: function() {
					delete topics[topic].queue[index];
				}
			}
		})();

	},
	publish: function(topic, info) {
		// if there's no topic or no subscription, don't do anything
		if(!topics[topic] || !topics[topic].queue.length) {
			return;
		}

		// cycle through the topics queue and fire
		var items = topics[topic].queue;

		items.forEach(function(item){
			item(info||{});
		});

	}
}
})();

/*--------------------------------*/
/* Validation --------------------*/
/*--------------------------------*/
nbcApp.Validation = {
	isValidPhoneNumber: function(str) {
		// Convert into a string and check that we were provided with something
		var telnum = str + " ";
		if (telnum.length == 1)  {
			return false;
		}
		
		if (telnum.length == 7)  {
			telnum='01604'+telnum;
		}
		
		telnum.length = telnum.length - 1;

		// Don't allow country codes to be included (assumes a leading "+")
		var exp = /^(\+)[\s]*(.*)$/;
		if (exp.test(telnum) == true) {
			return false;
		}

		// Remove spaces from the telephone number to help validation
		while (telnum.indexOf(" ")!= -1)  {
			telnum = telnum.slice (0,telnum.indexOf(" ")) + telnum.slice (telnum.indexOf(" ")+1);
		}

		// Remove hyphens from the telephone number to help validation
		while (telnum.indexOf("-")!= -1)  {
			telnum = telnum.slice (0,telnum.indexOf("-")) + telnum.slice (telnum.indexOf("-")+1);
		}  

		// Now check that all the characters are digits
		exp = /^[0-9]{10,11}$/;
		if (exp.test(telnum) != true) {
			return false;
		}

		// Now check that the first digit is 0
		exp = /^0[0-9]{9,10}$/;
		if (exp.test(telnum) != true) {
			return false;
		}

		// Disallow numbers allocated for dramas.

		// Array holds the regular expressions for the drama telephone numbers
		var tnexp = new Array ();
		tnexp.push (/^(0113|0114|0115|0116|0117|0118|0121|0131|0141|0151|0161)(4960)[0-9]{3}$/);
		tnexp.push (/^02079460[0-9]{3}$/);
		tnexp.push (/^01914980[0-9]{3}$/);
		tnexp.push (/^02890180[0-9]{3}$/);
		tnexp.push (/^02920180[0-9]{3}$/);
		tnexp.push (/^01632960[0-9]{3}$/);
		tnexp.push (/^07700900[0-9]{3}$/);
		tnexp.push (/^08081570[0-9]{3}$/);
		tnexp.push (/^09098790[0-9]{3}$/);
		tnexp.push (/^03069990[0-9]{3}$/);

		for (var i=0; i<tnexp.length; i++) {
			if ( tnexp[i].test(telnum) ) {
				return false;
			}
		}

		// Finally check that the telephone number is appropriate.
		exp = (/^(01|02|03|05|070|071|072|073|074|075|07624|077|078|079)[0-9]+$/);
		if (exp.test(telnum) != true) {
			return false;
		}

		// Telephone number seems to be valid - return the stripped telehone number  
		return true;
	},
	
	isValidEmailAddress: function(str) {
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return (str.length > 0 &&  re.test(str)) ? true : false;
	},

	isEmpty: function(s) {
		return ((s == null) || (s.length == 0));
	},
	
	/**
	 * @param str
	 * @returns {Boolean}
	 */
	isValidPostCode: function(str) {
		var regEx = /[n  N][n N][0-5][0-9][a-z A-Z][a-z A-Z]$/;
		
		str = str.replace(" ","");
		if(regEx.test(str)) {
			return true;
		}
		
		return false;
	}
};

nbcApp.init();







//(function ($){
//
//	var nbcApp = nbcApp || {models: {}};
//
//
//	nbcApp.models.ES = function(){
//		var self = this,
//		geocoder,
//		map,
//		mapCanvas,
//		mapOptions,
//		mapCenter,
//		mapMarker,
//		mapBounds,
//		lat,
//		lng,
//		heading = 0,
//		pitch = 0,
//		zoom = 0,
//		problemStreet = "",
//		problemLocation = "",
//		addressSearch = false,
//		$errors = $('.error'),
//		$problemAddress = $("#Address"),
//		$addressSelect = $("#address-results"),
//		$problemDetails = $("#Incident"),
//		$problemName = $("#Name"),
//		$problemEmail = $("#Email"),
//		$problemPhone = $("#Tel"),
//		$problemNumber = $("#Type"),
//		$alleyway = $("#rdoAlley"),
//		$receiptOptions = $('.receipt-options'),
//		$receiptCheck = $('.receipt-required'),
//		$confirmation = $("#confirmation"),
//		$witness = $(".js-witness"),
//		$perpDetails = $(".js-perp__details");
//
//		this.init = function() {
//			var self = this;
//			//set up the form defaults
//			$errors.hide();
//			$addressSelect.hide();
//			this.toggleWitnessOption();
//			this.togglePerpDetails(false);
//
//			// pre populate fields from the url
//			$problemName.val(getParameterByName("name"));
//			$problemPhone.val(getParameterByName("tel"));
//			$problemEmail.val(getParameterByName("email"));
//			if(getParameterByName("address")){
//				addressSearch = true;
//				$problemAddress.val(getParameterByName("address"));
//			}
//
//
//			self.createMap();
//
//			//address search button listener
//			$('#searchButton').on('click', function(e) {
//				e.preventDefault();
//				self.searchForStreet();
//				//self.focusMap();
//			});
//
//			//address search button listener
//			$problemNumber.on('change', function(e) {
//				e.preventDefault();
//				self.toggleWitnessOption();
//				//self.focusMap();
//			});
//
//			$witness.delegate('select','change', function(e) {
//				if(this.value === "true"){
//					self.togglePerpDetails(true);
//				} else {
//					self.togglePerpDetails(false);
//				}
//			});
//
//			//submit button listener
//			$('#Submit').on('click', function(e) {
//				e.preventDefault();
//				$errors.hide();
//				var error = false;
//				
//				if($problemNumber.val() === "false") {
//					$(".js-type-error").show();
//					error = true;
//				}
//
//				// if name is empty, error
//				if(!$problemName.val()){
//					$(".js-name").show();
//					error = true;
//				}
//
//				// if email and phone are missing, error
//				if(!$problemEmail.val() && !$problemPhone.val()){
//					$(".js-email-or-tel").show();
//					error = true;
//				}
//
//				//if email isn't valid, return false
//				if (!self.emailCheck($problemEmail.val())){
//					$(".email").show();
//					error = true;
//				}
//
//				//if tel isn't valid, return false
//				if (!self.telephoneCheck($problemPhone.val())){
//					$(".phone").show();
//					error = true;
//				}
//
//				if (!self.addressCheck(problemLocation)){
//					self.showLocationError();
//					error = true;
//				}
//
//				if(!self.checkLocationBounds(mapMarker.getPosition())){
//					self.showLocationError();
//					$(".map-error").show();
//					error = true;
//				}
//
//				if(error){
//					return false;
//				}
//				$(window).scrollTop($("#mainForm").scrollTop());
//				$errors.hide();
//				self.submitCase();
//			});
//
//			//center the map to the marker position when resized (for orientation changes)
//			$(window).on('resize', function() {
//				map.setCenter(mapMarker.getPosition());
//			});
//		};
//
//		// if the problem type is 0-5 (flytipping options) then show the witness option
//		this.toggleWitnessOption = function() {
//			if($problemNumber.val() <= 5) {
//				$witness.show();
//			} else {
//				$witness.hide();
//			}
//		};
//
//		// if the problem type is 0-5 (flytipping options) then show the witness option
//		this.togglePerpDetails = function(show) {
//			if(show) {
//				$perpDetails.show();
//			} else {
//				$perpDetails.hide();
//			}
//		};
//
//		//shows an error if the location selected is invalid
//		this.showLocationError = function (){
//			$(".location").show();
//			$(window).scrollTop($(".location").scrollTop());
//		};
//
//		this.hideLocationError = function (){
//			$(".location").hide();
//		};
//
//		//changes the opacity of the map on focus
////		this.focusMap = function() {
////		$(mapCanvas).addClass('opaque');
////		};
//
//		//sets up the global objects and listeners for the map
//		this.createMap = function() {
//			//find the container and create the map.
//			mapCanvas = document.getElementById("map_canvas");
//			mapCenter = new google.maps.LatLng(52.23740,-0.89463);
//			mapOptions = {
//					center: mapCenter,
//					zoom: 12,
//					scrollwheel:false,
//					streetViewControl: false,
//					mapTypeId: google.maps.MapTypeId.ROADMAP,
//					styles: [
//					         {
//					        	 "featureType": "poi",
//					        	 "stylers": [
//					        	             { "visibility": "off" }
//					        	             ]
//					         },{
//					        	 "featureType": "administrative",
//					        	 "stylers": [
//					        	             { "visibility": "off" }
//					        	             ]
//					         }
//					         ]
//			};
//
//			var sw = new google.maps.LatLng(52.182353,-0.987396);
//			var ne = new google.maps.LatLng(52.30512,-0.780029);
//			mapBounds = new google.maps.LatLngBounds(sw,ne);
//
//			//set up map objects
//			geocoder = new google.maps.Geocoder();
//			map = new google.maps.Map(mapCanvas,mapOptions);
//			mapMarker = new google.maps.Marker({
//				position:  mapCenter,
//				map: map,
//				draggable:true
//			});
//			self.addMarkerListener();
//
//			if(addressSearch) {
//				self.searchForAddress();
//			}
//
//		};
//
//		//checks if the given latLng is within the map bounds
//		this.checkLocationBounds = function(latlng) {
//			return (mapBounds.contains(latlng)) ? true : false;
//		};
//
//		//listens for changes to the map marker and updates address to the nearest reverse geocoded address
//		this.addMarkerListener = function() {
//
//			//listen for the marker being dragged
//			google.maps.event.addListener(mapMarker, 'dragend', function() {
//
//				var ll = mapMarker.getPosition();
//				self.updateMarker(ll);
//
//				//find the address from latlng
//				geocoder.geocode({'latLng':ll}, function (results, status) {
//					if (status == google.maps.GeocoderStatus.OK) {
//						if (results[0]){
//							//$addressSelect.hide();
//							
//							// check if the street of the returned value is the same as the street
//							self.setNewAddress(results,false,0);
//						}
//					}
//					else {
//						if (status = "ZERP_RESULTS"){
//							alert("Please enter a valid address");
//						}
//						else {
//							alert("Geocode was not successful for the following reason: " + status);
//						}
//					}
//				});
//
//			});
//
//			/*google.maps.event.addListener(mapMarker, 'dragstart', function() {
//				self.focusMap();
//			});*/
//		};
//
//		//returns a list of geocoded addresses based on a search
//		this.searchForStreet = function() {
//			self.hideLocationError();
//			$('#address-results').hide();
//			var streetStr = $problemAddress.val();
//			
//			//make the ajax call
//			$.ajax({
//				url:"StreetSearch",
//				type:"GET",
//				dataType:"JSON",
//				data:{
//					street: streetStr
//				},
//				success: function(data){
//					console.log(data);
//					
//					if(data.success) {
//						self.showPropertyList(data.results);
//					}
//				},
//				error: function(jqXHR, textStatus, errorThrown){
//					// show error for no results
//				}
//			});
//		};
//		
//		this.searchGoogle = function(street) {
//			geocoder.geocode( { 'address': street, 'bounds':mapBounds}, function(results, status) {
//				if (status == google.maps.GeocoderStatus.OK) {
//					// move map marker, populate lat/lng
//					self.setNewAddress(results,true);
//				}
//				else {
//					if(status = "ZERP_RESULTS"){
//						self.showLocationError();
//					}
//					else{
//						alert("Geocode was not successful for the following reason: " + status);
//					}
//				}
//			});
//		};
//
//		//updates the map marker given a latLng object
//		this.updateMarker = function (latLng) {
//			lat = latLng.lat();
//			lng = latLng.lng();
//			mapMarker.setPosition(latLng);
//			map.setZoom(15);
//			map.panTo(mapMarker.getPosition());
//		};
//
//		//sets the newly selected address and optionally updates the map marker
//		this.setNewAddress = function(results, updateMarker, index) {
//			var i = index | 0;
//			//if the location is within the map bounds, set it
//			if(self.checkLocationBounds(results[i].geometry.location)){
//				problemLocation = results[i].formatted_address;
//				if($problemAddress.val().toLowerCase().indexOf("nn")!=-1){
//					new google.maps.StreetViewService().getPanoramaByLocation(results[i].geometry.location, 50, function(data, status) {
//						problemLocation = data.location.description;
//						if(problemLocation=='Chi-Heng Ng'){
//							problemLocation="St Giles' Square";
//						}
//						//$problemAddress.val(problemLocation);
//					});
//				}else{
//					//$problemAddress.val(problemLocation);
//				}
//				problemStreet = results[i].address_components[1].long_name;
//				//$problemAddress.val(problemLocation);
//
//				if (updateMarker){
//					//update marker and lat/lng
//					self.updateMarker(results[i].geometry.location);
//				}
//			}
//			else {
//				self.showLocationError();
//			}
//		};
//
//		//shows a list of properties within the bounds, or an error if none exist
//		this.showPropertyList = function (list) {
//
//			//set up a drop down show and return for multiple results
//			var $addressCont = $('#address-results').hide(),
//			$addressList = $('#address-list');
//
//			if(list.length > 0) {
//			var output = "<option>Select</option>";
//				for(var x = 0; x < list.length; x++){
//					
//					var street = list[x].streetName;
//					
//					if(list[x].area.length > 1) {
//						street += ", " + list[x].area;
//					}
//					if(list[x].town.length > 1) {
//						street += ", " + list[x].town;
//					}
//					output += '<option value="'+list[x].objectId+'">' + street + '</option>';
//				}
//
//				$addressList.on('change',function(e) {
//					var street = $(this).find("option[value='"+this.value+"']").text();
//					//send the results, force marker update and specify the property index
//					self.searchGoogle(street + ", UK");
//					$problemAddress.val(street);
//				});
//
//				$addressList.html(output);
//				$addressCont.show();
//			}
//			//otherwise show a location error
//			else {
//				self.showLocationError();
//			}
//
//		};
//
//		//filters an array of geocoder results to only return properties within the bounds
//		this.getPropertiesInBounds = function (list) {
//			var inBoundsArray = [];
//			for(var x = 0; x < list.length; x+=1){
//				if(self.checkLocationBounds(list[x].geometry.location)){
//					inBoundsArray.push(list[x]);
//				}
//			}
//
//			return (inBoundsArray.length > 0) ? inBoundsArray : false;
//		};
//
//		//handles the ajax call to the server
//		this.submitCase = function() {
//
//			//show a 'sending' message while call is progressing and hide the main form
//			var sendingText = '<div class="loading"><img src="images/loading.gif" alt="loading" title="loading"><span>Sending</span></div>';
//			$confirmation.html(sendingText);
//			$("#mainForm").hide();
//
//			var model = {
//					problemDetails:$problemDetails.val(),
//					problemStreet:problemLocation.substring(0,problemLocation.indexOf(', Northampton')),
//					problemLocation:$problemAddress.val(),
//					objectId : $addressSelect.find("select").val(),
//					name:$problemName.val(),
//					emailAddress:$problemEmail.val(),
//					phoneNumber:$problemPhone.val(),
//					lat:lat,
//					lng:lng,
//					heading:heading,
//					pitch:pitch,
//					zoom:zoom,
//					problemNumber:$problemNumber.val(),
//					internal : getParameterByName("internal"),
//					interactionId : getParameterByName("interactionId"),
//					userid : getParameterByName("user"),
//					witness: $witness.find("select").val(),
//					perpName : $perpDetails.find("#perp-name").val(),
//					perpAddress : $perpDetails.find("#perp-address").val(),
//					perpGender: $perpDetails.find("#perp-gender").val(),
//					perpHeight : $perpDetails.find("#perp-height").val(),
//					perpBuild : $perpDetails.find("#perp-build").val(),
//					perpHairColour : $perpDetails.find("#perp-hair-colour").val(),
//					perpHairStyle: $perpDetails.find("#perp-hair-style").val(),
//					perpMarks : $perpDetails.find("#perp-distinctive-marks").val(),
//					perpAccent : $perpDetails.find("#perp-accent").val(),
//					perpNationality: $perpDetails.find("#perp-percieved-nationality").val(),
//					perpVehicleReg : $perpDetails.find("#perp-vehicle-registration-number").val(),
//					perpVehicleMake : $perpDetails.find("#perp-vehicle-make").val(),
//					perpVehicleModel : $perpDetails.find("#perp-vehicle-model").val(),
//					perpVehicleColour : $perpDetails.find("#perp-vehicle-colour").val(),
//					perpVehicleStickers : $perpDetails.find("#perp-vehicle-stickers").val(),
//					perpVehicleMarks : $perpDetails.find("#perp-vehicle-other-marks").val(),
//					rdoAlley : $alleyway.val()
//				};
//			
//			console.log(model); 
//			
//			//make the ajax call
//			$.ajax({
//				url:"CreateCall",
//				type:"POST",
//				dataType:"JSON",
//				data: model,
//				success: function(data){
//					self.handleSuccess(data);
//				},
//				error: function(jqXHR, textStatus, errorThrown){
//					self.handleError();
//				}
//			});
//		};
//
//		function getParameterByName(name) {
//			name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
//			var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
//			results = regex.exec(location.search);
//			return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
//		}
//
//		//validate address
//		this.addressCheck = function(address) {
//			return (address) ? true : false;
//		};
//		//validate email
//		this.emailCheck = function(email) {
//			var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
//			return (emailReg.test(email) || email === "") ? true : false;
//		};
//
//		//validate tel
//		this.telephoneCheck = function(tel) {
//			var regEx = /^[0-9]{6,}$/,
//			tel = tel.replace(/ /g,'');
//			return (regEx.test(tel) || tel === "") ? true : false;
//		};
//		//handle a successful form submit
//		this.handleSuccess = function(data) {
//			self.showSuccess(data.callNumber,data.slaDate);
//		};
//
//		//handle a failed form submit
//		this.handleError = function() {
//			//console.log("error");
//		};
//
//		//show the confirmation details
//		this.showSuccess = function(caseRef,date) {
//			var output ="<p>Your case reference number is</p>";
//			output +="<span class ='caseRef'>"+caseRef+"</span>";
//			
//			if($alleyway.val() == 'Yes') {
//				output +="<p>We will be investigating within</p>";
//				output += "<span>5 working days</span>";
//			} else {
//				output +="<p>We will aim to resolve this </p>";
//				if(date === "not available"){
//					output += "<span>asap</span>";
//				}else{
//					output +="<span class ='caseDate'>"+date+"</span>";
//				}
//			}
//
//
//			$confirmation.html(output);
//		};
//
//		//end of ES object
//	};
//
//	var esForm = new nbcApp.models.ES();
//	esForm.init();
//
//})(jQuery);
