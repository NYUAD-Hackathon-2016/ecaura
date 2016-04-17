function add_series_to_svg(data, parseDate, divid) {
    //console.log(data)
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
              "translate(" + 50 + "," + 10 + ")");

    data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.value = +d.value;
    });

    function sortByDateAscending(a, b) {
    // Dates will be cast to numbers automagically:
    	return a.date - b.date;
	}

	data = data.sort(sortByDateAscending);
	
    //console.log(data)




    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.value; })]);

    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data))
        .attr("stroke", "blue")
        .attr("stroke-width", 2);;

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .text("value")
        .call(xAxis);
    //add the Y label
    /*svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - (50))
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Value");
    */
    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
}



function add_many_series_to_svg(data_arr, parseDate, divid) {
    //console.log(data_arr)

    data = data_arr["electricity"]
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
        .attr("id", "bottomone")
        .attr("width", width + 70)
        .attr("height", height + 70)
    .append("g")
        .attr("transform", 
              "translate(" + 50 + "," + 10 + ")");

 function sortByDateAscending(a, b) {
    // Dates will be cast to numbers automagically:
        return a.date - b.date;
    }

    new_data_arr = new Object()
    for (feature in data_arr) {
            if ((feature == "water") ||  (feature == "electricity") ||  (feature == "waste") ||  (feature == "fuel") || (feature == "food")) {
                    data_arr[feature].forEach(function(d) {
                        d.date = parseDate(d.date);
                        d.value = +d.value;
                    });
                new_data_arr[feature] = data_arr[feature].sort(sortByDateAscending);
            }

    }
    //console.log(new_data_arr)
    data_arr = new_data_arr;

    //console.log(data_arr)
    var flattened = new Array()
    for (i in data_arr) {
        for (elem in data_arr[i]){
            flattened.push(data_arr[i][elem])
        }
    }
    //console.log(flattened)




    // Scale the range of the data
    x.domain(d3.extent(flattened, function(d) { return d.date; }));
    y.domain([d3.min(flattened, function(d) { return d.value; }), d3.max(flattened, function(d) { return d.value; })]);

    colors = ["blue", "red", "green", "orange", "black"]
    //Add the valueline path.
    counter = 0
    for (i in data_arr) {
        //console.log(i)
        //console.log(data_arr[i])
        svg.append("path")
            //.attr("class", "line")
            .attr("d", valueline(data_arr[i]))
            .attr("stroke", colors[counter])
            .attr("stroke-width", 2);
        counter = counter + 1

    }



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