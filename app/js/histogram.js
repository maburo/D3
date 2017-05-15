module.exports = function() {
  const util = require('./util');

  util.createCssClass('svg', {
    height: '500px',
    width: '500px',
    border: '1px solid gray'
  });

  util.createCssClass('rect', {
    fill: 'lightgray',
    stroke: 'black',
    'stroke-width': '1px'
  });

  util.createCssClass('line', {
    'shape-rendering': 'crispEdges',
    stroke: '#000000'
  });

  util.createCssClass('line.minor', {
    stroke: '#777777',
    'stroke-dasharray': '2,2'
  });

  util.createCssClass('path.domain', {
    fill: 'none',
    stroke: 'black'
  });

  d3.select('body').append('svg');

  d3.json('/data/tweets.json', (error, data) => histogram(data.tweets));

  function histogram(tweets) {
    var xScale = d3.scale.linear().domain([0, 5]).range([0, 500]);
    var yScale = d3.scale.linear().domain([0, 10]).range([400, 0]);

    var xAxis = d3.svg.axis().scale(xScale).ticks(5).orient('bottom');
    var histoChart = d3.layout.histogram();

    histoChart.bins([0, 1, 2, 3, 4, 5]).value(d => d.favorites.length);
    var histoData = histoChart(tweets);

    d3.select('svg').selectAll('rect').data(histoData).enter()
      .append('rect')
        .attr('x', d => xScale(d.x))
        .attr('y', d => yScale(d.y))
        .attr('width', xScale(histoData[0].dx) - 2)
        .attr('height', d => 400 - yScale(d.y))
        .on('click', retweets);

    d3.select('svg').append('g').attr('class', 'x axis')
      .attr('transform', 'translate(0, 400)').call(xAxis);

    d3.select('g.axis').selectAll('text').attr('dx', 50);

    var type = 'favorites';

    function retweets() {
      type = type === 'favorites' ? 'retweets' : 'favorites';
      histoChart.value(d => d[type].length);

      histoData = histoChart(tweets);

      d3.selectAll('rect').data(histoData)
        .transition().duration(500)
          .attr('x', d => xScale(d.x))
          .attr('y', d => yScale(d.y))
          .attr('height', d => 400 - yScale(d.y));
    }
  }
};
