var parseDate = d3.time.format("%Y %B").parse;

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

// merge two javascript objects into one
var merge_json = function(average, org_feature) {
  var merged = new Array();
  for (var i = 0; i < average.length; i++) {
    var current_date = average[i].date;
    var average_value = average[i].average;
    var org_value = undefined;
    for (var j = 0; j < org_feature.length; j++) {
      if (org_feature[j].date === current_date) {
        org_value = org_feature[j].value;
        break;
      }
    }
  if (org_value != undefined)
      merged.push({'Date': current_date, 'Average': average_value, 'Company': org_value});
  }

  return merged;
}


// append 
var append_2col_svg = function(org_data, average_data, divid, org, feature) {

    var data = merge_json(average_data, org_data);

    var margin = {top: 40, right: 20, bottom: 60, left: 60},
    width = 480 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

    var x0 = d3.scale.ordinal()
       .rangeRoundBands([0, width], .1);

    var x1 = d3.scale.ordinal();

    var y = d3.scale.linear()
       .range([height, 0]);

    var color = d3.scale.ordinal()
       .range(["#AEC6E8 ", "#1F78B4 "]);

    var xAxis = d3.svg.axis()
       .scale(x0)
       .orient("bottom")
       .tickFormat(d3.time.format('%Y %b'));

    var yAxis = d3.svg.axis()
       .scale(y)
       .orient("left")
       .tickFormat(d3.format(".2s"));

    var svg = d3.select(divid).append("svg")
       .attr("width", width + margin.left + margin.right)
       .attr("height", height + margin.top + margin.bottom)
     .append("g")
       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // draw data

    var ageNames = d3.keys(data[1]).filter(function(key) { return key !== "Date"; });
    data.forEach(function(d) {
     d.ages = ageNames.map(function(name) { return {name: name, value: +d[name]}; });
    });

    data.forEach(function(d) {
      d.Date = parseDate(d.Date);
    });


    x0.domain(data.map(function(d) { return d.Date; }));
    x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
    y.domain([0, d3.max(data, function(d) { return d3.max(d.ages, function(d) { return d.value; }); })]);

    svg.append("text")
         .attr("x", (width / 2))             
         .attr("y", 0 - (margin.top / 2))
         .attr("text-anchor", "middle")  
         .style("font-size", "25px") 
         .style("text-decoration", "bold")  
         .text(org.toUpperCase() + " " + feature.capitalizeFirstLetter() + ' vs. Average ');

    svg.append("g")
          //.attr("class", "heading")
          //.append("text")
          //.style("text-anchor", "start")
          //.text("Company 1's Carbon Emission from overall vs average")
       .attr("class", "x axis")
       .attr("transform", "translate(0," + height + ")")
       .style('font-size', '9px')
       .call(xAxis)
        .append("text")      
        .attr("x", 170)
        .attr("y", 40)
          .attr("dx", ".71em")
        .style("text-anchor", "start")
        .style('font-size', '15px')
        .text("Month");

    svg.append("g")
       .attr("class", "y axis")
       .call(yAxis)
      .style('font-size', '9px')
     .append("text")
       .attr("transform", "rotate(-90)")
       .attr("x", -60)
       .attr("y", -55)
       .attr("dy", ".71em")
       .style("text-anchor", "end")
      .style('font-size', '15px')
       .text(feature.capitalizeFirstLetter());
        

    var Date = svg.selectAll(".Date")
       .data(data)
     .enter().append("g")
       .attr("class", "Date")
       .attr("transform", function(d) { return "translate(" + x0(d.Date) + ",0)"; });

    Date.selectAll("rect")
       .data(function(d) { return d.ages; })
     .enter().append("rect")
       .attr("width", x1.rangeBand())
       .attr("x", function(d) { return x1(d.name); })
       .attr("y", function(d) { return y(d.value); })
       .attr("height", function(d) { return height - y(d.value); })
       .style("fill", function(d) { return color(d.name); });

    var legend = svg.selectAll(".legend")
       .data(ageNames.slice().reverse())
     .enter().append("g")
       .attr("class", "legend")
       .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
       .attr("x", width - 18)
       .attr("width", 18)
       .attr("height", 18)
       .style("fill", color);

    legend.append("text")
       .attr("x", width - 24)
       .attr("y", 9)
       .attr("dy", ".35em")
       .style("text-anchor", "end")
       .style('font-size', '9px')
       .text(function(d) { return d; });
};


var testrun = function() {
  var firebasepath = "https://ecaura.firebaseIO.com"
  console.log("Starting request")
  var myDataRef = new Firebase(firebasepath);
  console.log("Connected")

  myDataRef.on('value', function(snapshot) {
    var average_data = get_average_series(firebasepath, 'electricity');
    console.log(average_data);

    var org_feature = get_org_feature(firebasepath, 'nyuad', 'electricity');
    console.log(org_feature);

    var data = merge_json(average_data, org_feature);
    d3.selectAll("#test > *").remove();
    append_2col_svg(org_feature, average_data, '#test', 'nyuad', 'electricity');
  });
}

testrun()