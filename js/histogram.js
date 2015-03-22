

function generate_histogram(values){

	var num_array = [1,1,1,1,1,1,1,1,2,2,2,2,1,1,4,4,4,4,5,5,5,6,6,7,7,8,8,8,8,8,8,8,8,3,3,3,3,3,3,4,5,6,1,2,3,7,7,7,7,7,4,9,9,9,9,9,9,5,3,2,2,2,3];
	console.log(arrayMax(num_array));
	//var values = d3.range(50).map(d3.random.bates(10));

	var formatCount = d3.format(",.0f");

	var margin = {top: 30, right: 600, bottom: 170, left: 30},
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	var x = d3.scale.linear()
		.domain([0, 10])
		.range([0, width]);

	// Generate a histogram using twenty uniformly-spaced bins.
	var data = d3.layout.histogram().bins(x.ticks(10))(num_array);
	console.log(data);
	var y = d3.scale.linear()
		.domain([0, d3.max(data, function(d) { return d.y; })])
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var svg = d3.select("#vis").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var bar = svg.selectAll(".barz")
		.data(data)
	  .enter().append("g")
		.attr("class", "bar")
		.attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

	bar.append("rect")
		.attr("x", 1)
		.attr("width", x(data[0].dx) - 1)
		.attr("height", function(d) { return height - y(d.y); });

	bar.append("text")
		.attr("dy", ".75em")
		.attr("y", 6)
		.attr("x", x(data[0].dx) / 2)
		.attr("text-anchor", "middle")
		.text(function(d) { return formatCount(d.y); });

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

}


function arrayMax(arr) {
  return arr.reduce(function (p, v) {
    return ( p > v ? p : v );
  });
}