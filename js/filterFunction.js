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
	filteredChronologicalVisData = [];

	var selectedJobs = [], selectedImmunizations = [], selectedMaritialStatuses = [];
	$('#immunizationoptionlist input:checked').each(function() {
    	selectedImmunizations.push($(this).attr('value'));
	});

	$('#joboptionlist input:checked').each(function() {
    	selectedJobs.push($(this).attr('value'));
	});

	$('#marriagestatusoptionlist input:checked').each(function() {
    	selectedMaritialStatuses.push($(this).attr('value'));
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
			if(objectExistisInList(currentEncounterMarriageStatus,selectedMaritialStatuses)==1){
				filteredEncounterData.push(allEncounters[i]);
			}			
		}else if(showMale==1){
			if(currentEncounterGender=="male"){
				if(objectExistisInList(currentEncounterMarriageStatus,selectedMaritialStatuses)==1){
					filteredEncounterData.push(allEncounters[i]);
				}
			}else{
				continue;
			}
		}else if(showFemale==1){
			if(currentEncounterGender=="female"){
				if(objectExistisInList(currentEncounterMarriageStatus,selectedMaritialStatuses)==1){
					filteredEncounterData.push(allEncounters[i]);
				}
			}else{
				continue;
			}
		}
	}
	//console.log(filteredEncounterData.length)
	for(var i=0; i<encounterHistoryData.length; i++){
		var currentEncounterAge = parseInt(encounterHistoryData[i]['age']);
		var currentEncounterGender = encounterHistoryData[i]['gender'].toLowerCase();
		var currentEncounterMarriageStatus = encounterHistoryData[i]['marriage_status'];
		var currentEncounterImmunizationsList = encounterHistoryData[i]['immunizations'];		
		var currentEncounterJob = encounterHistoryData[i]['job'];
		var skipCurrent = 0;		
		//age filter
		if(currentEncounterAge<startAge || currentEncounterAge>endAge){
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
			if(objectExistisInList(currentEncounterMarriageStatus,selectedMaritialStatuses)==1){
				filteredChronologicalVisData.push(encounterHistoryData[i]);
			}			
		}else if(showMale==1){
			if(currentEncounterGender=="male"){
				if(objectExistisInList(currentEncounterMarriageStatus,selectedMaritialStatuses)==1){
					filteredChronologicalVisData.push(encounterHistoryData[i]);
				}
			}else{
				continue;
			}
		}else if(showFemale==1){
			if(currentEncounterGender=="female"){
				if(objectExistisInList(currentEncounterMarriageStatus,selectedMaritialStatuses)==1){
					filteredChronologicalVisData.push(encounterHistoryData[i]);
				}
			}else{
				continue;
			}
		}
	}
	for(var i=0;i<filteredChronologicalVisData.length;i++){
		var currentEncounterList = filteredChronologicalVisData[i]["encounterList"];
		var filteredEncounterList = [];
		for(var j=0;j<currentEncounterList.length;j++){
			var currentEncounterYear = parseInt(currentEncounterList[j]["date"].split("-")[0]);
			if(currentEncounterYear>=startYear && currentEncounterYear<=endYear){
				filteredEncounterList.push(currentEncounterList[j])
			}
		}
		filteredChronologicalVisData[i]["encounterList"] = filteredEncounterList;
		filteredChronologicalVisData[i]["encounterCount"] = filteredEncounterList.length;
	}
	
	$("#membercounttext").html("<h1>Patients: <span style='color:#029eca'>" + filteredChronologicalVisData.length + "</span></h1>");

	d3.select("#bubbleChart").selectAll("svg").remove();
	d3.select('#barlabtest').selectAll('svg').remove();
	d3.select('#bardrugs').selectAll('svg').remove();
	d3.select('#visittypedougnut').selectAll('svg').remove();
	d3.select('#visithistogram').selectAll('svg').remove();
	$("#selected-bubble").html("");
	$("#patients-in-condition-cohort").html("");	
	$(".visittypesheading").remove();
	activeCondition = "";
	//console.log(filteredEncounterData.length)
	//BUBBLE CHART FUNCTION CALL HERE
	//drawBubbleChart(); //use the filteredEncounterData variable - it is global
	bubbleChart(filteredEncounterData);
	//draw_charts_all();	
}

function filterByCondition(condition){


	//bar charts :
	
	filteredEncounterDataByCondition = [];
	filteredMemberDataByCondition = [];
	for(var i=0;i<filteredEncounterData.length;i++){
		var currentCondition = filteredEncounterData[i]['condition'];
		if(currentCondition==condition){
			filteredEncounterDataByCondition.push(filteredEncounterData[i]);
		}
	}
	$("#selected-bubble").html("<h3>Selected Condition: <span style='color:#029eca'>" + condition + "</span></h3>");
	var labtestarray = [{"values":[]}];
	var allLabTestNames = [];
	var drugPrescribedArray = [{"values":[]}];
	var allDrugNames = [];
	for(var i=0;i<filteredEncounterDataByCondition.length;i++){
		if(filteredEncounterDataByCondition[i]["labTest"]!=""){
			//console.log(filteredEncounterDataByCondition[i])
			try {
				//console.log(allLabTestNames)
			    if(objectExistisInList(filteredEncounterDataByCondition[i]["labTest"],allLabTestNames)!=1){
					allLabTestNames.push(filteredEncounterDataByCondition[i]["labTest"]);
				}
			}
			catch(err) {
			    console.log(err.message);
			}			
		}
		if(filteredEncounterDataByCondition[i]["drugPrescribed"]!=""){
			//console.log(filteredEncounterDataByCondition[i])
			try {
				//console.log(allLabTestNames)
			    if(objectExistisInList(filteredEncounterDataByCondition[i]["drugPrescribed"],allDrugNames)!=1){
					allDrugNames.push(filteredEncounterDataByCondition[i]["drugPrescribed"]);
				}
			}
			catch(err) {
			    console.log(err.message);
			}			
		}
	}
	var labTestCountMap = {};
	for(var i =0 ;i<allLabTestNames.length;i++){
		labTestCountMap[allLabTestNames[i]] = 0;
	}
	var drugCountMap = {};
	for(var i =0 ;i<allDrugNames.length;i++){
		drugCountMap[allDrugNames[i]] = 0;
	}

	for(var i=0;i<filteredEncounterDataByCondition.length;i++){
		try {
			labTestCountMap[filteredEncounterDataByCondition[i]["labTest"]]+=1;
			drugCountMap[filteredEncounterDataByCondition[i]["drugPrescribed"]]+=1;
		}
		catch(err) {
		    console.log(err.message);
		}		
	}

	for(var i=0;i<allLabTestNames.length;i++){
		labtestarray[0]["values"].push({"label":allLabTestNames[i],"value":labTestCountMap[allLabTestNames[i]]});
	}
	for(var i=0;i<allDrugNames.length;i++){
		drugPrescribedArray[0]["values"].push({"label":allDrugNames[i],"value":drugCountMap[allDrugNames[i]]});
	}
	//console.log(labtestarray)
	//draw_charts_all();
	drawLabTestBar(clone(labtestarray));
	drawDrugsBar(clone(drugPrescribedArray));
	

	// condition-cohort patient counts:
	var count = 0;
	//console.log(filteredChronologicalVisData.length)
	for(var i=0;i<filteredChronologicalVisData.length;i++){
		var curPatientEncounterList = filteredChronologicalVisData[i]["encounterList"];
		for(var j=0;j<curPatientEncounterList.length;j++){
			if(curPatientEncounterList[j]["complain"]==condition){
				count += 1;
				break;
			}
		}		
	}
	$("#patients-in-condition-cohort").html("<h3>Number of patients: <span style='color:#029eca'>" + count + "</span></h3>");
	

	//histogram code:
	var filteredPatientEncounterList = [];
	for(var i=0;i<filteredChronologicalVisData.length;i++){
		filteredPatientEncounterList = [];
		var currentEncounterList = filteredChronologicalVisData[i]['encounterList'];
		for(var j=0; j<currentEncounterList.length; j++){
			if(currentEncounterList[j]['complain']==condition){
				//console.log("1:"+currentEncounterList[j]['complain'])
				//console.log(condition)
				filteredPatientEncounterList.push(currentEncounterList[j])
			}
		}
		//console.log(currentEncounterList)
		//var temp = filteredChronologicalVisData[i];
		var temp = JSON.parse(JSON.stringify(filteredChronologicalVisData[i]));
		temp['encounterList'] = filteredPatientEncounterList;
		temp['encounterCount'] = temp['encounterList'].length;
		//console.log(temp)
		filteredMemberDataByCondition.push(temp);
	}
	//generate_histogram("#visithistogram");
	//console.log(filteredMemberDataByCondition.length)
	//console.log(filteredMemberDataByCondition)


	// donut chart code:
	var mapForDonut = {};	
	var coveredVisitTypes = [];
	for(var i=0;i<filteredEncounterData.length;i++){
		if(objectExistisInList(filteredEncounterData[i]['visit_type'],coveredVisitTypes)==0){
			if(filteredEncounterData[i]['condition']==condition){
				mapForDonut[filteredEncounterData[i]['visit_type']] = 0;
				coveredVisitTypes.push(filteredEncounterData[i]['visit_type']);
			}
		}
	}
	//console.log(mapForDonut)
	var mapLabels = Object.keys(mapForDonut);
	for(var i=0;i<filteredEncounterData.length;i++){
		var currentVisitType = filteredEncounterData[i]['visit_type'];
		if(objectExistisInList(currentVisitType,mapLabels)==1){
			mapForDonut[currentVisitType]+=1;
		}
	}
	var formattedOutputForDonut = [];
	
	for(var i=0;i<mapLabels.length;i++){
		formattedOutputForDonut.push({"label":mapLabels[i],"value":mapForDonut[mapLabels[i]]});
	}
	//console.log(mapForDonut)
	//drawDonutChart(mapForDonut);
	drawVisitTypeDonut(clone(formattedOutputForDonut));
	
}
