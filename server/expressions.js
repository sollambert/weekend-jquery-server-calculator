//array of accepted operators
const ops = ['+', '-', '/', '*', '^'];

//regex for splitting array by operator
const opsRegex = new RegExp("(?<=[-+*/^])|(?=[-+*/^])");

//prefix to prepend logs
const expPrefix = 'Expressions:'

function parseExpression(str) {
        return Number(evalExp(refactor(splitByOps(str))));
}

//function for splitting array into operator objects and check for negative values following operators
function refactor(arr) {
        //iterate through array
        for (let i in arr) {
                //check if array at index is a valid operator
                if (evalOp(arr[i])) {
                        //create operator object containing {op character, op function, weight}
                        arr[i] = opToObject(arr[i]);
                        //check if first index is '-' or if array at i is '-' and is preceded by an operator
                        if ((i != 0 && arr[i].op == '-' && ops.includes(arr[i - 1].op))
                        || i == 0 && arr[i].op == '-') {
                                //convert array at i to a string representing a negative version of proceeding value 
                                arr[i] = arr[i].op + arr[Number(i) + 1];
                                //remove proceeding value from array
                                arr.splice(Number(i) + 1, 1);
                                i--;
                        }
                }
        }
        return arr;
}

//function to begin evaluation of expression split into array an array containing operands and operator objects
function evalExp(arr) {
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

//function to evaluate all expressions by weighted value according to order of operation
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

//function for getting associated function of char representing operator
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
                // case '%':
                //         return mod;
                case '^':
                        return exp;
        }
        return;
}

//recieves char representing operator
//returns an object containing operator character 'op', associated function 'func' and weight according to order of operations
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
                case '%':
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

//function for checking validity of a string expression
//returns true or false depending on validity of input
function clean(exp) {
        for (let i = 0; i < exp.length; i++) {
                if (ops.includes(exp[i]) && ops.includes(exp[i - 1]) && exp[i] != '-') {
                        console.log(expPrefix, 'Input rejected for 2 consecutive operators (non-negative)');
                        return false;
                } else if (exp[i] == '-'
                && exp[i-1] == '-'
                && exp[i-2] == '-') {
                        console.log(expPrefix, 'Input rejected for >2 consecutive \'-\' operators');
                        return false;
                } else if (evalOp(exp[0])) {
                        console.log(expPrefix, 'Input rejected for operator at start of expression');
                        return false;
                } else if (evalOp(exp[exp.length -1])) {
                        console.log(expPrefix, 'Input rejected for operator at end of expression');
                        return false;
                } else if (exp.match(/[A-Za-z]/)) {
                        console.log(expPrefix, 'Input rejected for non-numeric characters');
                        return false;
                }
        }
        return true;
}

//splits array by regex that looks for operators and maintains integrity of non-operator strings within array
function splitByOps(str){
        return str.split(opsRegex);
}

//function for addition of an array of numbers
//returns total sum
function add(nums) {
        let result = Number(nums[0]);
        for (let i = 1; i < nums.length; i++) {
                console.log(expPrefix, `${result} add ${nums[i]}`)
                result += Number(nums[i]);
        }
        console.log(expPrefix, 'result', result);
        return result;
}

//function for subtraction of an array of numbers
//returns total subtraction of elements of array starting with the first value
function sub(nums) {
        let result = Number(nums[0]);
        for (let i = 1; i < nums.length; i++) {
                console.log(expPrefix, `${result} sub ${nums[i]}`)
                result -= Number(nums[i]);
        }
        console.log(expPrefix, 'result', result);
        return result;
}

//function for multiplication of an array of numbers
//returns total multiplication of elements of array starting with the first value
function mult(nums) {
        let result = Number(nums[0]);
        for (let i = 1; i < nums.length; i++) {
                console.log(expPrefix, `${result} mult ${nums[i]}`)
                result *= Number(nums[i]);
        }
        console.log(expPrefix, 'result', result);
        return result;
}

//function for division of an array of numbers
//returns total division of elements of array starting with the first value
function div(nums) {
        let result = Number(nums[0]);
        for (let i = 1; i < nums.length; i++) {
                console.log(expPrefix, `${result} div ${nums[i]}`)
                result /= Number(nums[i]);
        }
        console.log(expPrefix, 'result', result);
        return result;
}

//function for exponentation of an array of numbers
//returns total exponentation of elements of array starting with the first value
function exp(nums) {
        let result = Number(nums[0]);
        for (let i = 1; i < nums.length; i++) {
                console.log(expPrefix, `${result} pow ${nums[i]}`)
                result **= Number(nums[i]);
        }
        console.log(expPrefix, 'result', result);
        return result;
}

//function for modulo of an array of numbers
//returns total modulo of elements of array starting with the first value
function mod(nums) {
        let result = Number(nums[0]);
        for (let i = 1; i < nums.length; i++) {
                console.log(expPrefix, `${result} mod ${nums[i]}`)
                result = result % Number(nums[i]);
        }
        console.log(expPrefix, 'result', result);
        return result;
}


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

module.exports = {parseExpression, clean}