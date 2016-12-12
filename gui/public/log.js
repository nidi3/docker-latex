require('./log.css');

const log = document.getElementById('log');

const callback = {
    error: () => {
    },
    errorClick: () => {
    }
};

module.exports = {
    onError: function (f) {
        callback.error = f;
    },
    onErrorClick: function (f) {
        callback.errorClick = f;
    },
    set: function (text) {
        let errorPos = text.indexOf('\n./main.tex:');
        let firstLine;
        while (errorPos >= 0) {
            const line = parseInt(text.substring(errorPos + 12, text.indexOf(':', errorPos + 12)));
            const errorEnd = text.indexOf('\n', errorPos + 1);
            text = text.substring(0, errorPos + 1) +
                '<span class="error" data-line="' + line + '">' + text.substring(errorPos + 1, errorEnd) + '</span>' +
                text.substring(errorEnd);
            firstLine = firstLine || line;
            errorPos = text.indexOf('\n./main.tex:', errorEnd);
        }
        log.innerHTML = text.replace(/\n/g, '<br>');
        log.querySelectorAll('.error').forEach(e => e.onclick = () => callback.errorClick(e.getAttribute('data-line')));
        if (firstLine) {
            callback.error(firstLine);
            log.querySelector('.error').scrollIntoView();
        }
    }
};
