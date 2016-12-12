import {PDFJS} from "pdfjs-dist/build/pdf.combined.js";
import store from './store';
import watch from "redux-watch";

require('./view.css');

let pdf, page;
const dom = {
    zoom: document.getElementById('zoom'),
    view: document.getElementById('view'),
    canvas: document.getElementById('pdf'),
    viewWidth: function () {
        const style = window.getComputedStyle(dom.view);
        return dom.view.offsetWidth - parseInt(style.paddingLeft) - parseInt(style.paddingRight);
    },
    viewHeight: function () {
        const style = window.getComputedStyle(dom.view);
        return dom.view.offsetHeight - parseInt(style.paddingTop) - parseInt(style.paddingBottom);
    }
};

window.onresize = renderPage;
store.subscribe(watch(store.getState, 'pageNum')((value, old) => {
    renderPage();
}));

store.subscribe(watch(store.getState, 'scale')((value, old) => {
    renderPage();
}));

function calcScale(scale) {
    if (typeof scale === 'number') {
        return scale;
    }
    switch (scale) {
    case 'page':
        const view = page.view;
        return Math.min(dom.viewWidth() / view[2], dom.viewHeight() / view[3]);
    case 'width':
        return dom.viewWidth() / page.view[2];
    case 'height':
        return dom.viewHeight() / page.view[3];
    }
}

function renderPage() {
    const state = store.getState();
    pdf.getPage(state.pageNum).then(p => {
        page = p;
        var factor = calcScale(state.scale);
        dom.zoom.textContent = Math.round(factor * 100) + "%";
        const viewport = page.getViewport(factor);
        dom.canvas.width = viewport.width;
        dom.canvas.height = viewport.height;
        dom.canvas.style.left = Math.max(0, (dom.viewWidth() - viewport.width) / 2) + 'px';
        dom.canvas.style.top = Math.max(0, (dom.viewHeight() - viewport.height) / 2) + 'px';
        page.render({canvasContext: dom.canvas.getContext('2d'), viewport: viewport});
    });
}

module.exports = {
    load: function () {
        PDFJS.getDocument('/doc/main.pdf')
            .then(p => {
                pdf = p;
                store.dispatch({type: 'set.page', page: Math.min(store.getState().pageNum, pdf.numPages)});
                renderPage();
            })
    },
    nextPage: function () {
        if (store.getState().pageNum < pdf.numPages) {
            store.dispatch({type: 'next.page'});
        }
    },
    lastPage: function () {
        if (store.getState().pageNum > 1) {
            store.dispatch({type: 'prev.page'});
        }
    },
    zoomIn: function () {
        store.dispatch({type: 'scale', value: calcScale(store.getState().scale) * 1.2});
    },
    zoomOut: function () {
        store.dispatch({type: 'scale', value: calcScale(store.getState().scale) / 1.2});
    },
    scale: function (value) {
        store.dispatch({type: 'scale', value: value});
    }
};
