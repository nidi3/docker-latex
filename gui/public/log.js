require('./log.scss');
import {nop, defineElement} from "./util";

class Log extends HTMLElement {

    constructor() {
        super();
        this.onError = nop;
        this.onErrorClick = nop;
        this.innerHTML = '<div id="container"><div id="log"></div></div>';
        this.log = this.querySelector('#log');
    }

    set(text) {
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
        this.log.innerHTML = text.replace(/\n/g, '<br>');
        this.log.querySelectorAll('.error').forEach(e => e.onclick = () => this.onErrorClick(e.getAttribute('data-line')));
        if (firstLine) {
            this.onError(firstLine);
            this.log.querySelector('.error').scrollIntoView();
        }
    }
}

module.exports = defineElement('latex-log', Log);
