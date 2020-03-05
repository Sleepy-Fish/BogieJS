const doxdox = require('doxdox');
doxdox.parseFile('./src/geom/Spacial.js').then(output => {
  for (const method of output.methods) {
    console.log(method);
  }
});
