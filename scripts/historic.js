var heightHist=400 - margin.top - margin.bottom;

var parseDate=d3.timeParse('%Y-%m');
var formatDate=d3.timeFormat("%B, %Y")

var drawEntradas=d3.line()
      .x(d => xhist(d.fecha))
      .y(d => yhist(d.entradas));

var drawSalidas=d3.line()
      .x(d => xhist(d.fecha))
      .y(d => yhist(d.salidas));

// graph

var yhist = d3.scaleLinear()
    .range([heightHist, 0], 0.1);

var xhist = d3.scaleTime()
    .range([0, width*0.95])
    .domain([parseDate("2012-1"), parseDate("2018-6")]).nice();

var divHist = d3.select("body").append("div") 
   .attr("background", "lightsteelblue")
   .attr("class", "tooltipHist")          
   .style("opacity", 0);
    
var svgHistorico = d3.select("#historico").append("svg")
    .attr("width", generalWidth)
    .attr("height", 400)
    .append("g")
      .attr("transform", "translate(" + (margin.left+20) + "," + margin.top + ")");

// enter de data
d3.csv("data/dataMig2.csv")
  .then((data) => {
        return data.map((d) => {
          d.flujoNeto = +d.flujoNeto
          d.rankFlujos = +d.rankFlujos
          d.entradas = +d.entradas
          d.salidas = +d.salidas
          d.fecha=parseDate(d.fecha);
          return d;  
        });
        })
  .then((data) => {
  datasorHist=data.filter(d => d.Pais=="Total").sort((a,b) => d3.descending(a.fecha,b.fecha));

  var outputHist = document.getElementById("titulo-hist");
  outputHist.innerHTML = "Evolución historíca del total de entradas y salidas desde y hacia Colombia" ;

  yhist.domain([0, Math.max(d3.max(datasorHist, d=>d.entradas), d3.max(datasorHist, d=>d.salidas))])
    .nice();


  svgHistorico.append("path")
    .attr("class", "pathHistoric-entradas")
    .attr("stroke", "steelblue")
    .attr("d", drawEntradas(datasorHist));

  svgHistorico.append("path")
    .attr("class", "pathHistoric-salidas")
    .attr("stroke", "red")
    .attr("d", drawSalidas(datasorHist));

   svgHistorico.selectAll("circle").filter(".entradas-circle")
    .data(datasorHist).enter()
    .append("circle")
     .attr("class", "entradas-circle")
     .attr("cx", d => xhist(d.fecha))
     .attr("cy", d => yhist(d.entradas)) 
     .attr("r", 3)
     .style("fill", "steelblue")
     .on("mouseover", function(d) {   
            divHist.transition()    
                .duration(900)    
                .style("opacity", .9);    
             divHist.html(formatDate(d.fecha) +"<p>"+ formatThousand(d.entradas)+" entradas" )
                .style("left", (d3.event.pageX+10) + "px")   
                .style("top", (d3.event.pageY - 28) + "px")
                .style("background", "lightsteelblue");
            d3.select(this).transition()
              .duration(500)
              .attr("r", 7); 
            })          
        .on("mouseout", function(d) {   
            divHist.transition()    
                .duration(500)    
                .style("opacity", 0); 
            d3.select(this).transition()
              .duration(600)
              .attr("r", 3);
        });

   svgHistorico.selectAll("circle").filter(".salidas-circle")
    .data(datasorHist).enter()
    .append("circle")
     .attr("class", "salidas-circle")
     .attr("cx", d => xhist(d.fecha))
     .attr("cy", d => yhist(d.salidas)) 
     .attr("r", 3)
     .style("fill", "red")
     .on("mouseover", function(d) {   
            divHist.transition()    
                .duration(900)    
                .style("opacity", .9);    
            divHist.html(formatDate(d.fecha) +"<p>"+ formatThousand(d.salidas)+" salidas" )  
                .style("left", (d3.event.pageX+10) + "px")   
                .style("top", (d3.event.pageY - 28) + "px")
                .style("background", "pink");
            d3.select(this).transition()
              .duration(500)
              .attr("r", 7); 
            })          
        .on("mouseout", function(d) {   
            divHist.transition()    
                .duration(500)    
                .style("opacity", 0); 
            d3.select(this).transition()
              .duration(600)
              .attr("r", 3);
        });

  svgHistorico.append("g")
    .attr("class", "x-axis-hist")
    .attr("transform", `translate(0,${heightHist})`)
      .call(d3.axisBottom(xhist));

  svgHistorico.append("g")
  .attr("class", "y-axis-hist")
    .call(d3.axisLeft(yhist));

  svgHistorico.append("rect")
    .attr("x", xhist(parseDate("2018-8")))
    .attr("y", yhist(Math.max(d3.max(datasorHist, d=>d.entradas), d3.max(datasorHist, d=>d.salidas))*0.2))
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", "steelblue");

  svgHistorico.append("text")
    .attr("class", "labelSalidas")
    .attr("x", xhist(parseDate("2018-10")))
    .attr("y", yhist(Math.max(d3.max(datasorHist, d=>d.entradas), d3.max(datasorHist, d=>d.salidas))*0.2)+10)
    .style("font-size", "12px")
    .text("Entradas");

  svgHistorico.append("rect")
    .attr("x", xhist(parseDate("2018-8")))
    .attr("y", yhist(Math.max(d3.max(datasorHist, d=>d.entradas), d3.max(datasorHist, d=>d.salidas))*0.1))
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", "red");

  svgHistorico.append("text")
    .attr("class", "labelSalidas")
    .attr("x", xhist(parseDate("2018-10")))
    .attr("y", yhist(Math.max(d3.max(datasorHist, d=>d.entradas), d3.max(datasorHist, d=>d.salidas))*0.1)+10)
    .style("font-size", "12px")
    .text("Salidas");


});


// Update
function updateLines(paisFilter) {
d3.csv("data/dataMig2.csv")
  .then((data) => {
        return data.map((d) => {
          d.flujoNeto = +d.flujoNeto
          d.rankFlujos = +d.rankFlujos
          d.entradas = +d.entradas
          d.salidas = +d.salidas
          d.fecha=parseDate(d.fecha);
          return d;  
        });
        })
  .then((data) => {
  datasorHist=data.filter(d => d.Pais==paisFilter).sort((a,b) => d3.descending(a.fecha,b.fecha));

  var outputHist = document.getElementById("titulo-hist");
  outputHist.innerHTML = (paisFilter=="Total") ? "Evolución historíca del total de entradas y salidas desde y hacia Colombia" : "Evolución historíca de entradas y salidas desde y hacia "+ paisFilter;

  yhist.domain([0, Math.max(d3.max(datasorHist, d=>d.entradas), d3.max(datasorHist, d=>d.salidas))])
    .nice();

  d3.selectAll(".pathHistoric-entradas")
    .transition()
    .duration(750)
    .attr("d", drawEntradas(datasorHist));

  d3.selectAll(".pathHistoric-salidas")
    .transition()
    .duration(750)
    .attr("d", drawSalidas(datasorHist))

   d3.selectAll("circle").filter(".entradas-circle")
    .data(datasorHist)
    .transition()
    .duration(750)
    .attr("cx", d => xhist(d.fecha))
    .attr("cy", d => yhist(d.entradas));

   d3.selectAll("circle").filter(".salidas-circle")
    .data(datasorHist)
    .transition()
    .duration(750)
    .attr("cx", d => xhist(d.fecha))
    .attr("cy", d => yhist(d.salidas));

  d3.selectAll(".x-axis-hist")
    .transition()
    .duration(400)
    .attr("transform", `translate(0,${heightHist})`)
      .call(d3.axisBottom(xhist));

  d3.selectAll(".y-axis-hist")
    .transition()
    .duration(400)
      .call(d3.axisLeft(yhist));

  svgHistorico.exit()
    .remove()

});
}