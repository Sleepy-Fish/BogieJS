const fs = require('fs');
const doxdox = require('doxdox');
const classList = require('./classList.json');

doxdox.parseFiles(Object.values(classList).map(cls => cls.path), {
  parser: 'sleepyfish',
  layout: 'json'
}).then(content => {
  fs.writeFileSync('./dist/docs.json', JSON.stringify(content, null, 2));
});
