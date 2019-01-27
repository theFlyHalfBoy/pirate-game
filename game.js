function getPlayerData() {

    const fs = require('fs');

    var form = document.getElementById('mobile_play_form');
    console.log(form);

    fs.readFile('./gameData')
}