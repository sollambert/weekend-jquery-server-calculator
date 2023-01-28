const express = require('express');
const app = express();

app.use(express.static('server/public'));
app.use(express.urlencoded({ extended: true }));

let ops = ['+', '-', '/', '*', '^'];

let opsRegex = new RegExp("(?<=[-+*/^])|(?=[-+*/^])");

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
        console.log(req.body.expression);
        let cleanInput = checkCleanInput(req.body.expression);
        console.log(cleanInput);
        if (cleanInput) {
                let splitExp = req.body.expression.split(opsRegex);
                //console.log(splitExp);
                let expression = '';
                let result = 0;
                let refactored = refactorToOpsAndRands(splitExp, expression);
                expression = refactored.expString;
                splitExp = refactored.arr;
                result = evalExp(splitExp);
                console.log(result);
                expression += `=${result}`;
                history.push(expression);
                res.send(`${result}`);
        } else {
                res.sendStatus(400);
        }
});

function refactorToOpsAndRands(arr, expString) {
        for (let i in arr) {
                if (evalOp(arr[i])) {
                        arr[i] = opToObject(arr[i]);
                        //console.log(arr);
                        if (i != 0 && arr[i].op == '-' && ops.includes(arr[i - 1].op)) {
                                arr[i] = arr[i].op + arr[Number(i) + 1];
                                console.log(arr);
                                arr.splice(Number(i) + 1, 1);
                                i--;
                                expString += arr[i+1];
                        } else if (i == 0 && arr[i].op == '-'){
                                arr[i] = arr[i].op + arr[Number(i) + 1];
                                console.log(arr);
                                arr.splice(Number(i) + 1, 1);
                                i--;
                                expString += arr[i+1];
                        } else {
                                expString += arr[i].op;
                        }
                }else {

                        expString += arr[i];
                }
        }
        return {arr, expString};
}

app.listen(PORT, () => {

});

/*function recurParenthesis(arr) {
        let result = 0;
        let lastParen
        console.log(arr);
        for (let i = 0; i < arr.length; i ++) {
                if (arr[i] == '(') {
                        recurParenthesis(arr.splice(i, arr.length - i))
                }
        }
        for (let i = 0; i < arr.length; i ++) {
                if (arr[i] == ')') {
                        result = evalExp(arr.slice(arr.slice(0,i-1).lastIndexOf('('), i));
                }
        }
        return result;
}

function recurParenthesis(arr, index) {
        let result = 0;
        console.log(arr);
        for (let i = 0; i < arr.length; i ++) {
                if (arr[i] == '(') {
                recurParenthesis(arr.splice(i, arr.length - i))
                }
        }
        for (let i = 0; i < arr.length; i ++) {
                if (arr[i] == ')') {
                        result = evalExp(arr.splice(arr.lastIndexOf('('), i));
                }
        }
        return result;
}*/

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


function evalExp(arr) {
        console.log(arr);
        let weight = 3;
        let result = 0;
        while (weight > 0) {
                let weightedResult = evalWeightedExp(arr, weight);
                if (weightedResult != 0) {
                        result = weightedResult;
                }
                weight--;
        }
        return result;
}

function evalWeightedExp(arr, weight) {
        let result = 0;
        for (let i = 0; i < arr.length; i++) {
                if (arr[i].wgt == weight) {
                        arr[i - 1] = arr[i].func([arr[i - 1], arr[Number(i) + 1]]);
                        arr.splice(i, 2);
                        i -= 2;
                        result = arr[i + 1];
                }
        }
        return result;
}

function opToObject(op) {
        let wgt = 0;
        switch (op) {
                case '^':
                        wgt = 3;
                        break;
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

function exp(nums) {
        let result = Number(nums[0]);
        for (let i = 1; i < nums.length; i++) {
                console.log(`exp ${result} to pow ${nums[i]}`)
                result **= Number(nums[i]);
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
                case '^':
                        return exp;
        }
        return;
}