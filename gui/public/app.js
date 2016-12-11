import {PDFJS} from "pdfjs-dist/build/pdf.combined.js";
import {createStore} from "redux";
import watch from "redux-watch";
import editor from './editor';

require('./app.css');

let initState = {
    pageNum: 1,
    scale: 'page'
};

let store = createStore(function (state = initState, action) {
    switch (action.type) {
    case 'prev.page':
        return Object.assign({}, state, {pageNum: state.pageNum - 1});
    case 'next.page':
        return Object.assign({}, state, {pageNum: state.pageNum + 1});
    case 'set.page':
        return Object.assign({}, state, {pageNum: action.page});
    case 'zoom.in':
        return Object.assign({}, state, {scale: calcScale(state.scale) * 1.2});
    case 'zoom.out':
        return Object.assign({}, state, {scale: calcScale(state.scale) / 1.2});
    case 'scale':
        return Object.assign({}, state, {scale: action.value});
    default:
        return state;
    }
});

let pdf, page;
const dom = {
    zoom: document.getElementById('zoom'),
    log: document.getElementById('log'),
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

editor.beforeSave(() => dom.log.innerHTML = '');
editor.afterSave(text => {
    let errorPos = text.indexOf('\n./main.tex:');
    let firstLine;
    while (errorPos >= 0) {
        const line = parseInt(text.substring(errorPos + 12, text.indexOf(':', errorPos + 12)));
        const errorEnd = text.indexOf('\n', errorPos + 1);
        text = text.substring(0, errorPos + 1) +
            '<span class="error" onclick="app.gotoLine(' + line + ');">' + text.substring(errorPos + 1, errorEnd) + '</span>' +
            text.substring(errorEnd);
        firstLine = firstLine || line;
        errorPos = text.indexOf('\n./main.tex:', errorEnd);
    }
    dom.log.innerHTML = text.replace(/\n/g, '<br>');
    if (firstLine) {
        editor.gotoLine(firstLine);
        dom.log.querySelector('.error').scrollIntoView();
    }

    return PDFJS.getDocument('/doc/main.pdf')
        .then(p => {
            pdf = p;
            store.dispatch({type: 'set.page', page: Math.min(store.getState().pageNum, pdf.numPages)});
            renderPage();
        })
});

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
    next: function () {
        if (store.getState().pageNum < pdf.numPages) {
            store.dispatch({type: 'next.page'});
        }
    },
    last: function () {
        if (store.getState().pageNum > 1) {
            store.dispatch({type: 'prev.page'});
        }
    },
    zoomIn: function () {
        store.dispatch({type: 'zoom.in'});
    },
    zoomOut: function () {
        store.dispatch({type: 'zoom.out'});
    },
    scale: function (value) {
        store.dispatch({type: 'scale', value: value});
    },
    gotoLine:function(line){
        editor.gotoLine(line);
    }
};
