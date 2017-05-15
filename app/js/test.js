module.exports = function() {

  d3.json('/data/tweets.json', (error, data) => {
    histogram(data.tweets);
  });

  function histogram(tweets) {
    var xScale = d3.scale.linear().domain([0, 5]).range([0, 500]);
    var yScale = d3.scale.linear().domain([0, 10]).range([400, 0]);

    var xAxis = d3.svg.axis().scale(xScale).ticks(5).orient('bottom');
    var histoChart = d3.layout.histogram();

    histoChart.binds([0, 1, 2, 3, 4, 5]).value(d => d.favorites.length);
    histoData = histoChart(tweets);

    d3.select('svg').selectAll('rect').data(histoData).enter()
      .append('rect')
        .attr('x', d => xScale(d.x))
        .attr('y', d => yScale(d.y))
        .attr('width', x)
  }
};
