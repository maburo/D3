const util = require('./util');

module.exports = function() {
util.createCssClass('text', { font: 'bold 48px monospace' } );
util.createCssClass('.enter', { fill: 'green'} );
util.createCssClass('.update', { fill: '#333'} );

var alphabet = "abcdefghijklmnopqrstuvwxyz".split('');

var svg = d3.select('body').append('svg')
  .attr('width', '800px')
  .attr('height', '600px');

var width = +svg.attr('width'), height = +svg.attr('height');
var g = svg.append('g').attr('transform', 'translate(32,' + (600/2) + ')');

function update(data) {
  var text = g.selectAll('text').data(data);

  text.attr('class', 'update');

  text.enter().append('text')
    .attr('class', 'enter')
    .attr('x', (d, i) => i * 32)
    .attr('dy', '.35em')
    // .merge(text)
    .text(d => d);

  text.exit().remove();
}

update(alphabet)

setInterval(function () {
  update(
    d3.shuffle(alphabet)
      .slice(0, (Math.floor(Math.random() * 26)))
      // .sort()
    )
    },
  1500);
// d3.interval(() => {
//   update(d3.shuffle(alphabet).slice(0, Math.floor(Math.random() * 26).sort()))
// }, 1500)
};
