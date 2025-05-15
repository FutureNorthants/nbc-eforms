window.nbcApp = {
        self: this,
        map: {},
        geocoder: {},
        mapMarker: {},
        
        model: {
                problemDetails: "",
                "problem-street": "",
                "problem-address": "",
                objectId: "",
                "event-type":"",
                "first-name": "",
                surname:"",
                email: "",
                "telephone-number": "",
                comments:"",
                myFile:"",
                "type-of-land":"",
                "what-is-the-majority-of-the-flytipping":"",
                "approximate-tip-amount":"",
                "did-you-witness-the-flytip-take-place-or-have-further-evidence-information":"",
                "incident-date":"",
                "incident-time":"",
                "please-give-as-much-information-of-who-you-witnessed-flytipping":"",
                "please-give-as-much-information-of-any-vehicle-you-witnessed-flytipping":"",
                "what-type-or-size-of-animal-was-it":"",
                "please-give-details-of-the-dog":"",
                "please-give-details-of-the-dog-owner":"",
                retailer:"",
                "is-the-trolley-in-the-water":"",
                "check-if-you-witnessed-the-offence-being-committed-and-are-prepared-to-provide-a-witness-statement-1":"",
                "additional-location-information":"",
                "additional-information":"",
                "did-you-witness-the-littering-take-place":"",
                "please-give-as-much-information-of-who-you-witnessed-littering":"",
                "street-light-reference-number":"",
                "litter-time":"",
                "litter-date":"",
                "flytip-type-of-land":"",
                "2-was-this-avoidable-contact":"",
                sovereign:"",
                lat: "",
                lng: "",
                heading: "",
                pitch: "",
                zoom: "",
                problemNumber: "",
                problemDetails: "",
                internal: "",
                interactionId: "",
                userId: "",
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
                "bin-reference-number": "",
                avoidable:"",
                "contact-channel-1":"",
                usrn: "",
                personId:"",
                threeWordsUsed:"",
                advisor:"",
                "reason-avoidable-contact":"",
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
                
                $(".js-3-words").click(function(e){
                e.preventDefault();});
                
                /**
                 * search for a street
                 * return the results to html fields
                 * or show an error
                 */
                $(".js-search-street").click(function(e){
                        e.preventDefault();
                        self.hideErrors();
                         var radioButtons = document.querySelector('input[name="searchType"]:checked').value;
                        var streetSearchStr = $("#search-street").val();
                        if(nbcApp.Validation.isEmpty(streetSearchStr)){
                                $(".js-street-empty").show();
                        } else if (radioButtons ==="Street") {
                                self.searchForStreets(streetSearchStr);
                        } else {var words = $("#search-street").val
                                self.whatthreewords()}
                });
                
                $("#mainForm").delegate("#objectId","change",function(e){
                        var $selected = $(this).find("option:selected");
                        var street = $selected.text();
                
                        
                        $("#problem-street").val(street);
                        
                        self.searchGoogleForStreet(street);
                        
                });
                $("#mainForm").delegate(".js-3-words","click",function(e){
                        var words = $("#search-street").val
                        self.whatthreewords();
                });
                
                $("#mainForm").delegate("#problemNumber","change",function(e){
                        var evt = document.getElementById('event-type')
                        evt.value = $(this).val()
                        if($(this).val() == "Flytip"){
                                $("#flytipLand").css('display','block');
                                $("#flyTypes").css('display','block');
                                $("#amt").css('display','block');
                                $("#Witness").css('display','block');
                        } else {
                                $("#flyLand").css('display','none');
                                $("#flytipLand").css('display','none');
                                $("#flyTypes").css('display','none');
                                $("#amt").css('display','none');
                                $("#Witness").css('display','none');
                                $("#incidentDt").css('display','none');
                                $("#timeIncident").css('display','none');
                                $("#witnessInfo").css('display','none');
                                $("#witnessCar").css('display','none');
                                $("#witnessStatement").css('display','none');   
                                                                
                        }
                });
                $("#mainForm").delegate("#did-you-witness-the-flytip-take-place-or-have-further-evidence-information","change",function(e){
                        if($(this).val() == "true"){
                                $("#incidentDt").css('display','block');
                                $("#timeIncident").css('display','block');
                                $("#witnessInfo").css('display','block');
                                $("#witnessCar").css('display','block');
                                $("#witnessStatement").css('display','block');
                        } else { $("#incidentDt").css('display','none');
                                $("#timeIncident").css('display','none');
                                $("#witnessInfo").css('display','none');
                                $("#witnessCar").css('display','none');
                                $("#witnessStatement").css('display','none');
                        }
                });
                
                $("#mainForm").delegate("#problemNumber","change",function(e){
                        if($(this).val() === "dead_animal"){
                                $("#deadAnimal").css('display','block');
                                $("#animal").css('display','block');
                        } else {
                                $("#deadAnimal").css('display','none');
                                $("#animal").css('display','none');
                        }
                });
                $("#mainForm").delegate("#problemNumber","change",function(e){
                        if($(this).val() === "dead_animal"){
                                $("#deadAnimal").css('display','block');
                                $("#animal").css('display','block');
                        } else {
                                $("#deadAnimal").css('display','none');
                                $("#animal").css('display','none');
                        }
                });
        /*      $("#mainForm").delegate("#subServiceSelect","change",function(e){
                        
                        if($(this).val() === "Reporting a Lost Dog"|| $(this).val()==="Roaming Dog Report"|| $(this).val()==="Reporting Found Dog" ){
                                
                                $("#strayInfo").css('display','block');
                                
                        } else {
                                $("#strayInfo").css('display','none');
                        }
                }); */
                $("#mainForm").delegate("#problemNumber","change",function(e){
                        if($(this).val() != "street_cleaning_required"){
                                $("#LitteringWitness").css('display','none');
                                $("#litteringDt").css('display','none');
                                $("#timeLittering").css('display','none');
                                $("#litterPerp").css('display','none');
                                
                        } 
                });                                                                                                             
                $("#mainForm").delegate("#subServiceSelect","change",function(e){
                        var initial = document.getElementById("problemNumber").value
                        var second = $(this).val()
                        var type = document.getElementById('event-type')
                        if(initial === "graffiti" && second === "Offensive"){
                        type.value = "offensive_graffiti"
                         
                        }
                        else if(initial === "graffiti" && second === "Non Offensive"){
                        type.value = "non_offensive_graffiti"
                         
                        }
                        
                        else if(initial === "flyposting" && second === "Non Offensive"){
                        type.value = "non_offensive_flyposting"
                         
                        }
                        
                        else if(initial === "flyposting" && second === "Offensive"){
                        type.value = "offensive_flyposting"
                         
                        }
                        else if(initial === "Flytip"){type.value = initial}
                                else if (second==="Street Sign Cleaning"){type.value ="street_sign_clean"}
                                else if (second==="Street Sweeping Required"){type.value ="sweeping_required"}
                                else if (second==="Sweeper Bags Not Collected"){type.value ="sweeper_bags_not_collected"}
                                else if (second==="Bodily Fluids"){type.value ="bodily_fluids"}
                                else if (second==="Drug Paraphernalia"){type.value ="drug_paraphernalia"}
                                else if (second==="Dog Fouling"){type.value ="dog_fouling"}
                                else if (second==="Gum Removal"){type.value ="gum_removal"}
                                else if (second==="Street Washing"){type.value ="street_washing"}
                                else if (second==="Broken Glass"){type.value ="broken_glass"}
                                else if (second==="Litter Bin Overflowing"){type.value ="overflowing_litter_bin"}
                                else{type.value = second}
                        
if($(this).val() === "Dog Fouling" && initial ==="street_cleaning_required"){
                                $("#strayInfo").css('display','block');
                                $("#ownerInfo").css('display','block');
}
                                
                        else if ($(this).val() === "Reporting a Lost Dog"|| $(this).val()==="Roaming Dog Report"|| $(this).val()==="Reporting Found Dog"){
                                $("#strayInfo").css('display','block');
                                $("#ownerInfo").css('display','none');
                        }
                                
                         else {
                                $("#strayInfo").css('display','none');
                                $("#ownerInfo").css('display','none');
                        }
                        
                        /* if($(this).val() === "Reporting a Lost Dog"|| $(this).val()==="Roaming Dog Report"|| $(this).val()==="Reporting Found Dog"){
                                $("#strayInfo").css('display','block');
                                $("#ownerInfo").css('display','none');
                                
                        } else {
                                $("#strayInfo").css('display','none');
                                $("#ownerInfo").css('display','none');
                        } */
                        
                        
                });
                
                $("#mainForm").delegate("#subServiceSelect","change",function(e){
                        if($(this).val() == "Witnessed Littering Offence"){
                                //$("#LitteringWitness").css('display','block');
                                $("#litteringDt").css('display','block');
                                $("#timeLittering").css('display','block');
                                $("#litterPerp").css('display','block');
                                
                        } else {
                                $("#LitteringWitness").css('display','none');
                                $("#litteringDt").css('display','none');
                                $("#timeLittering").css('display','none');
                                $("#litterPerp").css('display','none');
                        }
                });
                /* $("#mainForm").delegate("#did-you-witness-the-littering-take-place","change",function(e){
                        if($(this).val() === "true"){
                                $("#incidentDt").css('display','block');
                                $("#timeIncident").css('display','block');
                                $("#litterPerp").css('display','block');
                                
                                
                        }
                        
                        else {
                                $("#incidentDt").css('display','none');
                                $("#timeIncident").css('display','none');
                                $("#litteringDt").css('display','none');
                                $("#timeLittering").css('display','none');
                                $("#litterPerp").css('display','none');
                        }
                }); */
                
                $("#mainForm").delegate(".js-witness select","change",function(e){
                        if($(this).val() === "true"){
                                $(".js-perp__details").show();
                        } else {
                                $(".js-perp__details").hide();
                        }
                });
                $("#mainForm").delegate("#2-was-this-avoidable-contact","change",function(e){
                        if($(this).val() === "Yes"){
                                $("#js-avoidable-reason").css('display','block');
                        } else {
                                $("#js-avoidable-reason").css('display','none');
                        }
                });
                
                $("#mainForm").delegate("#problemNumber","change",function(e){
                        if($(this).val() == "abandoned_trolley"){
                                $(".js-trolley").show();
                                $(".js-trolleyw").show();
                                $("#flyLand").css('display','block');
                        } else {
                                $(".js-trolley").hide();
                                $(".js-trolleyw").hide();
                                $("#flyLand").css('display','none');
                        }
                });
                
                $("#mainForm").delegate("#problemNumber","change",function(e){
                        if($(this).val() == "street_park_furniture_issue"){
                                $("#postRef").css('display','block');
                                
                        } else {
                                $("#postRef").css('display','none');
                                
                        }
                });
                //show hidden land field
                $("#mainForm").delegate("#problemNumber","change",function(e){
                        if($(this).val() === "damaged_missing_st_sign"){
                        
                                $("#flyLand").css('display','block');
                                
                        } else {
                                $("#flyLand").css('display','none');
                                
                        }
                });
                $("#mainForm").delegate("#problemNumber","change",function(e){
                        if($(this).val() === "Flytip"||$(this).val() ===  "abandoned_trolley"){
                        
                                $("#flytipLand").css('display','block');
                                
                        } else {
                                $("#flytipLand").css('display','none');
                                
                        }
                });
                
                $("#mainForm").delegate("#problemNumber","change",function(e){
                        if($(this).val() == "street_cleaning_required"){
                                $("#flyLand").css('display','block');
                                
                        } 
                });
                $("#mainForm").delegate("#problemNumber","change",function(e){
                        self.populateSubServiceSelect();
                        if($(this).val() == "litter_dog_bin_issue"){
                                $("#binRef").css('display','block');
                                
                        } else {
                                $("#binRef").css('display','none');
                                
                        }
                });
                $('#something-else').hide();
                
                
                
                //show and hide the form based on if 'Something else' option is selected
                $('#problemNumber').on('change', function(){
                        $this_select = $(this);
                        if($this_select.val() == 'tree'){
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
        
     populateSubServiceSelect: function() {
            const serviceSelect = document.getElementById("problemNumber");
            const subServiceSelect = document.getElementById("subServiceSelect");
            const subServiceLabel = document.getElementById("subServiceLabel");
                        const optional = document.getElementById("Optional")

            // Clear previous options
            subServiceSelect.innerHTML = "";

            // Options for the sub-service based on the selected service
            const selectedService = serviceSelect.value;
            let subServiceOptions = [];

            if (selectedService === "street_cleaning_required") {
                subServiceOptions = ["Select Option","Bodily Fluids", "Broken Glass", "Dog Fouling", "Drug Paraphernalia","Gum Removal","Litter","Witnessed Littering Offence","Street Sweeping Required","Street Washing","Sweeper Bags Not Collected"];
            } else if (selectedService === "flyposting") {
                subServiceOptions = [ "Select Option","Non Offensive", "Offensive"];
            } else if (selectedService ==="graffiti"){
                                 subServiceOptions = ["Select Option","Non Offensive", "Offensive"];
                        } else if (selectedService ==="damaged_missing_st_sign"){
                                 subServiceOptions = ["Select Option","Graffiti/marks Obscuring Sign", "Street Sign Cleaning"];
                        } else if (selectedService ==="litter_dog_bin_issue"){
                                 subServiceOptions = ["Select Option","Litter Bin Overflowing","Litter Bin Needs Repair"];
                        } else if (selectedService === "lost_dog"){
                 subServiceOptions = ["Select Option","Reporting a Lost Dog","Roaming Dog Report","Reporting Found Dog"];
                        } 
                         else if (selectedService === "street_park_furniture_issue"){
                 subServiceOptions = ["Select Option","Broken Street Lighting"];
                        } 
            // Populate the sub-service dropdown
            subServiceOptions.forEach(option => {
                const opt = document.createElement("option");
                opt.value = option;
                opt.textContent = option;
                subServiceSelect.appendChild(opt);
            });

            // Show the sub-service dropdown if needed
            if (subServiceOptions.length > 0) {
                subServiceSelect.style.display = "block";
                subServiceLabel.style.display = "block";
                                optional.style.display = "block";
            } else {
                subServiceSelect.style.display = "none";
                subServiceLabel.style.display = "none";
                                optional.style.display = "none";
            }
        },
                
                
        
        searchForStreets: function(searchStr) {
                var self = this;
                
                $(".js-street-search-ajax").show();
                $("#address-results").hide();
                
                //make the ajax call
                $.ajax({
    url: "https://api.northampton.digital/vcc/getstreetbyname",
    type: "GET",
    dataType: "JSON",
    data: {
        StreetName: searchStr
    },
    success: function (data) {
        if (data.results.length > 0) {
            // Filter data.results based on searchStr
            var filteredResults = data.results.filter(function (result) {
                // Perform a case-insensitive search within the address
                var address = result[1].toLowerCase();
                return address.includes(searchStr.toLowerCase());
                                
            });

            // Call another function and pass the filtered results as a parameter
            self.showPropertyList(filteredResults);
        } else {
            $(".js-street-noresults").show();
        }
        $(".js-street-search-ajax").hide();
    },
    error: function (jqXHR, textStatus, errorThrown) {
        // Show error for no results
        $(".js-street-noresults").show();
        $(".js-street-search-ajax").hide();
    }
});



        },


// Define the showPropertyList function
 showPropertyList: function(filteredResults) {
    var html = '<option value=""' + '>' + 'Please select' + '</option>';
    var usrnField = document.getElementById("usrn");
    // Get the element for displaying the number of streets
    var numofStreets = document.getElementById("numofStreets");

    // Create a function to update the usrn value
    function updateUsrn() {
        var selectedIndex = document.getElementById("objectId").selectedIndex;
        if (selectedIndex !== -1) {
            var selectedOption = document.getElementById("objectId").options[selectedIndex];
            var selectedUsrn = selectedOption.value;
            usrnField.value = selectedUsrn;
        } else {
            usrnField.value = "";
        }
    }

    // Get the value of the "threeWordsUsed" input field
    var wordsused = document.getElementById("threeWordsUsed").value;

    if (wordsused != "") {
        var address = filteredResults[0][1]; // Include town in the address
        var usrn = filteredResults[0][0];
        html += '<option value="' + usrn + '">' + address + '</option>';
        usrnField.value = usrn;
        $("#objectId").html(html).change();
        $("#address-results").show();
        numofStreets.innerHTML = 1;
    } else {
        // Generate options for the select element
        for (var i = 0; i < filteredResults.length; i++) {
                        
            var address = filteredResults[i][1] + ', ' + filteredResults[i][4]; // Include town in the address
            var usrn = filteredResults[i][0];
            html += '<option value="' + usrn + '">' + address + '</option>';
            numofStreets.innerHTML = filteredResults.length;
        }
        // Update the HTML elements and show/hide as needed
        $("#objectId").html(html).change();
        $("#address-results").show();
    }

    // Add an event listener to the select element to update usrn
    $("#objectId").on("change", updateUsrn);

    // Initialize the usrn value
    updateUsrn();
},



        
        createMap: function() {
                var self = this;
                
                //find the container and create the map.
                var mapCanvas = document.getElementById("map_canvas");
                var mapCenter = new google.maps.LatLng(52.23740,-0.89463);
                var mapOptions = {
                                center: mapCenter,
                                zoom: 16,
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
                                                 },

                                                 {
                                                        "featureType": "all",
                                                        "elementType": "labels.icon",
                                                        "stylers": [
                                                                                { "visibility": "off" }
                                                                                ]
                                                }
                                                 ]
                };

                var sw = new google.maps.LatLng(51.978081,-1.335230);
                var ne = new google.maps.LatLng(52.474872,-0.696731);
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
                fetch('Data/wncboundary.geojson')
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok ' + response.statusText);
                        }
                        return response.json();
                    })
                    .then(data => {
                        self.map.data.addGeoJson(data);

                        // Set style for the polygons
                        self.map.data.setStyle({
                            fillColor: '#FFFFFF', // Fill color
                            fillOpacity: 0.4, // Fill opacity
                            strokeColor: '#000000', // Stroke color
                            strokeWeight: 2 // Stroke weight
                        });

                        // Initialize polygonPaths as an array
                        self.polygonPaths = [];

                        // Extract polygon paths from GeoJSON data
                        self.map.data.forEach(function(feature) {
                            if (feature.getGeometry().getType() === 'Polygon') {
                                feature.getGeometry().getArray().forEach(function(path) {
                                    self.polygonPaths.push(path.getArray());
                                });
                            }
                        });

                        
                    })
                    .catch(error => console.error('Error loading GeoJSON:', error));
                                        /* /* document.getElementById('locationButton').addEventListener('click', function() {
                                                self.useMyLocation(); 
                                        }); */

                                        
                
        
        },
        
        //listens for changes to the map marker and updates address to the nearest reverse geocoded address
        addMarkerListener: function(mapMarker) {
                var self = this;
                
                //listen for the marker being dragged
                google.maps.event.addListener(mapMarker, 'dragend', function() {

                        var ll = mapMarker.getPosition();
                        var ll = mapMarker.getPosition();
                        if (self.polygonPaths.length > 0) {
                                insidePolygon = self.polygonPaths.some(function(path) {
                                        return google.maps.geometry.poly.containsLocation(ll, new google.maps.Polygon({paths: path}));
                                });
                        }

                        if (insidePolygon) {
                                lastPosition = ll;
                        } else {
                                var lastValidLat = parseFloat(document.getElementById('lat').value);
                                var lastValidLng = parseFloat(document.getElementById('lng').value);
                                var lastValidPosition = new google.maps.LatLng(lastValidLat, lastValidLng);
                                /* ll = new google.maps.LatLng(52.23740, -0.89463 );*/
                                self.mapMarker.setPosition(lastValidPosition);
                                self.map.panTo(lastValidPosition);
                                window.alert("You have selected a location that is not within the West Northants boundaries. Please retry.");
                        }


                        //find the address from latlng
                        self.geocoder.geocode({'latLng':ll}, function (results, status) {
                                
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
                        self.lookupSovereign(ll.lat(), ll.lng());
                });

                        ;
        },
        setCurrentLocation: function(ll, address) {
                $("#lat").val(ll.lat());
                $("#lng").val(ll.lng());
                $("#problem-address").val(address);
        },
        lookupSovereign: function(lat, lng) {
                $.ajax({
                        url: "https://api.westnorthants.digital/sovereign-finder/ProdSovereignWestLookup",
                        type: "GET",
                        dataType: "JSON",
                        data: {
                                latitude: lat,
                                longitude: lng
                        },
                        success: function(data) {
                                var sov = document.getElementById("sovereign");
                                if (data.Status === "OK") {
                                        var sovData = data.Name;
                                        sov.value = (sovData === "South Northamptonshire") ? "south-northants" : sovData;
                                } else {
                                        sov.value = "unknown";
                                }
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                                $(".js-street-noresults").show();
                                $(".js-street-search-ajax").hide();
                        }
                });
        },
        
        whatthreewords: function () {
                var self = this;
                var words = document.getElementById("search-street").value
                var wordsused = document.getElementById("threeWordsUsed")
                var threeWLatLong = document.getElementById("threeLatLong")
                
                 
$.ajax({
                        url:"https://api.what3words.com/v3/convert-to-coordinates?key=" + CONFIG.WHAT3WORDS_API_KEY,
                        type:"GET",
                        dataType:"JSON",
                        data:{words: words },
                        success: function(data)
                        {
                        var threelat =data.coordinates.lat
                        var threelng = data.coordinates.lng
                        wordsused.value = words
                        
                        
                        threeLatLong =  new google.maps.LatLng(threelat, threelng);
                        threeWLatLong.value = threeLatLong
                        self.geocoder.geocode({'latLng':threeLatLong}, function (results, status) {
                                if (status == google.maps.GeocoderStatus.OK) {
                                        if (results[0]){
                                                var threestreet = results[0].address_components[1].long_name
                                                var threearea = results[0].address_components[2].long_name
                                                searchStr = threestreet+","+threearea
                                                // populate form field with google's result
                                                self.setCurrentLocation(threeLatLong,results[0].formatted_address);
                                                        $.ajax({
                        url:"https://api.northampton.digital/vcc/getstreetbylatlng",
                        type:"GET",
                        dataType:"JSON",
                        data:{
                                lat: threelat,
                                lng: threelng
                                
                        },
                        
                        success: function(data){
                                
                                if(data.results.length > 0 ){
                                        var streetN = data.results[0][1];
                                        $(".js-street-search-ajax").hide();
                                        self.showPropertyList(data.results); 
                                } else {
                                        
                                        $(".js-street-noresults").show();
                                        $(".js-street-search-ajax").hide();
                                }
                        },
                        error: function(jqXHR, textStatus, errorThrown){
                                // show error for no results
                                $(".js-street-noresults").show();
                                $(".js-street-search-ajax").hide();
                        }
                });
                                        }
                                }
                        })
                                
                        if (threeLatLong !=null){
                                        self.setCurrentLocation(threeLatLong);
                                        self.updateMarker(threeLatLong);
                                        self.mapBounds.contains(threeLatLong) ? lastPosition = threeLatLong:[threeLatLong=(new google.maps.LatLng(52.23740,-0.89463)),self.mapMarker.setPosition(new google.maps.LatLng(52.23740,-0.89463)),self.map.panTo(threeLatLong),window.alert("You have selected a location that is not in the Borough Council boundaries. Please retry.")];
                                }
                        
                                
                        },
                        error: function(jqXHR, textStatus, errorThrown){}
                });
         
        },
        
        
        searchGoogleForStreet: function(searchStr) {
                var self = this;
                var threeWUsed = document.getElementById("threeWordsUsed").value
                        var threeLat = document.getElementById("threeLatLong").value
                if(searchStr.toLowerCase()=='ringway, northampton'){
                        searchStr='Ring Way, Northampton';
                }
                $.ajax({
                        url:"https://api.northampton.digital/vcc/getstreetbyname",
                        type:"GET",
                        dataType:"JSON",
                        data:{streetName: searchStr  },
                        success: function(data)
                        {

                                if(data.results.length > 0 ) 
                                {
                                        var myJSON = data.results;
                                        
                                        var index =myJSON.length
                                        
                                

                                        for (var i = 0; i <index; i++) {
                                                
                                                //Do something
                                        if (myJSON[i][1] === searchStr )  {
                                                var j = i
                                                var ourLat=myJSON[i][2]
                                                var ourLong =myJSON[i][3]
                                                //{break}
                                                $.ajax({
    url: "https://api.westnorthants.digital/sovereign-finder/ProdSovereignWestLookup",
    type: "GET",
    dataType: "JSON",
    data: {
        latitude: ourLat,
        longitude: ourLong
    },
    success: function (data) {
        if (data.Status = "OK") {
                var sov = document.getElementById("sovereign")
                var sovData =data.Name
                if (sovData ==="South Northamptonshire"){
                sov.value="south-northants"} else{
                sov.value=sovData}
        
        } else {
            sov.value="unknown"
        }
    },
    error: function (jqXHR, textStatus, errorThrown) {
        

        // show error for no results
        $(".js-street-noresults").show();
        $(".js-street-search-ajax").hide();
    }
});

                                        }       else  if (myJSON[i][1]+', '+myJSON[i][4] === searchStr) {var j = i
                                        ourLat = data.results[j][2];
                                 ourLong = data.results[j][3];
                                 ourLatLong =  new google.maps.LatLng(ourLat, ourLong);
                                        $.ajax({
    url: "https://api.westnorthants.digital/sovereign-finder/ProdSovereignWestLookup",
    type: "GET",
    dataType: "JSON",
    data: {
        latitude: ourLat,
        longitude: ourLong
    },
    success: function (data) {
        if (data.Status = "OK") {
                var sov = document.getElementById("sovereign")
                var sovData =data.Name
                if (sovData ==="South Northamptonshire"){
                sov.value="south-northants"} else{
                sov.value=sovData}
        } else {
            sov.value ="Unknown"
        }
    },
    error: function (jqXHR, textStatus, errorThrown) {
        
        // show error for no results
        $(".js-street-noresults").show();
        $(".js-street-search-ajax").hide();
    }
});

                                        }
                                 /* ourLat = data.results[j][2];
                                 ourLong = data.results[j][3];
                                 ourLatLong =  new google.maps.LatLng(ourLat, ourLong); */
                                
                                 }
                                
                                searchStr = searchStr;
                                address = searchStr;
                                ;}
                                if (threeWUsed =="") {
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
                $("#problem-address").val(address);
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
                
                
                
                if(this.model.objectId.length <= 0 || this.model["problem-street"].length <= 0) {
                        valid = false;
                        $(".js-objectId-empty").show();
                        $(".js-street-empty").show();
                }
                
                if(this.model.lat.length <= 0 || this.model.lng.length <= 0 || this.model.problem-address.length <= 0) {
                        valid = false;
                        $(".js-map-error").show();
                }
                if (document.getElementById("trolleyMarket").style.display !== 'none') {
  // Check if the field is not empty and is not hidden
                if (this.Validation.isEmpty(this.model.retailer)) {
                valid = false;
                $(".js-retail").show();
  }
}

        if (document.getElementById("trolleyWater").style.display !== 'none') {
  // Check if the field is not empty and is not hidden
                if (this.Validation.isEmpty(this.model['is-the-trolley-in-the-water'])) {
                valid = false;
                $(".js-water").show();
  }
}
        if (document.getElementById("Witness").style.display !== 'none') {
        
                if(this.Validation.isEmpty(this.model['did-you-witness-the-flytip-take-place-or-have-further-evidence-information'])) {
                        valid = false;
                        $(".js-witness").show();
                }
        }
        
        if (document.getElementById("subServiceSelect").value === 'Reporting a Lost Dog'|| document.getElementById("subServiceSelect").value === 'Roaming Dog Report'||document.getElementById("subServiceSelect").value === 'Reporting Found Dog') {
        
                if(this.Validation.isEmpty(this.model['please-give-details-of-the-dog'])) {
                        valid = false;
                        $(".js-dogDets").show();
                }
        }
        
        if(this.Validation.isEmpty(this.model['additional-location-information'])) {
                        valid = false;
                        $(".js-locDetails").show();
                }
        
        
        if (document.getElementById("litterPerp").style.display !== 'none') {
        
                if(this.Validation.isEmpty(this.model['please-give-as-much-information-of-who-you-witnessed-littering'])) {
                        valid = false;
                        $(".js-litWitness").show();
                       
                }
        }
        if (document.getElementById("flytipLand").style.display !== 'none') {
        
                if(this.Validation.isEmpty(this.model['flytip-type-of-land'])) {
                        valid = false;
                        $(".js-flyland-error").show();
                        
                }
        }
        
        if (document.getElementById("subServiceSelect").style.display !== 'none' && document.getElementById("subServiceSelect").value ==="Select Option") {
       
                valid = false;
        
    $(".js-subSelect").show();


        }
                
        if (this.model && this.model['first-name']) {
    if (this.Validation.isEmpty(this.model['first-name'])) {
        valid = false;
        $(".js-name").show();
    }
} else {
    // Handle the case where 'first-name' is undefined or falsy
    valid = false; // Set valid to false or handle the error appropriately
}
if (this.model && this.model.surname) {
    if (this.Validation.isEmpty(this.model.surname)) {
        valid = false;
        $(".js-name").show();
    }
} else {
    // Handle the case where 'first-name' is undefined or falsy
    valid = false; // Set valid to false or handle the error appropriately
}


                
                if(this.Validation.isEmpty(this.model['additional-information'])) {
                        valid = false;
                        $(".js-details").show();
                }

                return valid;
                
        },
        
        
        
        
        
//please-give-as-much-information-of-who-you-witnessed-littering
        updateModel: function() {
                // push all values from the form into the model
        for (var prop in this.model) {
    var $obj = $("#" + prop);

     if ($obj.attr("type") === "checkbox") {
        this.model[prop] = $obj.prop("checked") ? "yes" : "";
    } else {
        this.model[prop] = $obj.val() || "";
    } 
}

                
                // set the interaction id
                var interaction = nbcApp.Utils.getParameterByName("interactionId");
                this.model.interactionId = (interaction) ? interaction : "";
                
                // set the interaction id
                //var usrn = nbcApp.Utils.getParameterByName("usrn");
                //this.model.usrn = (usrn) ? usrn : "";
                
                //var userId = nbcApp.Utils.getParameterByName("userId");
                //this.model.userid = (userId) ? userId : "";
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
                
                                   
                //var userId = nbcApp.Utils.getParameterByName("userid");
                //this.model.userid = (userId) ? userId : "";
                
        var userid = nbcApp.Utils.getParameterByName("userid");
                if(userid.length > 0) {
                        $("#advisor").val(userid);
                }
                
        var personid = nbcApp.Utils.getParameterByName("personid");
                if(userid.length > 0) {
                        $("#personId").val(personid);
                }
                
        },
        
        hideSuccess: function(){
                $("#valLamp").hide();
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
        submitCase: function () {
    var testwindow = window.location.href;
    var url;
    if (testwindow.includes("test") || testwindow.includes("localhost") || testwindow.includes("Documents")) {
        url = "https://api-test.westnorthants.digital/crm/report-it/case/create";
    } else {
        url = "https://api.westnorthants.digital/crm/create/report-it";
    }

    var self = this;

    // Show a 'sending' message while the call is in progress and hide the main form
    $(window).scrollTop($("content").scrollTop());
    $("#mainForm").hide();
    $(".js-ajax-wait").show();

    // Make the first AJAX call
    $.ajax({
        url: url,
        type: "POST",
        dataType: "JSON",
        data: JSON.stringify(this.model),
        success: function (data) {
            // Handle the first API call's success
            // self.handleSuccess(data);

            // Introduce a 3-second delay before making the second API call
            setTimeout(function () {
                                if (testwindow.includes("test") || testwindow.includes("localhost") || testwindow.includes("Documents")) {
        url = "https://api-test.westnorthants.digital/crm/case/";
    } else {
        url = "https://ha6p3q65oc.execute-api.eu-west-2.amazonaws.com/Prod?reference=";
    }
                // Make the second AJAX call using the reference from the first call
                $.ajax({
                    url: url + data.reference,
                    type: "GET",
                    dataType: "JSON",
                    // data: JSON.stringify(data.reference), // You can use 'self.model' here if needed
                    success: function (datatwo) {
                        self.handleSuccess(data, datatwo);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        self.handleError(alert(errorThrown));
                    }
                });
            }, 3000); // Delay for 3 seconds (3000 milliseconds)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            self.handleError(alert(errorThrown));
        }
    });
},


        
        //handle a successful form submit
        handleSuccess: function(data, datatwo) {
                if (datatwo.slaDate !=null){
                this.showSuccess(data.reference,datatwo.slaDate);}
                else {this.showSuccess(data.reference,datatwo.slaText)
                        
                }
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
                if (/^\d/.test(date)) {
    // The date starts with a number
        output +="<p>We will aim to resolve this </p>";
    output += "<span class='caseDate'>" + date + "</span>";
        //output += '<span class="caseDateText"><a href="https://northamptonuat.q.jadu.net/q/case/' + caseRef + '/timeline">Return to CXM</a></span>';
} else if (date === "not available") {
    output += "<span>asap</span>";
        //output += '<span class="caseDateText"><a href="https://northamptonuat.q.jadu.net/q/case/' + caseRef + '/timeline">Return to CXM</a></span>';
} else {
        
   output +="<span class ='caseDateText'>"+date+"</span>"
   //output += '<span class="caseDateText"><a href="https://northamptonuat.q.jadu.net/q/case/' + caseRef + '/timeline">Return to CXM</a></span>';
}


                        /* output +="<p>We will aim to resolve this </p>";
                        if(date === "not available"){
                                output += "<span>asap</span>";
                        }else{
                                output +="<span class ='caseDate'>"+date+"</span>"; */



                $(".js-case-sla").html(output);
                $(".js-ajax-wait").hide();
                $(".js-confirmation").show();
                $(".js-case-sla").html(output);
                $("js-case-ref").show();
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

function noquote(){
        var x = document.getElementById("additional-information")
        x.value=x.value.replace(/"/g, '')

}



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


/* $("#postref").keyup( function() {
        var lampid = document.getElementById("postref").value;
        

        $.ajax({
                        url:"https://api.northampton.digital/vcc/getstreetlamp",
                        type:"GET",
                        dataType:"JSON",
                        data:{lightNumber: lampid},
                success: function(data){
                        var lamplen =lampid.length;
                                if(data.ScannedCount <= 0 && lamplen ==5 ){
                                        $("#valLamp").hide();
                                        $("#invLamp").show();
                                        $("#Submit").hide();
                                        
                                } else if(data.ScannedCount>=0 && lamplen == 5) {
                                        
                                        $("#invLamp").hide();
                                        $("#valLamp").show();
                                        $("#Submit").show();
                                }
                        },
                        error: function(jqXHR, textStatus, errorThrown){
                                console.log(textStatus);
                                // show error for no results
                                $("#invLamp").show();
                                $(".js-street-search-ajax").hide();
                        }               
                
        
        });

        
}); */

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString)
const idset = urlParams.has('userid');
const internal = document.getElementById("internal")
if (idset == true) {
    $("#internal").css('visibility', 'visible');
    $("#internal").css('display', 'block');
         $("#cxm").css('display', 'block');
}

        else{internal.style.visibility="hidden"
                 $("#cxm").css('display', 'none');
                }


//const avoidable = document.getElementById('js-avoidable')
//const contact = document.getElementById('js-contact')
//if(idset == true){avoidable.style.visibility="visible"; contact.style.visibility="visible" }else{avoidable.style.visibility="hidden" ; contact.style.visibility ="hidden"}


nbcApp.init();
