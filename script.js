// select the svg container first
const svg = d3.select('.canvas')
  .append('svg')
    .attr('width', 500)
    .attr('height', 600);

// create margins & dimensions
const margin = {top: 10, right: 20, bottom: 100, left: 100};
const graphWidth = 500 - margin.left - margin.right;
const graphHeight = 500 - margin.top - margin.bottom;

const graph = svg.append('g')
  .attr('width', graphWidth)
  .attr('height', graphHeight)
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

// create axes groups
const xAxisGroup = graph.append('g')
  .attr('transform', `translate(0, ${graphHeight})`)

const yAxisGroup = graph.append('g');

db.collection('Students').get().then(res => {

  var data=[];
  res.docs.forEach(doc => {
    data.push(doc.data());
    
  });


  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.marks)])
    .range([graphHeight, 0]);

  const x = d3.scaleBand()
    .domain(data.map(item => item.name))
    .range([0, graphWidth])
    .paddingInner(0.3)
    .paddingOuter(0.2);

  // join the data to circs
  const rects = graph.selectAll('rect')
    .data(data);

  // add attrs to circs already in the DOM
  rects.attr('width', x.bandwidth)
    .attr("height", d => graphHeight - y(d.marks))
    .attr('fill', 'orange')
    .attr('x', d => x(d.name))
    .attr('y', d => y(d.marks));

  // append the enter selection to the DOM
  rects.enter()
    .append('rect')
      .attr('width', x.bandwidth)
      .attr("height", d => graphHeight - y(d.marks))
      .attr('fill', 'orange')
      .attr('x', (d) => x(d.name))
      .attr('y', d => y(d.marks));

  // create & call axesit
  const xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y)
    .ticks(10)
    .tickFormat(d => d + ' marks');

  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);

  xAxisGroup.selectAll('text')
    .attr('fill', 'orange')
    // .attr('transform', 'rotate(-40)')
    .attr('text-anchor', 'end')

});

var data = [
  {name: "shivam", marks: 57},
  {name: "harish", marks: 67},
  {name: "ar", marks: 45},
  {name: "ar1", marks: 89},
  {name: "ar2", marks: 54},
];
var text = "";

var width = 150;
var height = 1000;
var thickness = 40;
var duration = 750;
var padding = 15;
var opacity = .8;
var opacityHover = 1;
var otherOpacityOnHover = .8;
var tooltipMargin = 13;

var radius = Math.min(width-padding, height-padding) / 2;
var color = d3.scaleOrdinal(d3.schemeCategory10);

var g = svg.append('g')
.attr('transform', 'translate(' + (width/2) + ',' + (height/2) + ')');

var arc = d3.arc()
.innerRadius(0)
.outerRadius(radius);

var pie = d3.pie()
.value(function(d) { return d.marks; })
.sort(null);

var path = g.selectAll('path')
  .data(pie(data))
  .enter()
  .append("g")  
  .append('path')
  .attr('d', arc)
  .attr('fill', (d,i) => color(i))
  .style('opacity', opacity)
  .style('stroke', 'white')
  .on("mouseover", function(d) {
      d3.selectAll('path')
        .style("opacity", otherOpacityOnHover);
      d3.select(this) 
        .style("opacity", opacityHover);

      let g = d3.select("svg")
        .style("cursor", "pointer")
        .append("g")
        .attr("class", "tooltip")
        .style("opacity", 0);
 
      g.append("text")
        .attr("class", "name-text")
        .text(`${d.data.name} (${d.data.marks})`)
        .attr('text-anchor', 'middle');
    
      let text = g.select("text");
      let bbox = text.node().getBBox();
      let padding = 2;
      g.insert("rect", "text")
        .attr("x", bbox.x - padding)
        .attr("y", bbox.y - padding)
        .attr("width", bbox.width + (padding*2))
        .attr("height", bbox.height + (padding*2))
        .style("fill", "white")
        .style("opacity", 0.75);
    })
  .on("mousemove", function(d) {
        let mousePosition = d3.mouse(this);
        let x = mousePosition[0] + width/2;
        let y = mousePosition[1] + height/2 - tooltipMargin;
    
        let text = d3.select('.tooltip text');
        let bbox = text.node().getBBox();
        if(x - bbox.width/2 < 0) {
          x = bbox.width/2;
        }
        else if(width - x - bbox.width/2 < 0) {
          x = width - bbox.width/2;
        }
    
        if(y - bbox.height/2 < 0) {
          y = bbox.height + tooltipMargin * 2;
        }
        else if(height - y - bbox.height/2 < 0) {
          y = height - bbox.height/2;
        }
    
        d3.select('.tooltip')
          .style("opacity", 1)
          .attr('transform',`translate(${x}, ${y})`);
    })
  .on("mouseout", function(d) {   
      d3.select("svg")
        .style("cursor", "none")  
        .select(".tooltip").remove();
    d3.selectAll('path')
        .style("opacity", opacity);
    })
  .on("touchstart", function(d) {
      d3.select("svg")
        .style("cursor", "none");    
  })
  .each(function(d, i) { this._current = i; });