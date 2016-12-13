import {PDFJS} from "pdfjs-dist/build/pdf.combined.js";
import {defineElement, observeStore} from "./util";
import {nextPage, lastPage, scale, setPageNum, setPdf, setPage} from "./actions";
import compile from "./template";
import store from "./store";

require('./view.scss');

class View extends HTMLElement {
    constructor() {
        super();
        compile(store, this, '<div id="view"><canvas id="pdf"></canvas></div>');
        this.view = this.querySelector('#view');
        this.canvas = this.querySelector('#pdf');
        window.onresize = () => this.renderPage(this.props.page, this.props.scale);
        observeStore(store, state => [state.pdf, state.pageNum], (pdfAndPageNum) => this.getPage(...pdfAndPageNum));
        observeStore(store, state => [state.page, state.scale], (pageAndScale) => this.renderPage(...pageAndScale));
    }

    mapStateToProps(state) {
        return {
            pageNum: state.pageNum,
            scale: state.scale,
            pdf: state.pdf,
            page: state.page,
        };
    }

    mapDispatchToProps(dispatch) {
        return {
            gotPdf: (pdf) => {
                dispatch(setPdf(pdf));
                if (this.props.pageNum > pdf.numPages) {
                    dispatch(setPageNum(pdf.numPages));
                }
            },
            gotPage: (page) => {
                dispatch(setPage(page));
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
        if (!this.props.page) {
            return 1;
        }
        const view = this.props.page.view;
        switch (scale) {
        case 'page':
            return Math.min(this.viewWidth() / view[2], this.viewHeight() / view[3]);
        case 'width':
            return this.viewWidth() / view[2];
        case 'height':
            return this.viewHeight() / view[3];
        }
    }

    getPage(pdf, pageNum) {
        if (pdf) {
            pdf.getPage(pageNum).then(this.dispatch.gotPage);
        }
    }

    renderPage(page, scale) {
        if (page) {
            const factor = this.calcScale(scale);
            const viewport = page.getViewport(factor);
            this.canvas.width = viewport.width;
            this.canvas.height = viewport.height;
            this.canvas.style.left = Math.max(0, (this.viewWidth() - viewport.width) / 2) + 'px';
            this.canvas.style.top = Math.max(0, (this.viewHeight() - viewport.height) / 2) + 'px';
            page.render({canvasContext: this.canvas.getContext('2d'), viewport: viewport});
        }
    }

    load() {
        PDFJS.getDocument('/doc/main.pdf').then(this.dispatch.gotPdf);
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
            this.view = view.find()[0];
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
const view = defineElement('latex-view', View);
export default view;



