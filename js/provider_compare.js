function compareProviders(){
	var provider1 = $("#provider1").val();
	var provider2 = $("#provider2").val();
	
	var provider1LabCount = {},provider2LabCount={},provider1DrugCount={},provider2DrugCount={},provider1ConsulCount={},provider2ConsulCount={};
	provider1LabCount[provider1]=0; 
	provider2LabCount[provider2]=0; 
	provider1DrugCount[provider1]=0; 
	provider2DrugCount[provider2]=0; 
	provider1ConsulCount[provider1]=0; 
	provider2ConsulCount[provider2]=0; 
	for(var i=0;i<allEncounters.length;i++){
		if(allEncounters[i].providerId==provider1){
			if(allEncounters[i].drugPrescribed!=""){
				provider1DrugCount[provider1]+=1;
			}else if(allEncounters[i].labTest!=""){
				provider1LabCount[provider1]+=1;
			}else if(allEncounters[i].consultOrdered!=""){
				provider1ConsulCount[provider1]+=1;
			}
		}else if(allEncounters[i].providerId==provider2){
			if(allEncounters[i].drugPrescribed!=""){
				provider2DrugCount[provider2]+=1;
			}else if(allEncounters[i].labTest!=""){
				provider2LabCount[provider2]+=1;
			}else if(allEncounters[i].consultOrdered!=""){
				provider2ConsulCount[provider2]+=1;
			}
		}
	}

	var formattedDataMap = [{"key":providerIdNameMap[provider1],"color":"#1f77b4","values":[{"label":"Drugs Prescribed","value":provider1DrugCount[provider1]},{"label":"Lab Tests","value":provider1LabCount[provider1]},{"label":"Consults ordered","value":provider1ConsulCount[provider1]}]},
							{"key":providerIdNameMap[provider2],"color":"#4DB84D","values":[{"label":"Drugs Prescribed","value":provider2DrugCount[provider2]},{"label":"Lab Tests","value":provider2LabCount[provider2]},{"label":"Consults ordered","value":provider2ConsulCount[provider2]}]}];
	drawProviderComparison(formattedDataMap);
}


function drawProviderComparison(dataToUse){
	
  nv.addGraph(function() {
    var chart = nv.models.multiBarHorizontalChart()
        .x(function(d) { return d.label })
        .y(function(d) { return d.value })
        .margin({top: 30, right: 20, bottom: 50, left: 175})
        .showValues(true)           //Show bar value next to each bar.
        .tooltips(true)             //Show tooltips on hover.
        .showControls(true)
        .color(function(d){return d.color });        //Allow user to switch between "Grouped" and "Stacked" mode.

    chart.yAxis
        .tickFormat(d3.format(',.2f'));

    d3.select('#providerencountercompare svg')
        .datum(dataToUse)
        .call(chart);


    nv.utils.windowResize(chart.update);

    return chart;
  });

}