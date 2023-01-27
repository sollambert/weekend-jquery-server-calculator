$(() => {
        onReady();
});

let exp = '';

function onReady() {
        $(document).on('click', 'btn-eq', getCalcValues);
        getHistory();
}

function getCalcValues() {
        let num1 = $('#num-1');
        let num2 = $('#num-2');
        let payload = `${num1}|${exp}|${num2}`;
        putExpression(payload);
}

function putExpression(payload) {
        renderLast(slay.post('/eval', payload));
}

function getHistory() {
        renderHistory(slay.get('/history'));
}

function renderLast(promise) {
        promise.then((res) => {
                let result = res;
                render('#div-result', `<strong>${result}</strong>`);
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