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
	var $houseNumber = $('#cboHouseNumber');
	var $txtCustName = $('#txtCustName');
	var $txtCustTel  = $('#txtCustTel');
	var $txtCustOrganisation  = $('#txtCustOrganisation');
	var $txtCustTeam  = $('#txtCustTeam');
	var $txtCustTeamManager = $('#txtCustTeamManager');
	var $txtCustPostCode = $('#txtCustPostCode');
	var $txtCustAddress = $('#txtCustAddress');
	var $cboSelectDate = $('#cboSelectDate');
	var $cboItem1 = $('#cboItem1');
	var $cboItem2 = $('#cboItem2');
	var $cboItem3 = $('#cboItem3');
	var $txtAddInfo = $('#txtAddInfo');
	var $objRef = $('#objRef');
	var $sumAddDetails = $('#sumAddDetails');
	var $SummaryDetails = $('#SummaryDetails');
	var $addressRequired = $('#addressRequired');
	var $agreeTerms = $('#agreeTerms');
	var $formdetails = $('#formdetails');
	var $ajaxLoading = $('#ajax-wait');
	var $redirectWait = $('#redirect-wait');
	var $tckAddress = $('#tckAddress');
	var $addressNumber = $('#addressNumber');
	var $streetName = $('#addressStreet');
	var $town = $('#addressTown');
	var $county = $('#addressCounty');
	var $postcode = $('#addressPostCode');
	var $muteError = $('#mute-error');
	var $exceptionError = $('#exception-error');
	var $paymentSourceCode = $('#PaymentSourceCode');
	var $cboExistingPass = $("#existingPass");
	var $txtExistingPassNumber = $("#existingPassNumber");
	var $existingPassFields = $(".js-existingPass");
	var $cboPaymentType = $("#paymentType");
	var $txtPaymentPeriod = $("#paymentPeriod");
	var $txtPayPeriodDetails = $txtPaymentPeriod.options[$txtPaymentPeriod.selectedIndex].text;
	var $cardPaymentFields = $(".js-card");
	var $ddPaymentFields = $(".js-dd");
	var $noTeam = $("#validTeam");
	var $noTeamManager = $("#validTeamManager");
	var $noOrganisation = $("#validOrganisation");
	var $noPaymentType = $("#validPaymentType");
	var $noExistingPass = $("#validExistingPass");
	var $noAddressNumber = $("#noAddressNumber");
	var $noAddressStreet = $("#noAddressStreet");
	var $noAddressTown = $("#noAddressTown");
	var internal = false;
	var model = {
			txtName: "",
			txtAddress: "",
			cboPass: "",
			txtPassNo: "",
			txtOrg: "",
			txtTeamName: "",
			txtManager: "",
			cboPayment: "",
			txtTelNo: "",
			txtPayPeriod: "",
			txtPayPeriodDetails: "", 
			txtComments: "",
			addressNumber: "",
			addressStreet: "",
			addressTown: "",
			addressCounty: "",
			addressPostCode: "",
			txtInternal: "",
			txtUserid: ""
	};

	var property = null;

	/*AJAX REQUESTS---------------------------------------------------------------------------------------------*/	
	/*-------------------------------------------------------------------------------------------------------------------*/	

	/*Get the house number ----------------------------------------------------------------------------------------*/	
	var getHouseNum = function(pc){
		var url = "https://api.northampton.digital/vcc/getpropertiesbypostcode?postcode="+pc;
		return $.ajax({
			url: url,
			dataType:"JSON"
		});
	};



	/*Get the full address ---------------------------------------------------------------------------------------------*/
	var getAddress = function(idnum){
		
			var results =property.results
			console.log(results);
			console.log(idnum);
		for (var x = 0; x < results.length; x++){
			var fullAddress = results[x][2];
			var hseNum = results[x][3]
			var uprn = results[x][0];
			var strtName = results[x][4];
			var townName = results[x][5];
			var postCde = results[x][6];
			console.log(idnum, uprn);
				if (hseNum.match(/^\d/)) {
					   console.log(" ")
					} else {
						var splitAdd = fullAddress;
						var splitAddr = splitAdd.split(",",2);
						hseNum = splitAddr;
						
					};
			    
			
			if (uprn === idnum){
				
				$objRef.val(idnum);
				$addressNumber.val(hseNum);
				$streetName.val(strtName);
				$town.val(townName);
				$county.val("Northamptonshire");
				$postcode.val(postCde);
				break;  
			}
		}
	};
	

//	------------------------------------------------------------
	var submitDetails = function () {
		var url = "https://mycouncil-test.northampton.digital/CreateParkingPayment";
		$.ajaxSetup({
			beforeSend:function(){
				$ajaxLoading.show();
			},
			complete:function(){
				$ajaxLoading.hide();
			}
		});
		$.ajax({
			type:  'POST' ,
			dataType:"JSON",
			url: url,
			data: model,
			success: function(data){
				if(data.success){
					if(data.returnURL){
						var paymentTotal = parseInt(data.paymentTotal).toFixed(2);
						
						$redirectWait.show();
						
						$("#CallingApplicationTransactionReference").val(data.caseref);
						$("#ReturnURL").val(data.returnURL);
						$("#PaymentTotal").val(paymentTotal); // Calculate selected amount from dropdown
						if($tckAddress.is(':checked')){
							$("#Payment_1").val("CPSTAFFP|16|"+ paymentTotal +"|Z|Your Case Reference is " + data.caseref + "||"+model.addressNumber+"||" + model.addressStreet + "||" + model.addressTown + "|" + model.addressCounty + "|" + model.addressPostCode);
						}else{
							$("#Payment_1").val("CPSTAFFP|16|"+ paymentTotal +"|Z|Your Case Reference is " + data.caseref + "||||||||");
						}
						$("#paymentForm").submit();
					} else {
						model.caseref = data.caseref;
						window.location = window.location.href.substr(0,location.href.lastIndexOf("/") + 1) + "parkingPaymentConfirmation.html?"+$.param(model);
					}
				} else{
					nbcApp.init;
					if(data.message=="mute error"){
						$muteError.show();
					}
					if(data.message=="exception error"){
						$exceptionError.show();
					}

				}

			}
		});
	};

	/*EVENT LISTENERS------------------------------------------------------------------------------------------------*/
	/*---------------------------------------------------------------------------------------------------------------*/
	// Existing Pass?
	$cboExistingPass.on("change",function(e){
		if(e.target.value === "Yes") {
			$existingPassFields.show();
		}
		else {
			$existingPassFields.hide();
		}
	});

	// Payment Method
	$cboPaymentType.on("change",function(e){
		if(e.target.value === "card") {
			$cardPaymentFields.show();
		}
		else {
			$cardPaymentFields.hide();
		}
	});


	// Find address -----------------------------------------------------------------------------
	$('#btnFindAddress').on('click',function(e){
		e.preventDefault();
		if(validatePostCode()){
			var pc =$txtCustPostCode.val();
			var stripSpace = pc.replace(/ /g,'');
			var promise = getHouseNum(stripSpace);
			promise.done(function(data){
				property = data;
				var populate = "<option>Select House Number</option>";
				var results = data.results;
				//If no results found display message
				if(results.length === 0){
					$postCodeNotFound.show();
					$loading2.hide();
					$houseNumber.hide();
					$("#addressPostCode").val(pc);
					displayForm();
				}
				else{
					$postCodeNotFound.hide();
					for (var x = 0; x < results.length; x++){
						var uprn = results[x][0];
						var newAddress = results[x][2]
						console.log(newAddress);
						if(newAddress.substring(0,2)=='0'){
							
							newAddress=newAddress.substring(0,2);
						}
						var row = "<option value="+uprn+ ">" + newAddress + "</option>";
						populate += row;			
					};
					$houseNumber.html(populate);
					displayForm();
				}
			});
			promise.fail(function(){
				alert("Sorry, there was an error getting properties for that postcode, please try again.");
			});
			//getCollectionDate(stripSpace);
		}
	});

//	Get full address on House number change -----------------------------------------------
	$houseNumber.on('change', function(){
		var idnum = $houseNumber.val();
		$addressRequired.hide();
		getAddress(idnum);
	});

//	Submit Case -----------------------------------------------------------------------------------------------------
	$('#btnSubmitCase').on('click',function(e){
		e.preventDefault();
		$confirmation.hide();
		submitDetails();
	});


//	Amend Button -----------------------------------------------------------------------------------------------------
	$('#btnAmend').on("click", function(e){
		e.preventDefault();
		$confirmation.hide();
		$mainform.show();
	});


//	Submit form to summary-------------------------------------------------------------------------------------------
	$('#btnSubmit').on("click", function(e){
		e.preventDefault();

		model.txtName = $txtCustName.val();
		model.cboPass = $cboExistingPass.val();
		model.txtPassNo = $txtExistingPassNumber.val();
		model.txtOrg = $txtCustOrganisation.val();
		model.txtTeamName = $txtCustTeam.val();
		model.txtManager = $txtCustTeamManager.val();
		model.cboPayment = $cboPaymentType.val();
		model.txtTelNo = $txtCustTel.val();
		model.txtPayPeriod = $txtPaymentPeriod.val(); 
		model.txtComments = "";
		model.addressNumber = $addressNumber.val();
		model.addressStreet = $streetName.val();
		model.addressTown = $town.val();
		model.addressCounty = $county.val();
		model.addressPostCode = $postcode.val();
		model.txtPayPeriodDetails =$txtPayPeriodDetails
		model.txtAddress = model.addressNumber + " " + model.addressStreet + " " + model.addressTown + " " + model.addressCounty + " " + model.addressPostCode;
		model.txtInternal = internal;
		
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
	//overall form check------
	var validateForm = function(){
		var checkName = validateName();
		var checkTel = validateTel();
		var checkAddress = validateAddress();
		var checkOrganisation = validateOrganisation();
		var checkTeam = validateTeam();
		var checkTeamManager= validateTeamManager();
		var checkExistingPass = validateExistingPass();
		var checkPaymentType = validatePaymentType();

		if(checkName && checkTel && 
				checkAddress && checkOrganisation && 
				checkTeam && checkTeamManager &&
				checkExistingPass && checkPaymentType){
			return true;
		}
		else{
			if(!checkName || !checkTel){
				$(window).scrollTop($mainform.scrollTop());
			}
			return false;
		}
	};

	//Check Name ---------------
	var validateName = function(){
		var regEx = /^[ a-z A-Z \) \( \xE1 \xE1 \xE9 \xED \xF3 \xFA \xC1 \xC9 \xCD \xD3 \xDA \x27 \x2D \x2E ]+$/;
		var name = $txtCustName.val();
		if (name){
			if(regEx.test(name)){
				$validName.hide();
				return true;
			};
		}
		$validName.show();
		return false;
	};

	var findAddress = function() {
		if(validatePostCode()){
			var pc =$txtCustPostCode.val();
			var stripSpace = pc.replace(/ /g,'');
			var promise = getHouseNum(stripSpace);
			promise.done(function(data){
				property = data;
				var populate = "<option>Select House Number</option>";
				var results = data.results;
				//If no results found display message
				if(results.length === 0){
					$postCodeNotFound.show();
					$loading2.hide();
					$houseNumber.hide();
					displayForm();
				}
				else{
					$postCodeNotFound.hide();
					for (var x = 0; x < results.length; x++){
						var newAddress = results[x].addressNumber;
						if(newAddress.substring(0,1)=='0'){
							newAddress=newAddress.substring(1,2);
						}
						var row = "<option value="+results[x][0] + ">" + newAddress + "</option>";
						populate += row;			
					};
					$houseNumber.html(populate);
					displayForm();
				}
			});
			promise.fail(function(){
				alert("Sorry, there was an error getting properties for that postcode, please try again.");
				return false;
			});
			//getCollectionDate(stripSpace);
		}
		return true;
	};

	//Check post Code is valid------------------------------------------------------------------------------------------
	var validatePostCode = function (){
		var pc =$txtCustPostCode.val();
		var stripSpace = pc.replace(/ /g,'');
		var regEx = /[a-z A-Z][a-z A-Z][0-9][0-9][a-z A-Z 0-9][a-z A-Z]+$/;
		if(regEx.test(stripSpace)){
			postCodeError($loading2);
			return true;
		}
		else{
			if(pc.length === 0 ){
				postCodeError($noPostCode);
			}
			else{
				postCodeError($postCodeNotValid);
				displayForm();
				
			}
		};

		return false;
	};

//	check Address -----------------------------------------------------
	var validateAddress = function() {

		var number = model.addressNumber;
		var street = model.addressStreet;
		var town = model.addressTown;
		var valid = true;

		if(number.length === 0) {
			// display error
			$noAddressNumber.show();
			valid = false;
		} else {
			$noAddressNumber.hide();
		}
		if(street.length === 0) {
			// display error
			$noAddressStreet.show();
			valid = false;
		} else {
			$noAddressStreet.hide();
		}
		if(town.length === 0) {
			// display error
			$noAddressTown.show();
			valid = false;
		} else {
			$noAddressTown.hide();
		}

		if(valid) {
			return true;
		} else {
			return false;
		}
	};

	var validateOrganisation = function() {
		var org = $txtCustOrganisation.val();
		if(org && org.length > 0){
			$noOrganisation.hide();
			return true;
		}
		$noOrganisation.show();
		return false;
	};

	var validateTeam = function() {
		var org = $txtCustTeam.val();
		if(org && org.length > 0){
			$noTeam.hide();
			return true;
		}
		$noTeam.show();
		return false;
	};

	var validateTeamManager = function() {
		var tm = $txtCustTeamManager.val();
		if(tm && tm.length > 0){
			$noTeamManager.hide();
			return true;
		}
		$noTeamManager.show();
		return false;
	};

	var validatePaymentType = function() {
		var pt = $cboPaymentType.val();
		if(pt !== "false"){
			$noPaymentType.hide();
			return true;
		}
		$noPaymentType.show();
		return false;
	};

	var validateExistingPass = function() {
		var ep = $cboExistingPass.val();
		if(ep !== "false"){
			$noExistingPass.hide();
			return true;
		}
		$noExistingPass.show();
		return false;
	};
//	Check Telephone Number-------------------------------------------
	var validateTel = function(){
		var regEx = /^[0-9]{6,}$/;
		var tel = $txtCustTel.val();
		var stripSpace = tel.replace(/ /g,'');
		if(regEx.test(stripSpace)){
			$validTel.hide();
			return true;
		};
		$validTel.show();
		return false;
	};


	/*MISC FUNCTIONS ----------------------------------------------------------------------------------------------*/
	/*-------------------------------------------------------------------------------------------------------------*/


//	Populate the sumary page------------------------------------------------------------
	var summary = function (){
		
		var details = "<ul>";
		
		details += "<li>Name: " + model.txtName + "</li>";
		details += "<li>Address: " + model.txtAddress + "</li>";
		
		if(model.cboPayment == "dd") {
			details += "<li>Payment Type: Direct Debit</li>";
		}
		else {
			details += "<li>Payment: &pound;"+(model.txtPayPeriod*40).toFixed(2)+"</li>";
		}
		
		
		details += "</ul>";
		
		$("#paymentDetails").html(details);
		
		if(model.cboPayment == "dd") {
			$("#btnSubmitCase").val("Submit");
		}

	};

	//Post Code Error Message--------------------------------------------------------
	var postCodeError = function (error){
		$noPostCode.hide();
		$nonNBCPostCode.hide();
		$postCodeNotValid.hide();
		$loading2.hide();
		error.show();
	};

	//Display form when address is found--------------
	var displayForm = function(){
		$loading2.hide();			
		$cboSelectDate.hide();
		$loading.show();
		$formdetails.show();
	};

	function getParameterByName(name) {
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
		return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}

	nbcApp.init = function(){
		//On page Field Changes
		$formDetails.hide();
		$loading.hide();
		$loading2.hide();
		$cardPaymentFields.hide();
		$existingPassFields.hide();

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
		$muteError.hide();
		$exceptionError.hide();
		$noExistingPass.hide();
		$noPaymentType.hide();

		if(getParameterByName("name")!=''){
			$('#txtCustName').val(getParameterByName("name"));
		} 
		if(getParameterByName("phone")!=''){
			$('#txtCustTel').val(getParameterByName("phone"));
		} 
		if(getParameterByName("postcode")!=''){
			$('#txtCustPostCode').val(getParameterByName("postcode"));
			findAddress();
		}
		if(getParameterByName("internal")=='true'){
			internal = true;
			$paymentSourceCode.val("02");
		}
	}();

})(jQuery);