function recurParenthesis(arr) {
        let result = 0;
        for (let i = 0; i < arr.length; i ++) {
                if (arr[i] == '(');
                recurParenthesis(arr.split(i, arr.length - i))
        }
        for (let i = 0; i < arr.length; i ++) {
                if (arr[i] == ')') {
                        result = eval(arr.splice(arr2.lastIndexOf('('), i));
                }
        }
}