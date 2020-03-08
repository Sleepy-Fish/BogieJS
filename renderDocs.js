const fs = require('fs');
const doxdox = require('doxdox');

// Globbing doesnt work on linux... boo.
const classes = [
  'src/geom/Circle.js',
  'src/geom/Point.js',
  'src/geom/Rectangle.js',
  'src/geom/Spacial.js',
  'src/geom/Vector.js',
  'src/physics/World.js'
];

doxdox.parseFiles(classes, {
  parser: 'sleepyfish',
  layout: 'bogie'
}).then(content => {
  fs.writeFileSync('./dist/index.html', content);
});
