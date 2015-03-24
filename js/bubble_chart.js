function bubbleChart (data) {

    // D3 Bubble Chart 

    var diameter = 600;
    var width = 800;
    var height = 700;

    var svg = d3.select('#bubblechart').append('svg')
                    .attr('width', width)
                    .attr('height', height);

    var bubble = d3.layout.pack()
                .size([diameter, diameter])
                .value(function(d) {return d.size;})
                .sort(function(a, b) {
                    return -(a.value - b.value);
                })
                .padding(3);

    // generate data with calculated layout values
    var nodes = bubble.nodes(processData(data))
                        .filter(function(d) { return !d.children; }); // filter out the outer bubble

    var vis = svg.selectAll('g.bubble')
            .data(nodes)
        .enter().append('g')
            .attr('class', 'bubble')
            .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });

    vis.append('circle')
            .attr('r', function(d) { return d.r; })
            .style('fill', '#029eca');
            //.attr('class', function(d) { return d.className; });

    vis.append('text')
            .attr('text-anchor', 'middle')
            .attr("dy", ".3em")
            .text(function(d) { return d.name.substring(0, d.r / 3) });

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
            if (conditions[i] == '') {continue;};
            newDataSet.push({name: conditions[i], size: counts[i]});
        }
        return {children: newDataSet};
    }
}
