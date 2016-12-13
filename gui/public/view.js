import {PDFJS} from "pdfjs-dist/build/pdf.combined.js";
import {defineElement} from "./util";
import {nextPage, lastPage, scale, setPage} from "./actions";
import {compile} from "./template";
import store from "./store";
import watch from "redux-watch";

require('./view.scss');

class View extends HTMLElement {
    constructor() {
        super();
        compile(store, this, '<div id="view"><canvas id="pdf"></canvas></div>');
        this.view = this.querySelector('#view');
        this.canvas = this.querySelector('#pdf');
        window.onresize = this.renderPage;
        store.subscribe(watch(store.getState, 'pageNum')((value, old) => {
            this.renderPage();
        }));

        store.subscribe(watch(store.getState, 'scale')((value, old) => {
            this.renderPage();
        }));
    }

    mapStateToProps(state) {
        return {
            pageNum: state.pageNum,
            scale: state.scale,
            pdf: state.pdf
        };
    }

    mapDispatchToProps(dispatch) {
        return {
            loaded: (pdf) => {
                dispatch({type: 'pdf', pdf: pdf});
                if (this.props.pageNum > pdf.numPages) {
                    dispatch(setPage(pdf.numPages));
                }
            }
        };
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
        if (!this.page) {
            return 1;
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
        this.props.pdf.getPage(this.props.pageNum).then(p => {
            this.page = p;
            const factor = this.calcScale(this.props.scale);
            const viewport = this.page.getViewport(factor);
            this.canvas.width = viewport.width;
            this.canvas.height = viewport.height;
            this.canvas.style.left = Math.max(0, (this.viewWidth() - viewport.width) / 2) + 'px';
            this.canvas.style.top = Math.max(0, (this.viewHeight() - viewport.height) / 2) + 'px';
            this.page.render({canvasContext: this.canvas.getContext('2d'), viewport: viewport});
        });
    }

    load() {
        PDFJS.getDocument('/doc/main.pdf').then(pdf => {
            this.dispatch.loaded(pdf);
            this.renderPage();
        });
    }
}

class ViewControls extends HTMLElement {
    constructor() {
        super();
        compile(store, this, `
<div id="menu">
    <button (onclick)="this.lastPage()">Last</button>
    <button (onclick)="this.nextPage()">Next</button>
    <button (onclick)="this.scale('page')">Scale fit</button>
    <button (onclick)="this.scale('height')">Scale height</button>
    <button (onclick)="this.scale('width')">Scale width</button>
    <button (onclick)="this.zoomOut()">-</button>
    <span id="zoom" class="view">{Math.round(100*this.zoom)}%</span>
    <button (onclick)="this.zoomIn()">+</button>
    <a href="/doc/main.pdf?download">Download</a>
</div>
`);
        document.addEventListener('DOMContentLoaded', () => {
            this.view = module.exports.find()[0];
        });
    }

    mapStateToProps(state) {
        return {
            zoom: this.view.calcScale(state.scale),
            pageNum: state.pageNum
        };
    }

    mapDispatchToProps(dispatch) {
        return {
            nextPage: () => {
                if (this.props.pageNum < this.view.props.pdf.numPages) {
                    dispatch(nextPage());
                }
            },
            lastPage: () => {
                if (this.props.pageNum > 1) {
                    dispatch(lastPage());
                }
            },
            zoomIn: () => dispatch(scale(this.props.zoom * 1.2)),
            zoomOut: () => dispatch(scale(this.props.zoom / 1.2)),
            scale: (value) => dispatch(scale(value))
        };
    }
}

defineElement('latex-view-controls', ViewControls);

module.exports = defineElement('latex-view', View);



