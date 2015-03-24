function bubbleChart (data) {

    // D3 Bubble Chart 
	d3.select('#bubblechart').selectAll('svg').remove();
    var diameter = 600;

    var bubble_svg = d3.select('#bubblechart').append('svg')
                    .attr('width', diameter)
                    .attr('height', diameter);

    var bubble = d3.layout.pack()
                .size([diameter, diameter])
                .value(function(d) {return d.size;})
                .sort(function(a, b) {
                    return -(a.value - b.value);
                })
                .padding(3);

    // generate data with calculated layout values
    var bubble_nodes = bubble.nodes(processData(data))
                        .filter(function(d) { return !d.children; }); // filter out the outer bubble
    
	//console.log(bubble_nodes);
    var bubble_vis = bubble_svg.selectAll('g.bubble')
            .data(bubble_nodes)
        .enter().append('g')
            .attr('class', 'bubble')
            .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });
	console.log(bubble_nodes);
	var tip = d3.tip()
		  .attr('class', 'd3-tip')
		  .offset([-10, 0])
		  .html(function(d) {
			return "<strong>Name:</strong> <span style='color:Gold'>" + d.name + "</span>" + "<br/>" + 
				   "<strong>Value:</strong> <span style='color:Gold'>" + d.value + "</span>";
		  })
	
	bubble_svg.call(tip);
	
    bubble_vis.append('circle')
            .attr('r', function(d) { return d.r; })
            .style('fill', '#029eca')
			.on("click", function(d){ console.log(filteredEncounterDataByCondition);console.log(filteredEncounterData); filterByCondition(d.name); } )
			.on('mouseover', tip.show)
			.on('mouseout', tip.hide);
			/* .on("mouseover",function(d){
				d3.select(this).transition().duration(1000).attr("r",d.r+5).style("stroke","gold").style("stroke-width","3");
			})
			.on("mouseout",function(d){
				d3.select(this).attr('r', function(d) { return d.r; }).style("stroke","").style("stroke-width","0");
			}); */
            //.attr('class', function(d) { return d.className; });

    bubble_vis.append('text')
            .attr('text-anchor', 'middle')
            .attr("dy", ".3em")
            //.text(function(d) { return d.name })
			.text(function(d) { if(d.r >= 25) return d.name.substring(0, d.r / 3.2); });

    function processData(data) {
        var conditions = [];
        var counts = [];
        var encounter_index;
        var j;
        var first = true;
        for (var i = data.length - 1; i >= 0; i--) {
            j = conditions.indexOf(data[i].condition);
            if (j<0 || first) {
                conditions.push(data[i].condition);
                counts.push(1);
                if (first) {first=false};
            } else {
                counts[j]++;
            };
        };
        var newDataSet = [];
        for (var i = conditions.length - 1; i >= 0; i--) {
			if(conditions[i] == '') {continue;}
            newDataSet.push({name: conditions[i], size: counts[i]});
        }
        return {children: newDataSet};
    }
}
