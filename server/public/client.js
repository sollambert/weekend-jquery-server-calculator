$(() => {
        onReady();
});

let exp = '';

function onReady() {
        $(document).on('click', '#eq-btn', getCalcValues);
        $(document).on('click', '.calc-btn', addToExpression);
        $(document).on('click', '#clr-btn', clearExp);
        getHistory();
}

function clearExp() {
        $('#expression').val('');
}

function getCalcValues() {
        let exp = $('#expression').val();
        let payload = {expression: exp};
        postExpression(payload);
        getHistory();
}

function addToExpression() {
        let btn = $(this);
        let value = btn.val();
        let exp = $('#expression').val();
        $('#expression').val(`${exp}${value}`);
}

function postExpression(payload) {
        renderLast(slay.post('/eval', payload));
}

function getHistory() {
        renderHistory(slay.get('/history'));
}

function renderLast(promise) {
        promise.then((res) => {
                let result = res;
                render('#div-result', `<strong>${result}</strong>`);
        }).catch((err) => {
                if (err == 400) {
                        render('#div-result', '<strong>Bad input, do not use letters or double operators (negative values following an operator are fine)<strong>')
                }
        });
}

function renderHistory(promise) {
        promise.then((res) => {
                let history = res;
                let renderString = '';
                console.log(history);
                for (let i in history) {
                        renderString += `
                        <div id='history-${i}'>
                          <p>${history[i]}</p>
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