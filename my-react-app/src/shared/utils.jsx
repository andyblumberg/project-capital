import * as d3 from 'd3'

function drawPieChart(container, widthPx, heightPx) {
  d3.select(container).selectAll('svg').remove()

  const margin = { top: 20, right: 20, bottom: 40, left: 50 }
  const width = Math.max(200, widthPx) - margin.left - margin.right
  const height = Math.max(150, heightPx) - margin.top - margin.bottom

  const data = [
    { name: "<5", value: 19912018 },
    { name: "5-9", value: 20501982 },
    { name: "10-14", value: 20679786 },
    { name: "15-19", value: 21354481 },
    { name: "20-24", value: 22604232 },
    { name: "25-29", value: 21698010 },
    { name: "30-34", value: 21183639 },
    { name: "35-39", value: 19855782 },
    { name: "40-44", value: 20796128 },
    { name: "45-49", value: 21370368 },
    { name: "50-54", value: 22525490 },
    { name: "55-59", value: 21001947 },
    { name: "60-64", value: 18415681 },
    { name: "65-69", value: 14547446 },
    { name: "70-74", value: 10587721 },
    { name: "75-79", value: 7730129 },
    { name: "80-84", value: 5811429 },
    { name: "≥85", value: 5938752 }
  ];

  // Create the color scale.
  const color = d3.scaleOrdinal()
      .domain(data.map(d => d.name))
      .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())

  // Create the pie layout and arc generator.
  const pie = d3.pie()
      .sort(null)
      .value(d => d.value);

  const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(Math.min(width, height) / 2 - 1);

  const labelRadius = arc.outerRadius()() * 0.8;

  // A separate arc generator for labels.
  const arcLabel = d3.arc()
      .innerRadius(labelRadius)
      .outerRadius(labelRadius);

  const arcs = pie(data);

  // Create the SVG container.
  const svg = d3.
    select(container).
    append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

  // Add a sector path for each value.
  svg.append("g")
      .attr("stroke", "white")
    .selectAll()
    .data(arcs)
    .join("path")
      .attr("fill", d => color(d.data.name))
      .attr("d", arc)
    .append("title")
      .text(d => `${d.data.name}: ${d.data.value.toLocaleString("en-US")}`);

  // Create a new arc generator to place a label close to the edge.
  // The label shows the value if there is enough room.
  svg.append("g")
      .attr("text-anchor", "middle")
    .selectAll()
    .data(arcs)
    .join("text")
      .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
      .call(text => text.append("tspan")
          .attr("y", "-0.4em")
          .attr("font-weight", "bold")
          .text(d => d.data.name))
      .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
          .attr("x", 0)
          .attr("y", "0.7em")
          .attr("fill-opacity", 0.7)
          .text(d => d.data.value.toLocaleString("en-US")));
    
  svg.node();
}

function drawLineChart(container, widthPx, heightPx) {
  d3.select(container).selectAll('svg').remove()

  const margin = { top: 20, right: 20, bottom: 40, left: 50 }
  const width = Math.max(200, widthPx) - margin.left - margin.right
  const height = Math.max(150, heightPx) - margin.top - margin.bottom

  const svg = d3
    .select(container)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  // sample data
  const now = new Date()
  const data = d3.range(50).map((i) => ({
    x: d3.timeDay.offset(now, -50 + i),
    y: Math.sin(i / 5) * 20 + 50 + Math.random() * 10,
  }))

  const x = d3.scaleTime().domain(d3.extent(data, (d) => d.x)).range([0, width])
  const y = d3.scaleLinear().domain([0, d3.max(data, (d) => d.y) + 10]).range([height, 0])

  const xAxis = d3.axisBottom(x).ticks(Math.min(10, data.length))
  const yAxis = d3.axisLeft(y)

  svg.append('g').attr('transform', `translate(0,${height})`).call(xAxis)
  svg.append('g').call(yAxis)

  const line = d3
    .line()
    .x((d) => x(d.x))
    .y((d) => y(d.y))

  svg
    .append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', '#2b6cb0')
    .attr('stroke-width', 2)
    .attr('d', line)
}

export {drawPieChart, drawLineChart};