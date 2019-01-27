
// Importing my local modules
const initialise = require('./initialise.js');

//Importing Node modules needed throughout the program, for bundling
const fs = require('fs');

// Express setup
const express = require('express');
const app = express();
const port = 1337;

// Defining static directory
app.use(express.static('static'));

// Defining views with Pug
app.set('view engine', 'pug');
app.set('views', './views');

// Dealing with GET requests on all subdomains
app.get('/', (req, res) => res.render('home_view'));
app.get('/desktop', (req, res) => {
    // Using Pug to render the initial desktop view
	res.render('init_desktop_view');
    // Initialising the gameData JSON file
	initialise.initialiseGameData(port);
	});
app.get('/mobile', (req, res) => res.render('init_mobile_view'));

// Listening...
app.listen(port, () => console.log('Pirate Game listening on port ' + port));
