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
