
// Importing FS which is used to create the JSON file
const fs = require('fs');

// Defining what the module will export using Node's preferred
// notation which allows my import statements to be consistent
module.exports = {

	initialiseGameData: function(id) {
		
		var gameData = {
			id: id,
			players: {},	
			grid: []
		};

		var gameDataJSON = JSON.stringify(gameData);

		fs.writeFile(
			'gameData.json',
			gameDataJSON,
			'utf8',
			() => console.log('Local JSON database initialised')
			);
	}
}
