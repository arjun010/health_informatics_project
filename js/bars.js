bars_data=
[
  {
    "Name":"Med1",
    "Value":"34"
  },
  {
    "Name":"Med2",
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

function call_draw_chart(div_id){
	draw_chart(bars_data, div_id);

}

function draw_chart(bars, div_id){
	var data = bars;
	var margin = {top: 80, right: 280, bottom: 80, left: 80},
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
  max_value=0;
  data.forEach(function(d) {
		if(max_value < d.Value) max_value = d.Value;
        d.Name = d.Name;		
		//d.Value = Number(d.Value)+60;
        console.log(d.Value + " | " + d.Name);
    });
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
      .text("Value");
	  
  svg.append("text")
      .attr("class", "title")
      .attr("x", 500)
      .attr("y", 250)
      .text("Name Title");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("fill", "#C19C2E")
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