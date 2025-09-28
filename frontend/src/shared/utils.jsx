import * as d3 from 'd3'

function drawPieChart(container, widthPx, heightPx, data) {
    console.log("hit pie"+ data)
  d3.select(container).selectAll('svg').remove()

  data = data.map((f) => ({"total": -1 * f.total, "category": f.category}))

  const margin = { top: 20, right: 20, bottom: 40, left: 50 }
  const width = Math.max(200, widthPx) - margin.left - margin.right
  const height = Math.max(150, heightPx) - margin.top - margin.bottom

//   const data = [
//     { category: "<5", total: 19912018 },
//     { category: "5-9", total: 20501982 },
//     { category: "10-14", total: 20679786 },
//     { category: "15-19", total: 21354481 },
//     { category: "20-24", total: 22604232 },
//     { category: "25-29", total: 21698010 },
//     { category: "30-34", total: 21183639 },
//     { category: "35-39", total: 19855782 },
//     { category: "40-44", total: 20796128 },
//     { category: "45-49", total: 21370368 },
//     { category: "50-54", total: 22525490 },
//     { category: "55-59", total: 21001947 },
//     { category: "60-64", total: 18415681 },
//     { category: "65-69", total: 14547446 },
//     { category: "70-74", total: 10587721 },
//     { category: "75-79", total: 7730129 },
//     { category: "80-84", total: 5811429 },
//     { category: "≥85", total: 5938752 }
//   ];

  // Create the color scale.
  const color = d3.scaleOrdinal()
      .domain(data.map(d => d.category))
      .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())

  // Create the pie layout and arc generator.
  const pie = d3.pie()
      .sort(null)
      .value(d => d.total);

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
      .attr("fill", d => color(d.data.category))
      .attr("d", arc)
    .append("title")
      .text(d => `${d.data.category}: ${d.data.total.toLocaleString("en-US")}`);

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
          .text(d => d.data.category))
      .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
          .attr("x", 0)
          .attr("y", "0.7em")
          .attr("fill-opacity", 0.7)
          .text(d => d.data.total.toLocaleString("en-US")));
    
  svg.node();
}

function drawLineChart(container, widthPx, heightPx, data) {
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
//   const data = d3.range(50).map((i) => ({
//     x: d3.timeDay.offset(now, -50 + i),
//     y: Math.sin(i / 5) * 20 + 50 + Math.random() * 10,
//   }))

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

function drawStackedBarChart(container, widthPx, heightPx, data) {
  d3.select(container).selectAll('svg').remove()

  const margin = { top: 20, right: 55, bottom: 40, left: 30 }
  const width = Math.max(200, widthPx) - margin.left - margin.right
  const height = Math.max(150, heightPx) - margin.top - margin.bottom

//   const data = [
//     {"x":"AL","stacked_val":"<10","y":598478},
//     {"x":"AK","stacked_val":"<10","y":106741},
//     {"x":"AZ","stacked_val":"<10","y":892083},
//     {"x":"AR","stacked_val":"<10","y":392177},
//     {"x":"CA","stacked_val":"<10","y":5038433},
//     {"x":"AL","stacked_val":"10-19","y":257610},
//     {"x":"AK","stacked_val":"10-19","y":360263},
//     {"x":"AZ","stacked_val":"10-19","y":167495},
//     {"x":"AR","stacked_val":"10-19","y":360263},
//     {"x":"CA","stacked_val":"10-19","y":167495},
//     {"x":"AL","stacked_val":"20-29","y":218684},
//     {"x":"AK","stacked_val":"20-29","y":1789739},
//     {"x":"AZ","stacked_val":"20-29","y":905590},
//     {"x":"AR","stacked_val":"20-29","y":419456},
//     {"x":"CA","stacked_val":"20-29","y":167495},
//   ]

  // Determine the series that need to be stacked.
  const series = d3.stack()
      .keys(d3.union(data.map(d => d.stacked_val))) // distinct series keys, in input order
      .value(([, group], key) => group.get(key).y) // get value for each series key and stack
    (d3.index(data, d => d.x, d => d.stacked_val)); // group by stack then series key

  // Prepare the scales for positional and color encodings.
  const x = d3.scaleBand()
      .domain(d3.groupSort(data, D => -d3.sum(D, d => d.y), d => d.x))
      .range([margin.left, width - margin.right])
      .padding(0.1);

  const y = d3.scaleLinear()
      .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
      .rangeRound([height - margin.bottom, margin.top]);

  const color = d3.scaleOrdinal()
      .domain(series.map(d => d.key))
      .range(d3.schemeSpectral[series.length])
      .unknown("#ccc");

    // A function to format the value in the tooltip.
    const formatValue = x => isNaN(x) ? "N/A" : x.toLocaleString("en")

    // Create the SVG container.
    const svg = d3
        .select(container)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;");

    // Append a group for each series, and a rect for each element in the series.
    svg.append("g")
      .selectAll()
      .data(series)
      .join("g")
        .attr("fill", d => color(d.key))
      .selectAll("rect")
      .data(D => D.map(d => (d.key = D.key, d)))
      .join("rect")
        .attr("x", d => x(d.data[0]))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth())
      .append("title")
        .text(d => `${d.data[0]} ${d.key}\n${formatValue(d.data[1].get(d.key).y)}`);

    // Append the horizontal axis.
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .call(g => g.selectAll(".domain").remove());

    // Append the vertical axis.
    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(null, "s"))
        .call(g => g.selectAll(".domain").remove());
}

export {drawPieChart, drawLineChart, drawStackedBarChart};