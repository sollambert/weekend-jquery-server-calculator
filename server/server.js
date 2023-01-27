const express = require('express');
const app = express();

app.use(express.static('server/public'));
app.use(express.urlencoded({extended: true}));

const PORT = 8000;

//Collection of strings representing past mathematical expressions
const history = [];

/**
 * Sends history array as payload when recieving a GET on /history
 */
app.get('/history', (req, res) => {
        res.send(history);
});

app.listen(PORT, () => {

});