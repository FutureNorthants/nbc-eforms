$(document).ready( function () {
	
	var strUtrn         =  $.trim(getParameterByName('txtUtrn'));
	var strTenant       =  $.trim(getParameterByName('txtTenant'));
	var strAddressLine1 =  $.trim(getParameterByName('txtAddressLine1'));
	var strAddressLine2 =  $.trim(getParameterByName('txtAddressLine2'));
	var strPostCode     =  $.trim(getParameterByName('txtPostCode'));
	var strDate1        =  $.trim(getParameterByName('txtDate1')); 
	var strAmount1      =  $.trim(getParameterByName('txtAmount1'));
	var strAmount2      =  $.trim(getParameterByName('txtAmount2')); 
	var strAmount3      =  $.trim(getParameterByName('txtAmount3')); 
	
	var regex1  = /^[0-9]{1,9}\.[0-9]{2}$/;
	var regex2  = /^-?[0-9]{1,9}\.[0-9]{2}$/;
	
	var strLine1='';
	var strLine2='';
	var strLine3='';
	var strLine4='';
	var strLine5='';
	var strLine6='';
	
	var strHTML='';
		
	if ( ( strTenant == '' ) || ( strTenant == null ) )
    {
		strHTML+='<div>Error - Tenant Name is missing</div><br>';
    }
	else
	{
		strLine1+='<div>' +  strTenant + '</div>';
	}
	
	
	if ( ( strAddressLine1 == '' ) || ( strAddressLine1 == null ) ) 
    {
		strHTML+='<div>Error - Address Line 1 is missing</div><br>';
    }
	
	
	if ( ( strAddressLine2 == '' ) || ( strAddressLine2 == null ) )
    {
		strHTML+='<div>Error - Address Line 2 is missing</div><br>';
    }
	else
	{
		strLine2+='<div>' +  strAddressLine1 + ' ' + strAddressLine2 + '</div><br>';
	}
	
	
	if ( ( strPostCode == '' ) || ( strPostCode == null ) )
    {
		strPostCode=' ';
    }

	
	if ( ( strUtrn == '' ) || ( strUtrn == null ) )
    {
		strHTML+='<div>Error - UTRN is missing</div><br>';
    }
	else
	{
		strLine3+='<div>UTRN ' +  strUtrn + '</div><br>';
	}
	

	if (regex1.test(strAmount1)) 
    {
	
	strLine4+='<div>The last payment made was &pound;' + strAmount1;
 
	if ( ( strDate1 == '' ) || ( strDate1 == null ) )
    {
		strLine4+='</div><br>';
    }
	else
	{
		strLine4+=' on ' + strDate1 + '</div><br>';
	}
	}

	
	if ( (regex1.test(strAmount2)) && (!(parseInt(strAmount2)==0)) )
	{
		strLine5+='<td><input type="checkbox" name="checkbox1" id="chk1" onclick="funCheckBox1(\''+ strAmount2  + '\')"></td>';
		strLine5+='<td>Current Balance &pound;' + strAmount2 + '</td>';
	}
	else
	{ 
	if ( (regex1.test(strAmount2)) && (parseInt(strAmount2)==0) )
	{
		strLine5+='<td><input type="checkbox" name="checkbox1" id="chk1" disabled="True" ></td>';
		strLine5+='<td>Current Balance &pound;' + strAmount2 + '</td>';	
	}
	else
	{ 
	if (regex2.test(strAmount2)) 
	{
		strLine5+='<td><input type="checkbox" name="checkbox1" id="chk1" disabled="True" ></td>';
		strLine5+='<td>Current Balance &pound;' + strAmount2.substring(1) + ' (in credit)</td>';		
	}
	else
	{
		strLine5+='<td><input type="checkbox" name="checkbox1" id="chk1" disabled="True" ></td>';
		strLine5+='<td>Current Balance is not available</td>';
	}
	}	
	}	

	
	if ( (regex1.test(strAmount3)) && (!(parseInt(strAmount3)==0)) )
	{
		strLine6+='<td><input type="checkbox" name="checkbox2" id="chk2" onclick="funCheckBox2(\''+ strAmount3  + '\')"></td>';
		strLine6+='<td>Weekly Net Amount &pound;' + strAmount3 + '</td>';
	}
	else
	{ 
	if ( (regex1.test(strAmount3)) && (parseInt(strAmount3)==0) )
	{
		strLine6+='<td><input type="checkbox" name="checkbox2" id="chk2" disabled="True" ></td>';
		strLine6+='<td>Weekly Net Amount &pound;' + strAmount3 + '</td>';	
	}
	else
	{ 
	if (regex2.test(strAmount3)) 
	{
		strLine6+='<td><input type="checkbox" name="checkbox2" id="chk2" disabled="True" ></td>';
		strLine6+='<td>Weekly Net Amount &pound;' + strAmount3.substring(1) + ' (credit)</td>';		
	}
	else
	{
		strLine6+='<td><input type="checkbox" name="checkbox2" id="chk2" disabled="True" ></td>';
		strLine6+='<td>Weekly Net Amount is not available</td>';
	}
	}	
	}	
			
	
	if ( strHTML == '')
	{
	strHTML+='<div>You have chosen to make a payment for :</div><br>';
	strHTML+=strLine1;
	strHTML+=strLine2;
	strHTML+=strLine3;
	strHTML+=strLine4;
	strHTML+='<div>Amount to Pay :</div>';
	strHTML+='<table><tr>';
	strHTML+=strLine5;
	strHTML+='</tr><tr>';
	strHTML+=strLine6;
	strHTML+='</tr><tr>';
	strHTML+='<td><input type="checkbox" name="checkbox3" id="chk3" onclick="funCheckBox3(\'0.00\')"></td>';
	strHTML+='<td>Other Amount (please enter below)</td>';
	strHTML+='</tr></table>';
	strHTML+='<div>Payment Amount:</div>';
	strHTML+='<div><input type="text" size="12" name="txtPaymentTotal" id="txtPaymentTotal" value="0.00"</div>';
	strHTML+='<div id="divError"><font color="red">Please set payment amount and submit.</font></div><br>';
	strHTML+='<div><input type="button" name="cmdSubmit" id="cmdSubmit" onclick="funSubmit()" class="red button" value="Submit"  /></div>';
	}
	
	document.getElementById('divDetail1').innerHTML = strHTML;
	
});



function getParameterByName(name)
{
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.search);
  if(results == null)
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}


function funCheckBox1(amount)
{

document.getElementById("txtPaymentTotal").value=amount;

document.getElementById("chk2").checked = false;
document.getElementById("chk3").checked = false;

document.getElementById('divError').innerHTML="";

}


function funCheckBox2(amount)
{

document.getElementById("txtPaymentTotal").value=amount;

document.getElementById("chk1").checked = false;
document.getElementById("chk3").checked = false;

document.getElementById('divError').innerHTML="";

}

function funCheckBox3(amount)
{

document.getElementById("txtPaymentTotal").value=amount;

document.getElementById("chk1").checked = false;
document.getElementById("chk2").checked = false;

document.getElementById('divError').innerHTML='<font color="red">Please set payment amount and submit.</font>';

}

function funSubmit()
{

var strUtrn         = $.trim(getParameterByName('txtUtrn'));
var strTenant       = $.trim(getParameterByName('txtTenant'));
var strAddressLine1 = $.trim(getParameterByName('txtAddressLine1'));
var strAddressLine2 = $.trim(getParameterByName('txtAddressLine2'));
var strPostCode     = $.trim(getParameterByName('txtPostCode'));
	
var strPaymentTotal = document.getElementById("txtPaymentTotal").value;

var strPayment_1 = ''; 

strPayment_1+=strUtrn             + "|";
strPayment_1+='38'                + "|";
strPayment_1+=strPaymentTotal     + "|";
strPayment_1+='Z'                 + "|";
strPayment_1+=strTenant           + "|";
strPayment_1+=''                  + "|";
strPayment_1+=strAddressLine1     + "|";
strPayment_1+=''                  + "|";
strPayment_1+=strAddressLine2     + "|";
strPayment_1+=''                  + "|";
strPayment_1+='Northampton'       + "|";
strPayment_1+='Northamptonshire'  + "|";
strPayment_1+=strPostCode         + "|";

var strReturnURL=''; 
var strPaylinkURL='';

var getURLs = function(){
	var url = 'HousingPayment',
	params  = {},
	send    = $.ajax({url: url,data: params,type: "POST",dataType: "JSON"});

	send.done(function(data)
	{
	if (data.success)
	{
		strReturnURL  = data.returnURL;
		strPaylinkURL = data.paylinkURL;
		
		strPaylinkURL+='?' + 'CallingApplicationID='                   + 'NBCPAYLINKLive';
		strPaylinkURL+='&' + 'CallingApplicationTransactionReference=' + strUtrn;
		strPaylinkURL+='&' + 'PaymentTotal='                           + strPaymentTotal;
		strPaylinkURL+='&' + 'PaymentGeneralLedgerCode='               + 'GL123456789';
		strPaylinkURL+='&' + 'ReturnUrl='                              + strReturnURL;
		strPaylinkURL+='&' + 'PaymentSourceCode='                      + '01';
		strPaylinkURL+='&' + 'Payment_1='                              + strPayment_1;

		var regex  = /^[0-9]{1,9}\.[0-9]{2}$/;

		if (regex.test(strPaymentTotal))
			{
			if (!(parseInt(strPaymentTotal)==0))
			{
				window.location = strPaylinkURL;
			}
			else
			{
			document.getElementById('divError').innerHTML='<font color="red">Payment Amount must be 1.00 or more</font>';
			}
			}
		else
			{
			document.getElementById('divError').innerHTML='<font color="red">Payment Amount must be in the format 99.99</font>';
			}
	}
	else
	{
		document.getElementById('divError').innerHTML='<font color="red">Error calling Civica Paylink system(1).</font>';
	}
	});

	send.fail(function(e,obj,status)
	{
		document.getElementById('divError').innerHTML='<font color="red">Error calling Civica Paylink system(2).</font>';
		alert(e);
		alert(obj);
		alert(status);
	});
};

getURLs();
	 
return false;

}
