
var generalWidth=960,
    margin = {top: 20, right: 30, bottom: 40, left: 30},
    width = generalWidth - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var bodyChange=d3.select("body")
  .style("width", generalWidth+"px")

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.ordinal()
    .rangeRoundBands([0, height], 0.1);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickSize(0)
    .tickPadding(6);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tipinfo = d3.tip()
  .html(function(d) {
    return "<strong>Nota:</strong> <span style='color:black'>" + (Math.round((+d.nota+3)*10)/10) + "</span>";
  })
  .direction(d=>{
    if (d.nota>0) return 'w'
    if (d.nota<=0) return 'e'

  })
  .offset(d=>{
    if (d.nota>0) return [0, -20]
    if (d.nota<=0) return [0,10]
  });

svg.call(tipinfo);
  
d3.csv("sample_codes.csv", type, function(error, data) {
// primer hay que ordenar la base .. duh!!!
  datasor=data.sort((a,b) => d3.descending(a.nota, b.nota));

  x.domain(d3.extent(datasor, function(d) { return d.nota; })).nice();
  y.domain(datasor.map(function(d) { return d.cod; }));

  svg.selectAll(".bar")
      .data(datasor)
    .enter().append("rect")
      .attr("class", function(d) { return "bar bar--" + (d.nota < 0 ? "negative" : "positive"); })
      .attr("x", function(d) { return x(Math.min(0, d.nota)); })
      .attr("y", function(d) { return y(d.cod); })
      .attr("width", function(d) { return Math.abs(x(d.nota) - x(0)); })
      .attr("height", y.rangeBand())
      .on('mouseover', function(d, i){
        tipinfo.show(d,i)})
      .on('mouseout', tipinfo.hide);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + x(0) + ",0)")
      .call(yAxis);
});

function type(d) {
  d.nota = +d.nota;
  return d;
}