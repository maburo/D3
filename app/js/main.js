'use strict';

window.genData = function() {
	var size = 4 + Math.floor(Math.random() * 10);
	data.length = size;
	for (var i = 0; i < size; i++) {
		data[i] = Math.floor(Math.random() * 10);
	}
}

var data = [];
genData();

// d3.select('body').append('p').text('hello world');

// d3.select('body').selectAll('p')
// 	.data(data)
// 	.enter()
// 	.append('p')
// 	.attr('class', d => d % 2 === 0 ? 'red' : 'blue')
// 	.style('font-weight', 'bold')
// 	.style('color', d => d % 2 === 0 ? 'red' : 'blue')
// 	.text(d => d);
//
// d3.select('body').selectAll('div')
// 	.data(data)
// 	.enter()
// 	.append('div')
// 	.attr('class', 'bar')
// 	.style('height', d => d + 'px');

var svg = d3.select('body').append('svg');
var h = 50;
svg.attr('width', 500).attr('height', h);
var circles = svg.selectAll('circle')
	.data(data)
	.enter()
	.append('circle');

circles.attr('cx', (d, i) => (i * 50) + 25)
	.attr('cy', h/2)
	.attr('r', d => d)
	.attr('fill', 'yellow')
	.attr('stroke', 'orange')
	.attr('stroke-width', d => d/2);
