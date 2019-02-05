
// Importing my local modules
const handleData = require('./handleData.js');

//Importing generic Node modules needed throughout the program
const fs = require('fs');

// Express setup
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const port = 1337;

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json());

app.use(cookieParser());

// Defining static directory
app.use(express.static('static'));

// Defining views with Pug
app.set('view engine', 'pug');
app.set('views', './views');

// Dealing with GET requests on all subdomains
app.get('/', (req, res) => res.render('home_view'));

app.get('/desktop', (req, res) => {
    
    // Initialising the gameData JSON file
    handleData.initialiseGameData(port);

    // Using Pug to render the initial desktop view
    res.render('init_desktop_view');
});

app.get('/mobile', (req, res) => res.render('init_mobile_view'));

// Dealing with POST requests on specific subdomains
app.post('/mobile', (req, res) => {

    // Finds the request type from the invisible text box in the form
    reqType = req.body.req_type

    // Checking which input form is being used:
    // This denotes a request from the player login page
    if (reqType == 'login_page') {

        // Initialises a new player using their form inputs, and sets a cookie on the
        res.cookie('id', handleData.initialiseNewPlayer(req.body)).render('input_mobile_view');

    } else if (reqType == 'player_grid') {

        // Initialises
        let grid = handleData.initialisePlayerGrid(req.body);

        res.cookie('grid', grid).render('game_mobile_view');
    }
});

// Listening...
app.listen(port, () => console.log('Pirate Game listening on port ' + port));
