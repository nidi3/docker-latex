import {createStore} from 'redux';

let initState = {
    pageNum: 1,
    scale: 'page'
};

export default createStore(function (state = initState, action) {
    switch (action.type) {
    case 'prev.page':
        return Object.assign({}, state, {pageNum: state.pageNum - 1});
    case 'next.page':
        return Object.assign({}, state, {pageNum: state.pageNum + 1});
    case 'set.pageNum':
        return Object.assign({}, state, {pageNum: action.pageNum});
    case 'set.scale':
        return Object.assign({}, state, {scale: action.scale});
    case 'set.pdf':
        return Object.assign({}, state, {pdf: action.pdf});
    case 'set.page':
        return Object.assign({}, state, {page: action.page});
    default:
        return state;
    }
});
