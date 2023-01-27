$(() => {
        onReady();
});

function onReady() {
        getHistory();
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
                          <p>${history[i]}</p>
                        </div>`
                }
                render('#div-history', renderString);
        })
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