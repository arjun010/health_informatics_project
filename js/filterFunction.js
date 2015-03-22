function objectExistisInList(obj,list){
	for(var i=0;i<list.length;i++){
		if(obj==list[i]){
			return 1;
		}
	}
	return 0;
}

function applyFilters(){
	
	filteredEncounterData = [];
	var selectedJobs = [], selectedImmunizations = [];
	$('#immunizationoptionlist input:checked').each(function() {
    	selectedImmunizations.push($(this).attr('value'));
	});

	$('#joboptionlist input:checked').each(function() {
    	selectedJobs.push($(this).attr('value'));
	});

	var startYear = parseInt($("#daterangestart").val());
	var endYear = parseInt($("#daterangeend").val());

	var startAge = parseInt($("#agerangestart").val());
	var endAge = parseInt($("#agerangeend").val());


	var showBoth = 0, showMale = 0, showFemale = 0;
	if($("#genderboth").is(":checked")){
		showBoth = 1;
	}
	if($("#gendermale").is(":checked")){
		showMale = 1;
	}
	if($("#genderfemale").is(":checked")){
		showFemale = 1;
	}


	var married = 0, single = 0, separated = 0, divorced = 0;
	if($("#marriageactive").is(":checked")){
		married = 1;
	}
	if($("#marriagesingle").is(":checked")){
		single = 1;
	}
	if($("#marriageseparated").is(":checked")){
		separated = 1;
	}
	if($("#marriagedivorced").is(":checked")){
		divorced = 1;
	}
	//console.log(married,single,separated,divorced)
	//filteredEncounterData
	
	for(var i=0; i<allEncounters.length; i++){
		var currentEncounterAge = parseInt(allEncounters[i]['age']);
		var currentEncounterYear = parseInt(allEncounters[i]['encounterDate'].substring(0,4));
		var currentEncounterGender = allEncounters[i]['gender'].toLowerCase();
		var currentEncounterMarriageStatus = allEncounters[i]['marriage_status'];
		var currentEncounterImmunizationsList = allEncounters[i]['immunizations'];		
		var currentEncounterJob = allEncounters[i]['job'];
		var skipCurrent = 0;

		//age filter
		if(currentEncounterAge<startAge || currentEncounterAge>endAge){
			continue;
		}

		//year range filter
		if(currentEncounterYear<startYear || currentEncounterYear>endYear){
			continue;
		}
		
		//immunization filter
		for(var j=0;j<selectedImmunizations.length;j++){
			var vaccine = selectedImmunizations[j];
			if(objectExistisInList(vaccine,currentEncounterImmunizationsList)==1){				

			}else{
				skipCurrent=1;
				break;
			}
		}
		if(skipCurrent==1){
			continue;
		}

		//job filter
		if(objectExistisInList(currentEncounterJob,selectedJobs)==0){
			continue;
		}

		//gender filter
		if(showBoth==1){
			filteredEncounterData.push(allEncounters[i]);
		}else if(showMale==1){
			if(currentEncounterGender=="male"){
				filteredEncounterData.push(allEncounters[i]);
			}else{
				continue;
			}
		}else if(showFemale==1){
			if(currentEncounterGender=="female"){
				filteredEncounterData.push(allEncounters[i]);
			}else{
				continue;
			}
		}
	}	
	//console.log(filteredEncounterData.length)
	

	//BUBBLE CHART FUNCTION CALL HERE
	//drawBubbleChart(); //use the filteredEncounterData variable - it is global
}