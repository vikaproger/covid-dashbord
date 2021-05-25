const path = require('path');
module.exports = {
  mode:"development",
    entry: [`./src/js/controller.js`, `./src/js/table.js`, `./src/js/graphic.js`,`./src/js/keyboard.js`],
    output: {
      path: path.resolve('./src/build/'),
      filename: 'bundle.js'
    }
};