import {createStore} from "redux";

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
    case 'scale':
        return Object.assign({}, state, {scale: action.value});
    default:
        return state;
    }
});

module.exports = store;
