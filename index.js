var d3 = require("d3"),
    jsdom = require("jsdom");

var document = jsdom.jsdom(),
    svg = d3.select(document.body).append("svg");

var httpRequest = new XMLHttpRequest();
httpRequest.onreadystatechange = incomingData;

httpRequest.open('GET', 'https://data.seattle.gov/resource/rn6u-vkuv.json', true);
httpRequest.send(null);

function incomingData() {
	//check the state of the request
	if (httpRequest.readyState === XMLHttpRequest.DONE) {
		//check server response code
		if (httpRequest.status === 200) {
		    var text = httpRequest.responseText;
		    var data = JSON.parse(text);
		    console.log(data);
		    createBarChart(data);
		} else {
		    console.log("error");
		}
	}
}

function createBarChart(data) {
	var width = 1500,
    barHeight = 20;
	var x = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return parseInt(d.aawdt) })])
        .range([0, width]);
    console.log(x(data[0].aawdt));
	var chart = d3.select(".chart")
		.attr("width", width)
    	.attr("height", barHeight * data.length);

	var bar = chart.selectAll("g")
	    .data(data)
	    .enter().append("g")
	    .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

	bar.append("title")
	    .text(function(d) { return d.stname; });

	bar.append("rect")
	    .attr("width", function(d) { return x(d.aawdt); })
	    .attr("height", barHeight - 1);

	bar.append("text")
	    .attr("x", function(d) { return x(d.aawdt) - 3; })
	    .attr("y", barHeight / 2)
	    .attr("dy", ".35em")
	    .text(function(d) { return d.stname; });
}

//create initial set of bar charts
function makeBars(data) {
    $('#barChart').empty();
    data = $.parseJSON(data);
    //makePie(data);

    //margins
    var margin = {top: 30, right: 20, bottom: 30, left: 50},
        width = 500 - margin.left - margin.right,
        barHeight = 40;


    var entries = d3.entries(data)

    var x = d3.scale.linear()
        .domain([0, d3.max(entries, function(d) { return d.value.countStudents; })])
        .range([0, width]);

    var chart = d3.select("#barChart")
        .attr("width", width)
        .attr("margin", margin)
        .attr("height", barHeight * entries.length);

    var bar = chart.selectAll("g")
        .data(entries)
      .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

    bar.append("rect")
        .attr("width", function(d) { return x(d.value.countStudents); })
        .attr("height", barHeight - 3)
        .attr("class", "pointerC")
        .on("mouseover", function(d) {
            d3.select(this).style("fill", "#51a351");})
        .on("mouseout", function(d) {
            d3.select(this).style("fill", "#387038");})
        .on("click", function(d) 
            {
        getDegreeInfo(d.value.degreeID);
            });

    
   bar.append("text")
        .attr("x", function(d) { 
        	if ((d.value.degreeName).length > d.value.countStudents) {
	        	return x(d.value.countStudents) +2;
        	} else if (x(d.value.countStudents) >= 1170) {
	        	return 2;
        	} return x(d.value.countStudents) -5;
        })
        .attr("y", barHeight / 2)
        .attr("dy", ".40em")
        .style("fill", function(d) { 
        	if ((d.value.degreeName).length > d.value.countStudents) {
	        	return "#000000";
        	}
        	return "#ffffff";
        })
        .style("text-anchor", function(d) { 
        	if ((d.value.degreeName).length > d.value.countStudents) {
	        	return "start";
        	} else if (x(d.value.countStudents) >= 1170) {
	        	return "start";
        	}
        	return "end";
        })
        .attr("title", "Click on a bar to learn more about this major")
        .text(function(d) { 
        	if ((d.value.degreeName).length > d.value.countStudents || x(d.value.countStudents) >= 1170)  {
				return d.value.degreeName + " (" + d.value.countStudents + " students)"; } return d.value.degreeName;})
        .style("cursor", "pointer")
        .on("click", function(d) 
            {
				getDegreeInfo(d.value.degreeID);
            });
    	
	bar.append("svg:text")
	        .attr("x", function(d) { 
				return x(d.value.countStudents)+2;
		     })
	        .attr("y", barHeight / 2)
	        .style("text-anchor", "start")
	        .attr("dy", ".40em")
	        .text(function(d) { 
	        	if (!((d.value.degreeName).length > d.value.countStudents) && !(x(d.value.countStudents) >= 1170)) {
					return "(" + d.value.countStudents + " students)"; }
	        return ""; })
			.style("fill", "#000000")
			.style("cursor", "pointer")
			.on("click", function(d) 
            	{
				getDegreeInfo(d.value.degreeID);
            });

    $('#div2').hide();
    $('#barChart').show();
    $('#showChart').show();
    $('#noSelect').show();
}