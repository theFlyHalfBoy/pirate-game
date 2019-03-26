
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
    limit: '1kb'
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

// Dealing with POST requests on the mobile subdomain
app.post('/mobile', (req, res) => {

    // Finds the request type from the invisible text box in the form
    let reqTypeM = req.body.req_type;

    // Checking which input form is being used:
    switch (reqTypeM) {

        // Denotes a request from the player login page
        case 'login_page':

            // Initialises a new player using their form inputs, sets cookies on the browser
            // that saves the game ID and unique nickname , and renders the next mobile page
            let IDAndNickname = handleData.initialiseNewPlayer(req.body);
            res.cookie('game_id', IDAndNickname[0])
            res.cookie('player_nickname', IDAndNickname[1]).render('input_mobile_view');

            break;

        // This denotes a request from the player grid input sreen
        case 'player_grid':

            // Initialises the player grid in the JSON database, passing the accepted values
            // and their respective expected counts to the function
            let grid = handleData.initialisePlayerGrid(req.body, req.cookies.game_id, req.cookies.player_nickname
            ["200", "1000", "3000", "5000", "shield", "mirror", "knife", "choose", "double", "bomb", "swap", "skull", "gift", "rob", "bank"],
            [ 25,    10,     2,      1,      1,        1,        1,       1,        1,        1,      1,      1,       1,      1,     1    ]);

            // Checks the result of intitialisePlayerGrid, and re-renders the grid page if required
            if (grid == "invalid") {
                res.render('input_mobile_view');
            } else {

                // Otherwise, sets a cookie with the player's personal grid, and renders the next page
                res.cookie('player_grid', grid).render('game_mobile_view', { grid: grid, gameID: req.cookies.game_id });
            };

            break;

        // Denotes an unrecognised request: logs an error but does nothing otherwise
        default:
            console.log("Request not recognised");
    }
});

// Dealing with POST requests on the desktop subdomain
app.post('/desktop', (req, res) => {

    let reqTypeD = req.body.req_type;
    let gameID = req.body.game_id;

    // Checking which input form is being used
    switch (reqTypeD) {

        // Denotes a request from the initial desktop view
        case 'game_init':

            // Fetches the current game grid and "choose next square" list from the gameData JSON
            let gridAndChooseList = handleData.getGridAndChooseList(gameID);

            // Renders the in-game desktop view with the fetched grid and list
            res.render('game_desktop_view', { gameID: gameID, grid: gridAndChooseList[0], chooseList: gridAndChooseList[1] });

            break;

        // Denotes an unrecognised request: logs an error but does nothing otherwise
        default:
            console.log("Request not recognised");
    }
});

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// Listening...
app.listen(port, () => console.log('Pirate Game listening on port ' + port));
