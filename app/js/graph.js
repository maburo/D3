var util = require('./util.js');

module.exports = () => {
  util.createCssClass('.grid', {
    stroke: 'black',
    'stroke-width': '1px',
    fill: 'red'
  });

  util.createCssClass('.arc', {
    stroke: 'black',
    fill: 'none'
  });
  util.createCssClass('.node', {
    fill: 'lightgray',
    stroke: 'black',
    'stroke-width': '1px'
  });
  util.createCssClass('circle.active', {
    fill: 'red'
  });
  util.createCssClass('path.active', {
    stroke: 'red'
  });

  const svg = d3.select('body').append('svg').attr('width', 500).attr('height', 500);

  function adjacency() {
    Promise.all([
      new Promise((resolve, reject) => d3.csv('/data/edgelist.csv', (err, data) => resolve(data))),
      new Promise((resolve, reject) => d3.csv('/data/nodelist.csv', (err, data) => resolve(data)))
    ])
    .then(createAdjacencyMatrix)
  }

  function createAdjacencyMatrix(data) {
    var edges = data[0], nodes = data[1];

    var edgeHash = {};
    edges.forEach(e => edgeHash[e.source + '-' + e.target] = e);


    var matrix = [];
    for (var a in nodes) {
      for (var b in nodes) {
        var grid = { id: nodes[a].id + '-' + nodes[b].id, x: b, y: a, weight: 0 };
        if (edgeHash[grid.id]) {
          grid.weight = edgeHash[grid.id].weight;
        }

        matrix[matrix.length] = grid;
      }
    }

    console.log(matrix);

    svg.append('g')
      .attr('transform', 'translate(50, 50)')
      .attr('id', 'adjacencyG')
      .selectAll('rect')
      .data(matrix)
      .enter()
      .append('rect')
      .attr('class', 'grid')
      .attr('width', 25)
      .attr('height', 25)
      .attr('x', d => d.x * 25)
      .attr('y', d => d.y * 25)
      .style('fill-opacity', d => d.weight * .2)
  }


  adjacency();
};
