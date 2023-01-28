const express = require('express');
const app = express();

app.use(express.static('server/public'));
app.use(express.urlencoded({ extended: true }));

let ops = ['+', '-', '/', '*'];

let opsRegex = new RegExp("(?<=[-+*/])|(?=[-+*/])");

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
        console.log(req.body.expression)
        let cleanInput = checkCleanInput(req.body.expression);
        if (cleanInput) {
                let splitExp = req.body.expression.split(opsRegex);
                console.log(splitExp);
                let expression = '';
                let result = 0;
                for (let i in splitExp) {
                        expression += splitExp[i];
                        if (evalOp(splitExp[i])) {
                                splitExp[i] = opToObject(splitExp[i]);
                                //console.log(splitExp);
                                if (splitExp[i].op == '-' && ops.includes(splitExp[i - 1].op)) {
                                        splitExp[i] = splitExp[i].op + splitExp[Number(i) + 1];
                                        console.log(splitExp);
                                        splitExp.splice(Number(i) + 1, 1);
                                        i--;
                                }
                        }
                }
                result = evalOps(splitExp);
                console.log(result);
                expression += `=${result}`;
                history.push(expression);
                res.send(`${result}`);
        } else {
                res.sendStatus(400);
        }
});

app.listen(PORT, () => {

});

function checkCleanInput(exp) {
        for (let i = 0; i < exp.length; i++) {
                if (ops.includes(exp[i]) && ops.includes(exp[i - 1]) && exp[i] != '-') {
                        return false;
                } else if (exp.match(/[A-Za-z]/) != undefined) {
                        return false;
                }
        }
        return true;
}

function evalOps(arr) {
        console.log(arr);
        let weight = 3;
        let result = 0;
        while (weight > 0) {
                for (let i = 0; i < arr.length; i++) {
                        if (arr[i].wgt == weight) {
                                arr[i - 1] = arr[i].func([arr[i - 1], arr[Number(i) + 1]]);
                                arr.splice(i, 2);
                                i -= 2;
                                result = arr[i + 1];
                        }
                }
                weight--;
        }
        return result;
}

function opToObject(op) {
        let wgt = 0;
        switch (op) {
                case '*':
                        wgt = 2;
                        break;
                case '/':
                        wgt = 2;
                        break;
                case '+':
                        wgt = 1;
                        break;
                case '-':
                        wgt = 1;
        }
        return { op, func: evalOp(op), wgt }
}

function factorOrder(arr) {
        for (let i in arr) {
        }
        return arr.sort((a, b) => b.wgt - a.wgt);
}

function add(nums) {
        let result = Number(nums[0]);
        for (let i = 1; i < nums.length; i++) {
                console.log(`adding ${result} to ${nums[i]}`)
                result += Number(nums[i]);
        }
        console.log('result', result);
        return result;
}

function sub(nums) {
        let result = Number(nums[0]);
        for (let i = 1; i < nums.length; i++) {
                console.log(`subbing ${result} to ${nums[i]}`)
                result -= Number(nums[i]);
        }
        console.log('result', result);
        return result;
}

function mult(nums) {
        let result = Number(nums[0]);
        for (let i = 1; i < nums.length; i++) {
                console.log(`mult ${result} to ${nums[i]}`)
                result *= Number(nums[i]);
        }
        console.log('result', result);
        return result;
}

function div(nums) {
        let result = Number(nums[0]);
        for (let i = 1; i < nums.length; i++) {
                console.log(`div ${result} to ${nums[i]}`)
                result /= Number(nums[i]);
        }
        console.log('result', result);
        return result;
}


function evalOp(operator) {
        switch (operator) {
                case '+':
                        return add;
                case '-':
                        return sub;
                case '*':
                        return mult;
                case '/':
                        return div;
        }
        return;
}