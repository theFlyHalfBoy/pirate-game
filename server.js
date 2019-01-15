const express = require('express');
const app = express();
const port = 1337;

app.use(express.static('static'));

app.set('view engine', 'pug');
app.set('views', './views');

app.get('/', (req, res) => res.render('main_desktop_view'));

app.listen(port, () => console.log('Example app listening on port ' + port));

