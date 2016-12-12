import {PDFJS} from "pdfjs-dist/build/pdf.combined.js";
import {defineElement, bindHandlers, nop} from "./util";
import store from "./store";
import watch from "redux-watch";

require('./view.scss');

class View extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = '<div id="view"><canvas id="pdf"></canvas></div>';
        this.view = this.querySelector('#view');
        this.canvas = this.querySelector('#pdf');
        window.onresize = this.renderPage;
        store.subscribe(watch(store.getState, 'pageNum')((value, old) => {
            this.renderPage();
        }));

        store.subscribe(watch(store.getState, 'scale')((value, old) => {
            this.renderPage();
        }));
        this.onScaleChange = nop;
    }

    viewWidth() {
        const style = window.getComputedStyle(this.view);
        return this.view.offsetWidth - parseInt(style.paddingLeft) - parseInt(style.paddingRight);
    }

    viewHeight() {
        const style = window.getComputedStyle(this.view);
        return this.view.offsetHeight - parseInt(style.paddingTop) - parseInt(style.paddingBottom);
    }

    calcScale(scale) {
        if (typeof scale === 'number') {
            return scale;
        }
        const view = this.page.view;
        switch (scale) {
        case 'page':
            return Math.min(this.viewWidth() / view[2], this.viewHeight() / view[3]);
        case 'width':
            return this.viewWidth() / view[2];
        case 'height':
            return this.viewHeight() / view[3];
        }
    }

    renderPage() {
        const state = store.getState();
        this.pdf.getPage(state.pageNum).then(p => {
            this.page = p;
            const factor = this.calcScale(state.scale);
            this.onScaleChange(factor);
            const viewport = this.page.getViewport(factor);
            this.canvas.width = viewport.width;
            this.canvas.height = viewport.height;
            this.canvas.style.left = Math.max(0, (this.viewWidth() - viewport.width) / 2) + 'px';
            this.canvas.style.top = Math.max(0, (this.viewHeight() - viewport.height) / 2) + 'px';
            this.page.render({canvasContext: this.canvas.getContext('2d'), viewport: viewport});
        });
    }

    load() {
        PDFJS.getDocument('/doc/main.pdf').then(p => {
            this.pdf = p;
            store.dispatch({type: 'set.page', page: Math.min(store.getState().pageNum, p.numPages)});
            this.renderPage();
        });
    }
}

class ViewControls extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
<div id="menu">
    <button onclick="this.lastPage()">Last</button>
    <button onclick="this.nextPage()">Next</button>
    <button onclick="this.scale('page')">Scale fit</button>
    <button onclick="this.scale('height')">Scale height</button>
    <button onclick="this.scale('width')">Scale width</button>
    <button onclick="this.zoomOut()">-</button>
    <span id="zoom" class="view">100%</span>
    <button onclick="this.zoomIn()">+</button>
    <a href="/doc/main.pdf?download">Download</a>
</div>
`;
        bindHandlers(this);

        var zoom = this.querySelector('#zoom');
        document.addEventListener('DOMContentLoaded', () => {
            this.view = module.exports.find()[0];
            this.view.onScaleChange = s => zoom.textContent = Math.round(s * 100) + "%";
        });
    }

    nextPage() {
        if (store.getState().pageNum < this.view.pdf.numPages) {
            store.dispatch({type: 'next.page'});
        }
    }

    lastPage() {
        if (store.getState().pageNum > 1) {
            store.dispatch({type: 'prev.page'});
        }
    }

    zoomIn() {
        store.dispatch({type: 'scale', value: this.view.calcScale(store.getState().scale) * 1.2});
    }

    zoomOut() {
        store.dispatch({type: 'scale', value: this.view.calcScale(store.getState().scale) / 1.2});
    }

    scale(value) {
        store.dispatch({type: 'scale', value: value});
    }
}


defineElement('latex-view-controls', ViewControls);

module.exports = defineElement('latex-view', View);



