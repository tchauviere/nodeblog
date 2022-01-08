const App = require('./app/core/kernel');
const path = require('path');

console.log('Start NodeJS Server with NodeBlog Project ...');
const app = new App(path.resolve());
app.run();