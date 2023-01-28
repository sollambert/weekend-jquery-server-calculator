const e = require('express');
const express = require('express');
const expressions = require('./expressions.js')
const app = express();

app.use(express.static('server/public'));
app.use(express.urlencoded({ extended: true }));

let expString = '';

const PORT = 8000;

//Collection of strings representing past mathematical expressions
const history = [];

/**
 * Sends history array as payload when recieving a GET on /history
 */
app.get('/history', (req, res) => {
        res.send(history);
});

app.post('/eval', (req, res) => {
        let expression = req.body.expression;
        console.log(`Recieved expression: ${expression}`)
        let cleanInput = expressions.clean(expression);
        if (cleanInput) {
                let splitExp = expressions.splitByOps(expression);
                let refactors = expressions.refactor(splitExp, expString);
                splitExp = refactors.arr;
                expString = refactors.expString;
                let result = expressions.evalExp(splitExp).toFixed(5);
                expString += `=${result}`;
                history.push(expString);
                res.send(`${result}`);
                initializeExpString();
        } else {
                res.sendStatus(400);
        }
});

function initializeExpString() {
        expString = '';
}

app.listen(PORT, () => {

});
