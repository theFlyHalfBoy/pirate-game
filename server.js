
// Importing my local modules
const handleData = require('./handleData.js');

//Importing generic Node modules needed throughout the program
const fs = require('fs');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest

// Express setup
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const port = 1337;

app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
}));
app.use(bodyParser.json());

app.use(cookieParser());

// Defining static files directory
app.use(express.static('static'));
app.use(express.static('gameData'));

// Defining views with Pug
app.set('view engine', 'pug');
app.set('views', './views');

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// Dealing with GET requests on all subdomains
app.get('/', (req, res) => res.render('home_view'));

app.get('/desktop', (req, res) => {

    // Initialises the JSON database and renders the initial desktop view
    res.render('init_desktop_view', { gameID: handleData.initialiseGameData(), playerNames: [] });

});

app.get('/mobile', (req, res) => res.render('init_mobile_view'));

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// Dealing with POST requests on specific subdomains
app.post('/mobile', (req, res) => {

    // Finds the request type from the invisible text box in the form
    let reqTypeM = req.body.req_type;

    // Checking which input form is being used:
    // This denotes a request from the player login page
    if (reqTypeM == 'login_page') {

        // Initialises a new player using their form inputs, sets a cookie on the browser
        // that saves the game ID and unique nickname in one unique string, and renders 
        // the next mobile page
        res.cookie('player_id', handleData.initialiseNewPlayer(req.body)).render('input_mobile_view');

    // This denotes a request from the player grid input sreen
    } else if (reqTypeM == 'player_grid') {

        // Initialises the player grid in the JSON database, passing the accepted values
        // and their respective expected counts to the function
        let grid = handleData.initialisePlayerGrid(req.body, req.cookies.player_id,
        ["200", "1000", "3000", "5000", "shield", "mirror", "knife", "choose", "double", "bomb", "swap", "skull", "gift", "rob", "bank"],
        [ 25,    10,     2,      1,      1,        1,        1,       1,        1,        1,      1,      1,       1,      1,     1    ]);

        // Checks the result of intitialisePlayerGrid, and re-renders the grid page if required
        if (grid == "invalid") {
            res.render('input_mobile_view');
        } else {

            // Otherwise, sets a cookie with the player's personal grid, and renders the next page
            res.cookie('player_grid', grid).render('game_mobile_view', { grid: grid });
        };

    // Denotes an unrecognised request: logs an error but does nothing otherwise
    } else {
        console.log("Request not recognised");
    }
});

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// Listening...
app.listen(port, () => console.log('Pirate Game listening on port ' + port));
