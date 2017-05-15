function createCssClass(name, content) {
  var style = document.createElement('style');
  style.type = 'text/css';

  var html = '\n' + name + ' {\n';
  for (var k in content) {
    html += k + ': ' + content[k] + ';\n';
  }

  html += '}';

  style.innerHTML = html;
  document.getElementsByTagName('head')[0].appendChild(style);
}

module.exports =  {
  createCssClass: createCssClass
};
