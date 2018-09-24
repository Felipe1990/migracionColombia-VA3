
var generalWidth=960,
    margin = {top: 20, right: 30, bottom: 40, left: 30},
    width = generalWidth - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var y = d3.scaleBand()
    .range([0, height], 0.1);

var x = d3.scaleLinear()
    .range([0, width], 0.1);

var bodyChange=d3.select("body")
  .style("width", generalWidth+"px")

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.csv("data/sample_codes.csv")
  .then((data) => {
        return data.map((d) => {
          d.nota = +d.nota;
          return d;  
        });
        })
  .then((data) => {
// primer hay que ordenar la base .. duh!!!
  datasor=data.sort((a,b) => d3.descending(a.nota, b.nota));

  x.domain(d3.extent(datasor, d => d.nota))
    .nice();

  y.domain(datasor.map(d => d.cod));

  svg.selectAll(".bar")
        .data(datasor)
      .enter().append("rect")
        .attr("class", function(d) { return "bar bar--" + (d.nota < 0 ? "negative" : "positive"); })
        .attr("x", function(d) { return x(Math.min(0, d.nota)); })
        .attr("y", function(d) { return y(d.cod); })
        .attr("width", function(d) { return Math.abs(x(d.nota) - x(0)); })
        .attr("height", y.bandwidth());

  svg.append("g")
    .call(d3.axisLeft(y))
    .attr("transform", "translate(" + x(0) + ",0)");

  svg.append("g")
    .call(d3.axisBottom(x))
    .attr("transform", "translate(0," + height + ")");

});
