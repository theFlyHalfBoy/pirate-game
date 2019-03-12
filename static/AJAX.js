
function updatePlayers(gameID) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let gameData = JSON.parse(this.responseText);
                let playerNamesArr = [];
                for (i = 0; i < gameData.players.length - 1; i++) {
                    playerNamesArr.append(gameData.players[i].nickname);
                }
                document.getElementById("playerNamesBox").innerHTML = playerNamesArr;
           };
        };
    xhttp.open("GET", "gameData" + gameID + ".json", true);
    xhttp.send();
};