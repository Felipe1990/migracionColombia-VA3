// slider

var slider = document.getElementsByTagName("input")[0];
var output = document.getElementsByClassName("slidecontainer")[0].getElementsByTagName("p")[2];
output.innerHTML = "Principales " + slider.value + " países, ségún flujo de viajeros (salidas + entradas)"; // Display the default slider value

slider.oninput = function() {
    output.innerHTML = output.innerHTML = "Principales " + this.value + " países, ségún flujo de viajeros (salidas + entradas)";
    updateBars(this.value);
    // console.log(this.value);
} 

// format number

var formatThousand=d3.format(",");

// graph
var generalWidth=960,
    margin = {top: 20, right: 50, bottom: 40, left: 30},
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
   
// tooltip

var div = d3.select("body").append("div") 
   .attr("background", "lightsteelblue")
   .attr("class", "tooltip")          
   .style("opacity", 0);


// enter de data

d3.csv("data/dataMig.csv")
  .then((data) => {
        return data.map((d) => {
          d.flujoNeto = +d.flujoNeto
          d.rankFlujos = +d.rankFlujos;
          return d;  
        });
        })
  .then((data) => {
  datasor=data.sort((a,b) => d3.descending(a.flujoNeto, b.flujoNeto))
              .filter(d => d.rankFlujos<=slider.value);

  x.domain([Math.min(d3.min(datasor, d => d.flujoNeto),0), d3.max(datasor, d => d.flujoNeto)])
    .nice();

  y.domain(datasor.map(d => d.Pais));

  svg.selectAll(".bar")
        .data(datasor)
      .enter().append("rect")
        .attr("class", function(d) { return "bar bar--" + (d.flujoNeto < 0 ? "negative" : "positive"); })
        .attr("x", function(d) { return x(Math.min(0, d.flujoNeto)); })
        .attr("y", function(d) { return y(d.Pais); })
        .attr("width", function(d) { return Math.abs(x(d.flujoNeto) - x(0)); })
        .attr("height", y.bandwidth())
        .on("mouseover", function(d) {    
            div.transition()    
                .duration(200)    
                .style("opacity", .9);    
            div.html("Entradas 2018: " + "<br>" + formatThousand(+d.entradas) + "<p>" + "Salidas 2018: " +"<br>"+ formatThousand(+d.salidas))
          })          
        .on("mouseout", function(d) {   
            div.transition()    
                .duration(500)    
                .style("opacity", 0); 
        })
        .on("click", function(d) {
          updateLines(this.__data__.Pais)
        });

  svg.append("g")
    .call(d3.axisLeft(y))
    .attr("class", "y axis")
    .attr("transform", "translate(" + x(0) + ",0)");

  svg.append("g")
    .call(d3.axisBottom(x))
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")");

  svg.append("text")             
    .attr("transform",
          "translate(" + (width/2) + " ," + 
                         (height+30) + ")")
    .style("text-anchor", "middle")
    .text("Flujo neto de viajeros en 2018");

});

// update

function updateBars(filterBars) {
  d3.csv("data/dataMig.csv")
  .then((data) => {
        return data.map((d) => {
          d.flujoNeto = +d.flujoNeto;
          d.rankFlujos = +d.rankFlujos;
          return d;  
        });
        })
  .then((data) => {
  datasorAlt=data.sort((a,b) => d3.descending(a.flujoNeto, b.flujoNeto))
              .filter(d => d.rankFlujos<=filterBars);

  x.domain([Math.min(d3.min(datasorAlt, d => d.flujoNeto),0), d3.max(datasorAlt, d => d.flujoNeto)])
    .nice();

  y.domain(datasorAlt.map(d => d.Pais));

  var svg = d3.select("svg").select("g");

    // Make the changes
  var bars=svg.selectAll(".bar") // change the x axis
      .data(datasorAlt)

  bars
    .transition()
    .duration(650)
    .attr("class", function(d) { return "bar bar--" + (d.flujoNeto < 0 ? "negative" : "positive"); })
    .attr("x", function(d) { return x(Math.min(0, d.flujoNeto)); })
    .attr("y", function(d) { return y(d.Pais); })
    .attr("width", function(d) { return Math.abs(x(d.flujoNeto) - x(0)); })
    .attr("height", y.bandwidth());

  bars
    .enter().append("rect")
    .attr("class", function(d) { return "bar bar--" + (d.flujoNeto < 0 ? "negative" : "positive"); })
    .attr("x", function(d) { return x(Math.min(0, d.flujoNeto)); })
    .attr("y", function(d) { return y(d.Pais); })
    .attr("width", 0)
    .attr("height", y.bandwidth())
    .on("mouseover", function(d) {    
            div.transition()    
                .duration(200)    
                .style("opacity", .9);    
            div .html("Entradas 2018: " + "<br>" + formatThousand(+d.entradas) + "<p>" + "Salidas 2018: " +"<br>"+ formatThousand(+d.salidas))
                })          
        .on("mouseout", function(d) {   
            div.transition()    
                .duration(500)    
                .style("opacity", 0); 
        })
         .on("click", function(d) {
          updateLines(this.__data__.Pais)
        })
    .transition()
    .duration(650)
    .attr("width", function(d) { return Math.abs(x(d.flujoNeto) - x(0)); });

  bars
    .exit()
    .transition()
    .duration(650)
    .attr("width", 0)
    .remove();

  svg
    .transition()
    .select(".x.axis") // change the x axis
    .duration(650)
    .call(d3.axisBottom(x))
    .attr("transform", "translate(0," + height + ")");
    
  svg.select(".y.axis") // change the y axis
    .transition()
    .duration(650)
    .call(d3.axisLeft(y))
    .attr("transform", "translate(" + x(0) + ",0)");

  var selectionA=document.getElementsByClassName("y axis")[0]
  var selTotal=document.getElementsByTagName("svg")[0].getElementsByTagName("g")[0]

  selTotal.removeChild(selectionA)
  selTotal.insertAdjacentElement("beforeend", selectionA);
  
});



};
