var defaultContent="";
var selectionContent="";
var jsonData="";
var oldHash="";
var uprn="";
var showPrevious="";
var showHandover="";
window.onload = loadPage;
window.onhashchange = resetPage;

$.ajaxSetup({
    beforeSend:function(){
    	defaultContent=document.getElementById('main').innerHTML;
    	document.getElementById('main').innerHTML='Please Wait<BR><BR>';
        document.getElementById('main').innerHTML+='<img src="images/loading.gif" title="Loading..." alt="Loading">';
    },
    complete:function(){
    }
});

function findRoundsByPostcode(){
	if(document.getElementById('postcode').value==''||document.getElementById('postcode').value=='postcode'){
		alert('Please enter a postcode');
	}else{
		$.ajax({
			url:'BinRoundFinder?postcode=' + document.getElementById('postcode').value,
			dataType:'JSON',
			type: 'GET',
			success:function(data){
				if(data.result=='success'){
					if(data.rounds=='single'){
						showResult(data.date,data.day,data.type,data.url,data.oldDay,data.oldWeek,data.newWeek);
					}else{
						selectProperty(data);
					}
				}else{
					if(data.description=='No properties found'){
					   document.getElementById('main').innerHTML='<div id=\"error\"><p>There are no results for your postcode.</p></div>' +
					                                             '<p>Please <a href=\"http://postcodefinder.postoffice.co.uk/postcodefinderm.aspx\" target="_blank">check your post code</a> or call us on 0300 330 7000 to check your collection.</p>';
					}else{
					   document.getElementById('main').innerHTML='<div id=\"error\"><p>Unfortunately there\'s been an error.</p></div>' +
					                                             '<p>Please call us on 0300 330 7000 to check your collection.</p>';
					}
				}
			},
			error: function(xhrObj, errText, thrownError){
				   document.getElementById('main').innerHTML='<div id=\"error\"><p>Unfortunately there\'s been an error.</p></div>' +
					                                             '<p>Please complete <a href = "https://www.northampton.gov.uk/forms/form/181/en/post-code-checker---address-not-found" target="_self">this form</a> and we will be in touch.</p></p>';																 ;
																 
			}
		});
	}
}

function findRoundsByUPRN(){
		$.ajax({
			url:'BinRoundFinder?uprn=' + uprn,
			dataType:'JSON',
			type: 'GET',
			success:function(data){
				if(data.result=='success'){
					if(data.rounds=='single'){
						showResult(data.date,data.day,data.type,data.url,data.oldDay,data.oldWeek,data.newWeek);
					}else{
						selectProperty(data);
					}
				}else{
					if(data.description=='No properties found'){
					   document.getElementById('main').innerHTML='<div id=\"error\"><p>There are no results for your postcode.</p></div>' +
					                                             '<p>Please <a href=\"http://postcodefinder.postoffice.co.uk/postcodefinderm.aspx\" target="_blank">check your post code</a> or call us on 0300 330 7000 to check your collection.</p>';
					}else if(data.description=='No property found'){
						   document.getElementById('main').innerHTML='<div id=\"error\"><p>There are no results for this UPRN.</p></div>';
                     }else{
					   document.getElementById('main').innerHTML='<div id=\"error\"><p>Unfortunately there\'s been an error.</p></div>' +
					                                             '<p>Please call us on 0300 330 7000 to check your collection.</p>';
					}
				}
			},
			error: function(xhrObj, errText, thrownError){
				    alert('failure');
					alert(errText);
			}
		});
}

function selectProperty(data){	
	jsonData=data;
	var output = '<p>Please choose your property from the list below:</p>';
	output += '<select id=\"address\">';
	
	for(currentProperty=0;currentProperty<data.properties.length;currentProperty++){
		 output += '<option value=\"\"' + '>' + data.properties[currentProperty].property +"</option>";
	} 
	output += "</select>";
    output += "<div id='button'><a class=\"button red\" href=\"#getResults\" onclick=\"getResult()\"><span>Find It</span></a></div>";
	document.getElementById('main').innerHTML=output;
	selectionContent=output;
}

function getResult() {
	showResult(jsonData.properties[document.getElementById('address').selectedIndex].date,
			   jsonData.properties[document.getElementById('address').selectedIndex].day,
			   jsonData.properties[document.getElementById('address').selectedIndex].type,
			   jsonData.properties[document.getElementById('address').selectedIndex].url,
			   jsonData.properties[document.getElementById('address').selectedIndex].oldDay,
			   jsonData.properties[document.getElementById('address').selectedIndex].oldWeek,
			   jsonData.properties[document.getElementById('address').selectedIndex].newWeek);
}

function loadPage(){
	window.location.hash='';
	uprn=getParameterByName('uprn');
	showPrevious=getParameterByName('showPrevious');
	showHandover=getParameterByName('showHandover');
	if(uprn.length==8){
		findRoundsByUPRN();
	}
}

function resetPage() {
	if(oldHash=='#findRounds' && window.location.hash==''){
	   document.getElementById('main').innerHTML=defaultContent;
	}
	if(oldHash=='#getResults' && window.location.hash=='#findRounds'){
		   document.getElementById('main').innerHTML=selectionContent;
		}
	oldHash=window.location.hash;
}

function showResult(date,day,type,url,oldDay,oldWeek,newWeek){	
	var container = document.getElementById('main');
	var oldWeekDesc;
		
	switch(type)
	{
	case "black":
	  type = "Black Wheelie Bin";
	  break;
	case "brown":
	  type = "Blue Lidded Recycling Bin";
	  break;
	case "bags":
	  type = "Green Bags";
	  break;	  
	}
		
	if(newWeek!=oldWeek)
	{
		if(newWeek==0){
			oldWeekDesc = "Green Bags";
		}else{
			oldWeekDesc = "Wheelie Bins";
		}
	}else{
		oldWeekDesc=type;
	}	
	
	var time = getTime(date);
	var output = "";

		output+= "<p><center>Your collection day is";
		output+= "<p class=\"redHighlight\">" + day + "</p>";
		output+= "Your next collection will be";
		output+= "<p class=\"redHighlight\">" + type + "</p>";
		output+= "Remember to put out your bins by";
		output+= "<p class=\"redHighlight\">" + time + "</p>";
		
	if(type == "Green Bags"){
		output += "We will collect your Green Bags and all of your recycling every week.<br>";	
	}
	else if(type == "Black Wheelie Bin" | type == "Brown Wheelie Bin"){
		output += "We will empty your black bin and recycling bin every two weeks (on alternating weeks).<br><br>";
		output += "We will collect your food waste every week.<br>";
	}
	else if(type=="Blue Lidded Recycling Bin"){
		output += "Garden waste subscribers will also have their brown bins collected on this day"
	}
	output += "<a class=\"button red\" target=\'_blank' href=\"https://s3-eu-west-1.amazonaws.com/nbc-bin-calendars/201809-201902/" + url + ".pdf\"><span>Download Calendar</span></a>";
        output+= "</center></p>";
	container.innerHTML = output;
}

function getTime(longdate){
	var hour = longdate.substr(8,2);
	var min = longdate.substr(10,2);
	return hour + ":" + min;
}

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