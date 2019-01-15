
// Express setup
const express = require('express');
const app = express();
const port = 1337;

// Defining static directory
app.use(express.static('static'));

// Defining views
app.set('view engine', 'pug');
app.set('views', './views');

// Dealing with GET requests on all subdomains
app.get('/', (req, res) => res.render('home_view'));
app.get('/desktop', (req, res) => res.render('init_desktop_view'));
app.get('/mobile', (req, res) => res.render('init_mobile_view'));

// Listening...
app.listen(port, () => console.log('Pirate Game listening on port ' + port));
