function add_series_to_svg(data, parseDate, divid) {
	// Set the dimensions of the canvas / graph
	// Set the ranges

    //var margin = {top: 30, right: 20, bottom: 30, left: 50};

    // var  width = 600 - margin.left - margin.right;
    // var  height = 270 - margin.top - margin.bottom;

    var width = 530
    var height = 200

	var x = d3.time.scale().range([0, width]);
	var y = d3.scale.linear().range([height, 0]);

	// Define the axes
	var xAxis = d3.svg.axis().scale(x)
	    .orient("bottom").ticks(5);

	var yAxis = d3.svg.axis().scale(y)
	    .orient("left").ticks(5);

	    // Define the line
	var valueline = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.value); });

    var svg = d3.select(divid)
    .append("svg")
        .attr("width", width + 70)
        .attr("height", height + 70)
    .append("g")
        .attr("transform", 
              "translate(" + 20 + "," + 50 + ")");

    data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.value = +d.value;
    });

    function sortByDateAscending(a, b) {
    // Dates will be cast to numbers automagically:
    	return a.date - b.date;
	}

	data = data.sort(sortByDateAscending);
	
    console.log(data)



    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.value; })]);

    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
}