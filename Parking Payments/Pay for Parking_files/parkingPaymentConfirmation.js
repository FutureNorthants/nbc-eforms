(function($) {

	var nbcApp = null;
	nbcApp = nbcApp || {};

	var $loading = $('#loading');
	var $loading2 = $('#loading2');

	var $noPostCode = $('#noPostCode');
	var $nonNBCPostCode = $('#nonNBCPostCode');
	var $postCodeNotValid = $('#postCodeNotValid');
	var $postCodeNotFound = $('#postCodeNotFound');

	var $mainform = $('#mainform');
	var $confirmation = $('#confirmation');
	var $formSubmitted = $('#formSubmitted');
	var $formDetails = $('#formdetails');

	var $validName = $('#validName');
	var $validTel = $('#validTel');
	var $validEmail = $('#validEmail');
	var $noAddressSelected = $('#noAddressSelected');
	var $noDateSelected = $('#noDateSelected');
	var $noItemSelected = $('#noItemSelected');
	var $cboSelectDate = $('#cboSelectDate');
	var $cboItem1 = $('#cboItem1');
	var $cboItem2 = $('#cboItem2');
	var $cboItem3 = $('#cboItem3');
	var $txtAddInfo = $('#txtAddInfo');
	var $sumAddDetails = $('#sumAddDetails');
	var $SummaryDetails = $('#SummaryDetails');
	var $agreeTerms = $('#agreeTerms');
	var $ajaxLoading = $('#ajax-wait');
	var $redirectWait = $('#redirect-wait');
	var $paymentSuccess = $('#payment-success');
	var $paymentError = $('#payment-error');
	var $exceptionError = $('#exception-error');
	var $paymentTitle = $('#payment-title');
	var $invalidEmail = $('#invalidEmail');
	var $invalidPhone = $('#invalidPhone');
	var $sendingEmail = $('#sendingEmail');
	var $sendingEmailSuccess = $('#sendingEmailSuccess');
	var $sendingEmailFailed = $('#sendingEmailFailed');
	var $sendingSMS = $('#sendingSMS');
	var $sendingSMSSuccess = $('#sendingSMSSuccess');
	var $sendingSMSFailed = $('#sendingSMSFailed');
	var $emailReceipt = $('.email-receipt');
	var $smsReceipt = $('.sms-receipt');
	var $date = "";
	var $address = "";
	var $items = "";

	nbcApp.init = function(){
		//On page Field Changes
		$formDetails.hide();
		$loading.hide();
		$loading2.hide();

		//Post Code Error Messages
		$noPostCode.hide();
		$nonNBCPostCode.hide();
		$postCodeNotValid.hide();
		$postCodeNotFound.hide();

		//Page Changes
		$confirmation.hide();
		$formSubmitted.hide();
		$ajaxLoading.hide();
		$redirectWait.hide();

		//Error Messages
		$validName.hide();
		$validTel.hide();
		$validEmail.hide();
		$noAddressSelected.hide();
		$noDateSelected.hide();
		$noItemSelected.hide();
		$agreeTerms.hide();
		$exceptionError.hide();
	}();

	/*EVENT LISTENERS------------------------------------------------------------------------------------------------*/
	/*---------------------------------------------------------------------------------------------------------------*/

//	Submit form to summary-------------------------------------------------------------------------------------------
	$('#btnSubmit').on("click", function(e){
		e.preventDefault();
		if(validateForm()){
			//Submit Form----
			$mainform.hide();
			$confirmation.show();
			$(window).scrollTop($confirmation.scrollTop());
			summary();
		}
	});

//	Validate of the form----------------------------------------------------------------------------------------------------------------
//	----------------------------------------------------------------------------------------------------------------

//	Populate the sumary page------------------------------------------------------------
	var summary = function (){
		var item1 = $cboItem1.val();
		var item2 = $cboItem2.val();
		var item3 = $cboItem3.val();
		var date1 = $cboSelectDate.val();
		var collectionItems = "";
		var collectionDate = ""; 
		var existingDetails = $txtAddInfo.val();
		//Items to be collected --------------------------
		if (item1){
			collectionItems += '<p class="redHighlight">'+item1+'</p>';
		}
		if (item2){
			collectionItems += '<p class="redHighlight">'+item2+'</p>';
		}
		if (item3){
			collectionItems += '<p class="redHighlight">'+item3+'</p>';
		}			

		$('#items').html(collectionItems);
		//Collection Date ---------------------------------
		if(date1){
			collectionDate = date1;
		}		
		$('#date').html(collectionDate);
		//Additional Details -------------------------------
		if(!existingDetails){
			$sumAddDetails.hide();
		}
		else{		
			$SummaryDetails.html(existingDetails);
		};

	};

	function getParameterByName(name) {
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
		return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}

	/**
	 * Application Receipt
	 * -------------------
	 */ 
	var handleReceipt = function(email,tel,ref,$cont, paymentType) {
		//store a copy of the content if there's a problem
		if(email==""){
			$invalidPhone.hide();
			$sendingSMS.show();
		}else{
			$invalidEmail.hide();
			$sendingEmail.show();
		}
		
		var sendReceipt = function(email, tel, ref, paymentType){
			var url = window.location.href.toString().substring(0,window.location.href.toString().indexOf("intranet/parkingPaymentConfirmation")) + "ParkingReceipt";
			params = {
					email: encodeURIComponent(email),
					tel: encodeURIComponent(tel),
					ref: encodeURIComponent(ref),
					type: encodeURIComponent(paymentType),
					address: encodeURIComponent(address)
			},

			send = $.ajax({
				url: url,
				data: params,
				dataType: "JSONP"
			});

			send.done(function(data){
				if(email==""){
					$sendingSMS.hide();
					$sendingSMSSuccess.show();
				}
				else{
					$sendingEmail.hide();
					$sendingEmailSuccess.show();
				}
			});

			send.fail(function(e,obj,status){
				if(email==""){
					$sendingSMS.hide();
					$sendingSMSFailed.show();
				}
				else{
					$sendingEmail.hide();
					$sendingEmailFailed.show();
				}
			});
		};
		sendReceipt(email, tel, ref, paymentType);
	};

	var validateEmail = function (email) {
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return (email.length > 0 &&  re.test(email)) ? true : false;
	};

	var validateTelephone = function (tel) {
		var valid=false;
		if (checkUKTelephone (tel)) {
			valid=true;
		}
		return valid;
	};

	//Delegate event to handle receipt requests

	$('#payment-success').delegate('input.button','click',function(){
		var $this = $(this),
		email = $('#receipt-email').val(),
		tel = $('#receipt-sms').val(),
		//ref = $('#referenceNumber').text() || "no reference found2A",
		$emailCont = $('.email-receipt'),
		$telCont = $('.sms-receipt');
		switch($this.data('receipt')){
		case 'email':
			(validateEmail(email)) ? handleReceipt(email,"", ref, $emailCont, paymentType) : $invalidEmail.show();
			break;
		case 'sms':
			(validateTelephone(tel)) ? handleReceipt("",tel, ref, $telCont, paymentType) : $invalidPhone.show();
			break;
		}
	});	


	jQuery(document).ready(function($) {
		// Code using $ as usual goes here.
		var cardPayment = (getParameterByName("ResponseCode")=='00000') ? true : false;
		var ddPayment = getParameterByName("cboPayment");
		// for receipt type
		paymentType = (ddPayment.length > 0) ? ddPayment : "card";
		
		if(cardPayment || ddPayment){
			
			ref = (ddPayment) ? getParameterByName("caseref") : getParameterByName("CallingApplicationTransactionReference");
			address = (ddPayment) ? getParameterByName("txtAddress") : getParameterByName("address");
			
			$paymentTitle.html('<h1>Parking Payment Confirmation</h1>');
			$("#referenceNumber").html(ref);
			
			var message = "";
			if(ddPayment) {
				message = "Your Direct Debit form will be posted to you at " + address +". Please complete the form" +
				" and return it to Alan Craggs, The Guildhall, NN1 1DE.";
				
			} else {
				message = "Thank you for your payment.";
			}
			
			$(".js-message").html(message);
			$paymentSuccess.show();
		}else{
				$paymentTitle.html('<h1>Payment Failed</h1>');
				$("#txtReason").html(getParameterByName("ResponseDescription"));
				$paymentError.show();			
		}

	});

	/*==============================================================================

	This routine checks the value of the string variable specified by the parameter
	for a valid UK telphone number. It returns false for an invalid number and the
	reformatted telephone number false a valid number.

	If false is returned, the global variable telNumberError contains an error
	number, which may be used to index into the array of error descriptions 
	contained in the global array telNumberErrors.

	The definition of a valid telephone number has been taken from:

	http://www.ofcom.org.uk/telecoms/ioi/numbers/numplan030809.pdf

	All inappropriate telephone numbers are disallowed (e.g. premium lines, sex 
	lines, radio-paging services etc.)

	Author:    John Gardner
	Date:      16th November 2003

	Version:   V1.1  4th August 2006       
						 Updated to include 03 numbers being added by Ofcom in early 2007.

	Version:   V1.2  9th January 2007
	           Isle of Man mobile numbers catered for 

	Version:   V1.3  6th November 2007
	           Support for mobile numbers improved - thanks to Natham Lisgo

	Version:   V1.4  14th April 2008
	           Numbers allocated for drama excluded - thanks to David Legg

	Example calling sequnce:

	  if (!checkUKTelephone (myTelNo)) {
	     alert (telNumberErrors[telNumberErrorNo]);
	  }

	------------------------------------------------------------------------------*/

	function checkUKTelephone (telephoneNumber) {

		// Convert into a string and check that we were provided with something
		var telnum = telephoneNumber + " ";
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
		return telnum;
	}
	var telNumberErrors = new Array ();
	telNumberErrors[0] = "Valid UK telephone number";
	telNumberErrors[1] = "Telephone number not provided";
	telNumberErrors[2] = "UK telephone number without the country code, please";
	telNumberErrors[3] = "UK telephone numbers should contain 10 or 11 digits";
	telNumberErrors[4] = "The telephone number should start with a 0";
	telNumberErrors[5] = "The telephone number is either invalid or inappropriate";

})(jQuery);