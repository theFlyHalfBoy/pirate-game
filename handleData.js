
// Importing FS, which is used to create the JSON file
const fs = require('fs');

// Defining what the module will export using Node's preferred
// notation which allows my import statements to be consistent
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
            nickname: formData.nickname,
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
    }
}
