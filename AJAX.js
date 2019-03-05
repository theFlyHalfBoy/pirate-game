
function updatePlayers(gameID) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log(JSON.parse(this.responseText));
           }
        };
    xhttp.open("GET", "gameData" + gameID + ".json", true);
    xhttp.send();
}