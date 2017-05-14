const util = require('./util');

// util.createCssClass('.chart div', {
//   font: '10px sans-serif',
//   'background-color': 'steelblue',
//   'text-align': 'right',
//   padding: '3px',
//   margin: '1px',
//   color: 'white',
// });


var data = [4, 8, 15, 16, 23, 42];

// var el = document.createElement('div')
var el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
el.setAttribute('class', 'chart');
document.body.appendChild(el);

module.exports = function() {
  // var x = d3.scale.linear()
  //   .domain([0, d3.max(data)])
  //   .range([0, 420]);
  //
  // d3.select('.chart')
  //   .selectAll('div')
  //     .data(data)
  //   .enter().append('div')
  //     .style('width', d => x(d) + 'px')
  //     .text(d => d);

  // util.createCssClass('.chart rect', {
  //   fill: 'steelblue'
  // });
  //
  // util.createCssClass('.chart text', {
  //   fill: 'white',
  //   font: '10px sans-serif',
  //   'text-anchor': 'end'
  // });

  // SVG
  // d3.csv('data/data.tsv', type, function(error, data) {
  //   var width = 420, barHeight = 20;
  //   var type = d => { d.value = +d.value; return d };
  //   var x = d3.scale.linear().range([0, width])
  //     .domain([0, d3.max(data, d => d.value)]);
  //
  //   var chart = d3.select('.chart')
  //     .attr('width', width);
  //     .attr('height', barHeight * data.length);
  //
  //   var bar = chart.selectAll('g')
  //     .data(data)
  //     .enter().append('g')
  //     .attr('transform', (d, i) => 'translate(0,' + i * barHeight + ')');
  //
  //   bar.append('rect')
  //     .attr('width', d => x(d.value))
  //     .attr('height', barHeight - 1);
  //
  //   bar.append('text')
  //     .attr('x', d => x(d.value) - 3)
  //     .attr('y', barHeight / 2)
  //     .attr('dy', '.35em')
  //     .text(d => d.name)
  // });



//   // SVG 3
//   util.createCssClass('.chart rect', {
//     fill: 'steelblue'
//   });
//
//   util.createCssClass('.chart text', {
//     fill: 'white',
//     font: '10px sans-serif',
//     'text-anchor': 'middle'
//   });
//
//   var type = d => { d.value = +d.value; return d };
//
//   d3.csv('data/data.tsv', type, function(error, data) {
//     var width = 960, height = 500, barHeight = 20;
//
//     var x = d3.scale.ordinal()
//       .rangeRoundBands([0, width], .1)
//       .domain(data.map(d => d.name));
//
//     var y = d3.scale.linear()
//       .range([height, 0])
//       .domain([0, d3.max(data, d => d.value)]);
//
//     var chart = d3.select('.chart')
//       .attr('width', width)
//       .attr('height', height);
//
//     var bar = chart.selectAll('g')
//       .data(data)
//       .enter().append('g')
//       .attr('transform', (d, i) => 'translate(' + x(d.name) + ',0)');
//
//     bar.append('rect')
//       .attr('y', d => y(d.value))
//       .attr('width', x.rangeBand())
//       .attr('height', d => height - y(d.value));
//
//     bar.append('text')
//       .attr('x', x.rangeBand() / 2)
//       .attr('y', d => y(d.value) + 3)
//       .attr('dy', '.75em')
//       .text(d => d.name)
//   });
// };



// SVG AXIS
util.createCssClass('.bar', {
  fill: 'steelblue'
});

util.createCssClass('.bar:hover', {
  fill: 'brown'
});

util.createCssClass('.axis text', {
  font: '10px sans-serif'
});

util.createCssClass('.axis path, .axis line', {
  fill: 'none',
  stroke: '#000',
  'shape-rendering': 'crispEdges',
});

util.createCssClass('.x.axis path', {
   display: 'none'
});

var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/data.tsv", type, function(error, data) {
  x.domain(data.map(function(d) { return d.name; }));
  y.domain([0, d3.max(data, function(d) { return d.value; })]);

  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  chart.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.name); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .attr("width", x.rangeBand());
});

function type(d) {
  d.value = +d.value; // coerce to number
  return d;
}



  // var x = d3.domain(data.map(d => d.name));
  // var y = d3.domain([0, d3.max(data, d => d.value)]);
  //
  // g.append('g')
  //   .attr('class', 'axis axis--x')
  //   .attr('transform', 'translate(0, ' + height + ')')
  //   .call(d3.axisBottom(x));
  //
  // g.append('g')
  //   .attr('class', 'axis axis--y')
  //   .call(d3.axisLeft(y).ticks(10, '%'))
  //   .append('text')
  //   .attr('transform', 'rotate(-90)')
  //   .attr('y', 6)
  //   .attr('dy', '0.71em')
  //   .attr('text-anchor', 'end')
  //   .text('value');
  //
  //
  // g.selectAll('.bar')
  //   .data(data)
  //   .enter().append('rect')
  //   .attr('class', 'bar')
  //   .attr('x', d => x(d.name))
  //   .attr('y', d => y(d.value))
  //   .attr('width', x.bandwidth())
  //   .attr('height', d => height - y(d.value));
// });
};
