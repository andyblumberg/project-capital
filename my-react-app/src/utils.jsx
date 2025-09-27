import * as d3 from "d3";

const createLineChart = async () => {
    // read data from csv and format variables
    let data = [
        {date: '2007-04-23', value: 93.24},
        {date: '2007-04-24', value: 95.35},
        {date: '2007-04-25', value: 98.84},
        {date: '2007-04-26', value: 99.92},
        {date: '2007-04-29', value: 99.8},
        {date: '2007-05-01', value: 99.47},
        {date: '2007-05-02', value: 100.39},
        {date: '2007-05-03', value: 100.4},
        {date: '2007-05-04', value: 100.81},
        {date: '2007-05-07', value: 103.92},
        {date: '2007-05-08', value: 105.06},
        {date: '2007-05-09', value: 106.88},
        {date: '2007-05-09', value: 107.34},
        {date: '2007-05-10', value: 108.74},
        {date: '2007-05-13', value: 109.36},
        {date: '2007-05-14', value: 107.52},
        {date: '2007-05-15', value: 107.34},
        {date: '2007-05-16', value: 109.44},
        {date: '2007-05-17', value: 110.02},
        {date: '2007-05-20', value: 111.98}
    ];
    var parseTime = d3.timeParse("%Y-%m-%d");

    data.forEach((d) => {
        d.date = parseTime(d.date);
        d.value = +d.value;
    });
    console.log(data)

    // set the dimensions and margins of the graph
    var margin = { top: 20, right: 20, bottom: 50, left: 70 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // add X axis and Y axis
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    x.domain(d3.extent(data, (d) => { return d.date; }));
    y.domain([0, d3.max(data, (d) => { return d.value; })]);

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));
        
    // add the Line
    var valueLine = d3.line()
    .x((d) => { return x(d.date); })
    .y((d) => { return y(d.value); });

    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", valueLine);

}

export default createLineChart;