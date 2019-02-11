
// Importing FS, which is used to create the JSON file
const fs = require('fs');

// Function that ensures there are no duplicated names in gameData.json
function noDuplicateNames(array, name, num) {

    // Checks every existing name against the inputted name, returning true
    // only if none of the names match
    if (array.every((value, index, array) => value.nickname != name)) {

        // Returns the original name if the function has not recurred yet, and
        // returns the name with the correct number appended if it has
        return (num == 0) ? name : name.slice(0, -2) + '_' + num.toString(10);
        
    } else {

        // Calls the function again to ensure the next iteration of the name
        // does not already exist: uses an inline if statement to only remove
        // the last two characters if they are present (if num != 0)
        return noDuplicateNames(array,
                                (num == 0) ? name + '_' + (num + 1).toString(10) : name.slice(0, -2) + '_' + (num + 1).toString(10),
                                num + 1
                                );
    };
};

// Ensures the grid contains a) only valid cell type names, and
//                           b) the correct number of each cell type
function validateGrid(grid, validInputs, validInputTotals) {
    
    // Initialises an array the same length as
    let cellTypeCounts = new Array(validInputs.length).fill(0);

    // Iterates through each entry in the one-dimensional grid
    for (let cell in grid) {

        // Finding the index of the cell type in the list of valid inputs,
        // which in turn specifies the type of cell it is. Returns -1 if
        // the data is invalid
        let cellTypeIndex = validInputs.findIndex((element) => {return element == grid[cell]});
        
        // Checks if the inputted data was valid, returns false if not
        if (index == -1) {
            return false;
        } else {

            // Increments the respective count of the cell type
            cellTypeCounts[cellTypeIndex] ++;

            // Checks that the recently incremented cell type count is
            // less than or equal to the expected value, returns false if not
            if (cellTypeCounts[cellTypeIndex] > validInputTotals[cellTypeIndex]) {
                return false;
            };
        };
    };

    // Returns true if the grid passes both tests on every cell
    return true;
};

// Function to convert the player's form input on the grid page into a 2D array
function make2DArray(data, rows, cols) {

    // Defining vars
    let grid = [];
    let r = 0;
    let c = 0;

    // Iterating through rows and cols to initialise a blank
    // 2D array of the correct size 
    for (let i = 0; i < rows; i++) {
        grid.push([]);
        for (let j = 0; j < cols; j++) {
            grid[i].push("");
        };
    };

    // Iterating through the data and inserting it into the blank grid
    for (let cell in data) {

        // Using integer and remainder division to insert the data correctly
        grid[parseInt(r/rows)][c%cols] = data[cell];
        r++;
        c++;
    };

    // Returns the 2D-ified grid
    return grid;
};

// Defining what the module will export using Node's preferred notation,
// which allows my import statements to be consistent
module.exports = {

    initialiseGameData: function(id) {
        
        // Defining the structure of the JSON file:
        //  - 'id' will be the unique game ID, allowing for simultaneous games
        //  - 'players' will be an array, each element of which  will be a JS
        //    object representing a player in the game
        //  - 'grid' is be a 7x7 2D array that simply stores which squares have
        //    been visited and which are free. Syntax will be grid[6][4] for E7
        //    (letters replaced by numbers, reversed, and decremented by one)
        var gameData = {
            id: id,
            players: [],
            grid: [
                /* A  B  C  D  E  F  G */
           /* 1 */[0, 0, 0, 0, 0, 0, 0],
           /* 2 */[0, 0, 0, 0, 0, 0, 0],
           /* 3 */[0, 0, 0, 0, 0, 0, 0],
           /* 4 */[0, 0, 0, 0, 0, 0, 0],
           /* 5 */[0, 0, 0, 0, 0, 0, 0],
           /* 6 */[0, 0, 0, 0, 0, 0, 0],
           /* 7 */[0, 0, 0, 0, 0, 0, 0],
           ]
       };

        // Converting the JS object 'gameData' into a JSON formatted string
        var gameDataJSON = JSON.stringify(gameData);

        // Writing the JSON string to a JSON file
        fs.writeFile(
            // Inserting the ID into the filename for multiple instances
            'gameData' + id + '.json',
            gameDataJSON,
            'utf8',
            () => console.log('Local JSON database initialised')
            );
    },

    initialiseNewPlayer: function(formData) {

        // Reading the JSON data from the file matching the game ID, and
        // parsing it back to a JS object
        var gameData = JSON.parse(fs.readFileSync('gameData' + formData.game_id + '.json'));
        
        // Converting the inputted name to a non-duplicated version
        var newName = noDuplicateNames(gameData.players, formData.nickname, 0);

        // Defining the player data object:
        //  - 'nickname' is the name the player enters upon connecting
        //  - 'group' is the name of the group that the player belongs to
        //  - 'grid' is the player's personal grid with their item positions
        //  - 'currentBalance' and 'bankBalance' are the player's running total
        //    and safe (banked) totals respectively
        //  - 'shield' and 'mirror' are Boolean values expressing whether the
        //    player has the respective item
        //  - 'hitlist' is the list of the player's targets: this is used only
        //    to display cryptic messages to the players
        var playerData = {
            nickname: newName,
            group: formData.group_name,
            grid: [
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            ],
            currentBalance: 0,
            bankBalance: 0,
            shield: false,
            mirror: false,
            hitList: []
        };

        // Appending the new player to the JSON
        gameData.players.push(playerData);

        // Converting the object back to JSON
        var gameDataJSON = JSON.stringify(gameData);

        // Writing the JSON string back to the JSON file
        fs.writeFileSync('gameData' + formData.game_id + '.json', gameDataJSON);

        // Returns the now-unique name, to be saved as a cookie on the client
        return formData.game_id + newName;
    },

    initialisePlayerGrid: function(playerGrid, playerID, validInputs, validInputTotals) {

        // Removes the unnecessary 'request type' parameter from the POST request
        delete playerGrid.req_type;

        // Ensures that the grid is valid (contains only valid cell types,
        // and the correct amount of each)
        // if (!validateGrid(playerGrid, validInputs, validInputTotals)) {
        //     return "invalid";
        // };
        // THIS IS ONLY COMMENTED OUT BECAUSE IT'S A PAIN TO ENTER A VALID GRID
        // EVERY TIME. *DO NOT* FORGET TO UNCOMMENT IT WHEN NECESSARY!!!!!

        // Converts the player's form data to a 2D array
        let grid2D = make2DArray(playerGrid, 7, 7);

        // Separates the game ID from the nickname in the cookie
        let gameID = playerID.slice(0, 4);
        let playerName = playerID.slice(4);

        // Reading the JSON from file
        var gameData = JSON.parse(fs.readFileSync('gameData' + gameID + '.json'));

        // Iterates through each of the players in the database
        for (let playerI of gameData.players) {

            // Inserts the inputted grid into the correct player entry in the database
            if (playerI.nickname == playerName) {
                playerI.grid = grid2D;
                break;
            };
        };

        // Converting the object back to JSON
        var gameDataJSON = JSON.stringify(gameData);

        // Writing the JSON string back to the JSON file
        fs.writeFileSync('gameData' + gameID + '.json', gameDataJSON);

        // Returns the cleaned up grid, to be saved as a cookie on the client
        return grid2D;
    }
};
