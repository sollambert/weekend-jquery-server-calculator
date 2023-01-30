$(() => {
        onReady();
});

let exp = '';

function onReady() {
        $(document).on('click', '#eq-btn', getCalcValues);
        $(document).on('click', '.calc-btn', addToExpression);
        $(document).on('click', '#clr-btn', clearExp);
        $(document).on('click', '#clr-history-btn', clearHistory);
        $(document).on('click', '.history', redoExpression);
        getHistory();
}

function clearExp() {
        $('#expression').val('');
}

function clearHistory() {
        slay.del('/history');
        getHistory();
}

function redoExpression () {
        let expString = $(this).text();
        expString = expString.split('=')[0];
        $('#expression').val(expString);
}

function getCalcValues() {
        let exp = $('#expression').val();
        let payload = {expression: exp};
        if (!exp.match(/[^0-9.^*\/+-]/)) {
                postExpression(payload);
        } else {
                render('#div-result', '<strong>Bad input, do not use letters or double operators (negative values following an operator are fine)</strong>')
        }
        $('#expression').val('');
        getHistory();
}

function addToExpression() {
        let btn = $(this);
        let value = btn.val();
        let exp = $('#expression').val();
        $('#expression').val(`${exp}${value}`);
}

function postExpression(payload) {
        slay.post('/eval', payload).then((res) => {
                let result = res;
                render('#div-result', `<strong>${result}</strong>`);
        }).catch((err) => {
                if (err.status == 400) {
                        render('#div-result', '<strong>Bad input, do not use letters or double operators (negative values following an operator are fine)</strong>')
                }
        });
}

function getHistory() {
        renderHistory(slay.get('/history'));
}

function renderHistory(promise) {
        promise.then((res) => {
                let history = res;
                let renderString = '';
                console.log(history);
                for (let i in history) {
                        renderString += `
                        <div id='history-${i}'>
                          <p class='history'>${history[i]}</p>
                        </div>`
                }
                render('#div-history', renderString);
        });
}

function render(id, string, className, remove) {
        $(id).empty();
        $(id).append(string);
        if (className) {
                if (remove) {
                        $(id).removeClass(className);
                } else {
                        $(id).addClass(className);
                }
        }
}