window.nbcApp = {
		self: this,
		model: {
			txtPostCode: "",
			uprn: ""
		},

		properties: [],

		findSteps: function() {
			this.step1 = $(".js-step-1");
			this.step2 = $(".js-step-2");
			this.step3 = $(".js-step-3");
		},

		addEventListeners: function() {
			
			var self = this;
			/**
			 * Set delegated event listeners
			 */
			$("#mainForm").delegate(".js-submit","click",function(e){
				e.preventDefault();

				if(self.validateForm()) {
					self.submit();
				}
			});
			

			$('#mainForm').delegate(".js-find-address",'click',function(e){
				e.preventDefault();
				self.updateModel();
				var validPc = nbcApp.Validation.isValidPostCode(self.model.txtPostCode);
				if(!nbcApp.Validation.isEmpty(self.model.txtPostCode)){
					self.hideErrors();
					if(validPc){
					console.log("I love this pc")
						$("#ajax-wait").show();
						self.step1.hide();
						self.step2.hide();
						self.step3.hide();
						nbcApp.Utils.searchForProperties(self.model.txtPostCode, self.populateProperties, self);
					} else {
						console.log("Error dont like the pc");
						self.step1.show();
						self.step2.hide();
						self.step3.hide();
						$(".js-postcode-invalid").show();
					}
				} else {
						console.log("Really dont like pc");
					$(".js-postcode-invalid").show();
				}

			});
			
			$('#mainForm').delegate("#findIt",'click',function(e){
				e.preventDefault();
				
				self.updateModel();
				
				if(self.model.uprn) {
					self.getPollingStationsFromUprn(uprn);
				} else {
					//show poll station error
					alert('Please select a property');
				}
				
			});
			
			
		},
		
		getPollingStationsFromUprn: function() {
			var self = this;
			
			$("#ajax-wait").show();
			self.step1.hide();
			self.step2.hide();
			self.step3.hide();
			
			$.ajax({
				url: "PollStationFinder",
				data: self.model,
				type: "GET",
				success:function(data) {
					$("#ajax-wait").hide();

					
					if(data.success === "true") {
						self.populateResult(data);
						self.step1.hide();
						self.step2.hide();
						self.step3.show();

						self.consoleLogErrorsDebug('PollStationFinder success true ajax request', data,null,null,null);

					} else {
						self.consoleLogErrorsDebug('PollStationFinder failure true ajax request', data,null,null,null);

						
						self.step1.show();
						self.step2.hide();
						self.step3.hide();
					}
				},
				error: function(e, xhr, obj) {
					self.step1.show();
					self.step2.hide();
					self.step3.hide();
					
					self.consoleLogErrorsDebug('PollStationFinder url ajax request', null,e,xhr,obj);
					
				}
			});
		},
		
		populateResult: function(data) {
			
			var html = '';
			
			for(var x = 0; x < data.pollStations.length; x++ ){
				
				html += 'Your '+data.pollStations[x].type+' polling station is:';
				html += '<p class="redHighlight">' + data.pollStations[x].name + '</p>';
				html += data.pollStations[x].address;
				html += '<p>&nbsp;</p>';
				html += '<p><a target="_blank" href="http://maps.google.co.uk?q='+data.pollStations[x].lat+','+data.pollStations[x].lng+'"><img src="https://maps.googleapis.com/maps/api/staticmap?center='+data.pollStations[x].lat+','+data.pollStations[x].lng+'&zoom=15&size=200x200&markers=color:red%7Clabel:A%7C'+data.pollStations[x].lat+','+data.pollStations[x].lng+'"></a></p>';
				html += '<p>&nbsp;</p>';
			}
			
			$('.js-step-3').html(html);
		},

		// shows and hides a given element(s) by its selector
		toggleField: function(sel,show) {
			var $s = $(sel);
			if(show) {
				$s.show();
			} else {
				$s.hide();
			}
		},

		hideErrors: function() {
			$(".error").hide();
		},

		hideFields: function() {
			this.hideErrors();
		},

		consoleLogErrorsDebug: function(request_name, data, e, xhr, obj){
			console.log('error for');
			console.log(request_name);
			console.log('data');
			console.log(data);
			console.log('e');
			console.log(e);
			console.log('xhr');
			console.log(xhr);	
			console.log('obj');
			console.log(obj);	
		},
		
		populateProperties: function(data) {
			$("#ajax-wait").hide();

			if(/*data.success === "true" &&*/ data.results.length > 0){
				this.properties = data.results;
				var options = nbcApp.Utils.getOptionListFromProperties(data.results);
				$("#uprn").html(options);
				this.toggleField(".js-details", true);
				this.toggleField(".js-details-postcode", false);
				this.step1.hide();
				this.step2.show();
				this.step3.hide();
			} else {
				this.step1.show();
				$(".js-postcode-invalid").show();
				this.step2.hide();
				this.step3.hide();
			}
		},

		showPostCodeError: function(num) {
			this.hideErrors();
			$(".js-postcode-invalid").show();
		},

		validateForm: function() {
			var valid  = true;

			this.hideErrors();
			this.updateModel();

			if(this.Validation.isEmpty(this.model.txtPostCode)) {
				valid = false;
				$(".js-postcode-missing").show();
			}

			if(this.Validation.isEmpty(this.model.uprn) || this.model.uprn == "false") {
				valid = false;
				$(".js-address-not-selected").show();
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
					this.model[prop] = $obj.val();
				}
			}
		},

		submit: function() {
			this.step1.hide();
			this.step2.show();
			this.step3.hide();
			$(window).scrollTop(this.step2.scrollTop());
			this.createCase();
		},

		populateFieldsFromUrl: function() {

			// set post code and search
			var postcode = nbcApp.Utils.getParameterByName("postcode");
			if(postcode.length > 0) {
				$("#txtPostCode").val(postcode);
				$(".js-find-address").trigger("click");
			}


		},

		init: function() {
			this.hideFields();
			this.findSteps();
			this.step1.show();
			this.step2.hide();
			this.step3.hide();
			this.addEventListeners();
			
			
			//this.toggleField(".js-details", false);
			//this.populateFieldsFromUrl();
		}

};

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
	var url = "https://api.northampton.digital/vcc/getpropertiesbypostcode?postcode="+pc;
	return $.ajax({
		url: url,
		dataType:"JSON"
	});
};

/**
 * Parameters {Array} and array of property objects
 * Returns {String} an html string for populating a select box
 */
nbcApp.Utils.getOptionListFromProperties = function(propArr){
	var html = '<option value="false">Select</option>';
	for(var x = 0; x < propArr.length; x++) {
		html += '<option value="'+propArr[x][0]+'">'+propArr[x][3]+' '+propArr[x][4]+'</option>';
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

/*--------------------------------*/
/* Receipt --------------------*/
/*--------------------------------*/
nbcApp.Receipt = {
		self: this,
		email: $(".email-receipt"),
		tel: $(".sms-receipt"),
		emailReceipt: true, // assume email receipt

		addEventListeners: function() {
			var self = this;

			this.email.delegate(".button","click", function(e){
				e.preventDefault();
				self.emailReceipt = true;


				var email = self.email.find('.receipt-input').val();
				var ref = nbcApp.model.caseref;
				var valid = self.validateEmail(email);

				if(valid) {
					$(".js-receipt-email").hide();
					self.sendReceipt(email, "", ref);
				} else {
					$(".js-receipt-email").show();
				}
			});

			this.tel.delegate(".button","click", function(e){
				e.preventDefault();
				self.emailReceipt = false;

				var tel = self.tel.find('.receipt-input').val();
				var ref = nbcApp.model.caseref;
				var valid = self.validatePhone(tel);

				if(valid) {
					$(".js-receipt-phone").hide();
					self.sendReceipt("", tel, ref);
				} else {
					$(".js-receipt-phone").show();
				}
			});


		},

		init: function() {
			this.addEventListeners();
		},

		validateEmail: function(email) {
			return nbcApp.Validation.isValidEmailAddress(email);
		},

		validatePhone: function(phone) {
			return nbcApp.Validation.isValidPhoneNumber(phone);
		},


		sendReceipt: function(email, tel, ref){
			var self = this;

			if(self.emailReceipt) {
				self.email.find(".js-receipt-action--loading").show();
				self.email.find(".js-receipt-action--failed").hide();
				self.email.find(".js-receipt-action--success").hide();
			} else {
				self.tel.find(".js-receipt-action--loading").show();
				self.tel.find(".js-receipt-action--failed").hide();
				self.tel.find(".js-receipt-action--success").hide();
			}

			var url = 'ReplacementContainerReceipt',
			params = {
					email: encodeURIComponent(email),
					tel: encodeURIComponent(tel),
					ref: encodeURIComponent(ref)
			},

			send = $.ajax({
				url: url,
				data: params,
				type: "POST",
				dataType: "JSON"
			});

			send.done(function(data){

				if(data.success) {
					self.sendingSuccess();
				} else {
					self.sendingFailed();
				}
			});

			send.fail(function(e,obj,status){
				self.sendingFailed();
			});
		},

		sendingSuccess: function() {
			if(this.emailReceipt){
				this.email.find(".js-receipt-action--loading").hide();
				this.email.find(".js-receipt-action--failed").hide();
				this.email.find(".js-receipt-action--success").show();
			}
			else{
				this.tel.find(".js-receipt-action--loading").hide();
				this.tel.find(".js-receipt-action--failed").hide();
				this.tel.find(".js-receipt-action--success").show();
			}
		},

		sendingFailed: function() {
			if(this.emailReceipt){
				this.email.find(".js-receipt-action--loading").hide();
				this.email.find(".js-receipt-action--failed").show();
				this.email.find(".js-receipt-action--success").hide();
			}
			else{
				this.tel.find(".js-receipt-action--loading").hide();
				this.tel.find(".js-receipt-action--failed").show();
				this.tel.find(".js-receipt-action--success").hide();
			}
		}
};

nbcApp.init();
