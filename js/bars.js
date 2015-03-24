bars_data=
[
  {
    "Name":"Meddcw1",
    "Value":"34"
  },
  {
    "Name":"Med54ter2",
    "Value":"65"
  },
  {
    "Name":"Med343444",
    "Value":"88"
  },
  {
    "Name":"Med 453",
    "Value":"14"
  }, 
  {
    "Name":"Med 553",
    "Value":"67"
  },
  {
    "Name":"Med 234",
    "Value":"98"
  }
]

function draw_charts_all(){
	draw_chart('#barlabtest');
	draw_chart('#bardrugs');
	generate_histogram('#visithistogram');
}


function draw_chart(div_id){

	//d3.json("data/encounters.json", function(error, d) {
		
		var dict = [];
		var data = [];
		
		var temp_data = filteredEncounterData;
		var entry_limit=0, bar_label="", label_x = 0;
		temp_data.forEach(function(d) {
			if(div_id == '#barlabtest'){
				entry_limit=50, bar_label="Lab Test Categories", label_x = 150;
				if(d.labTest != "")
					dict[d.labTest] = (dict[d.labTest] || 0) + 1;}
			if(div_id == '#bardrugs'){
				entry_limit=10, bar_label="Drugs Prescribed", label_x = 400;
				if(d.drugPrescribed != "")
					dict[d.drugPrescribed] = (dict[d.drugPrescribed] || 0) + 1;}
		});
		
		max_value=0;
		for (var key in dict) {
			if(dict[key] > 50){
				if(max_value < dict[key]) max_value = dict[key];        
				data.push({Name: String(key), Value: Number(dict[key])});
			}
		}
		//console.log(dict);
		//console.log(data);
		var margin = {top: 80, right: 20, bottom: 80, left: 50},
			width = 860 - margin.left - margin.right,
			height = 400 - margin.top - margin.bottom;
			
		var formatPercent = d3.format(".0%");

		var x = d3.scale.ordinal().rangeRoundBands([0, width-5], .10, .30);
		var y = d3.scale.linear().range([height, 0]);

		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			.ticks(12);
			
		var tip = d3.tip()
		  .attr('class', 'd3-tip')
		  .offset([-10, 0])
		  .html(function(d) {
			return "<strong>Value:</strong> <span style='color:Gold'>" + d.Value + "</span>";
		  })
	  	  	  
	  x.domain(data.map(function(d) { return d.Name; }));
	  //y.domain([0, d3.max(data, function(d) { return d.Value; })]);
	  y.domain([0, max_value]);
	  
	  
	  var svg = d3.select(div_id).append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	  
	  svg.call(tip);
	  
	  svg.append("text")
		  .attr("class", "title")
		  .attr("x", -50)
		  .attr("y", -16)
		  .text("Count");
		  
	  svg.append("text")
		  .attr("class", "title")
		  .attr("x", label_x)
		  .attr("y", -16)
		  .text(bar_label);
		  
	  svg.append("g")
		  .attr("class", "y axis")
		  .call(yAxis);

	  svg.selectAll(".barz")
		  .data(data)
		.enter().append("rect")
		  .attr("class", "bar")
		  .attr("fill", "skyblue")
		  .attr("x", function(d) { return x(d.Name)+10; })
		  .attr("width", x.rangeBand()-25)
		  .attr("y", function(d) { return y(d.Value); })
		  .attr("height", function(d) { return height - y(d.Value); })
		  .on('mouseover', tip.show)
		  .on('mouseout', tip.hide);
		  
	  svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis)
		  .selectAll(".tick text")
		  .call(wrap, x.rangeBand());
	//});
}
//**************************************************************************************************************************************
function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}