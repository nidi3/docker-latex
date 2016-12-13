import {nop} from "./util";

export default function compile(store, target, html) {
    const texts = [];

    target.innerHTML = html;
    target.access = access;
    target.props = {};
    target.dispatch = (target.mapDispatchToProps || nop).bind(target)(store.dispatch);
    let walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while (node = walker.nextNode()) {
        parseTextNode(node, texts);
    }
    walker = document.createTreeWalker(target, NodeFilter.SHOW_ELEMENT, null, false);
    while (node = walker.nextNode()) {
        parseHandlers(node, target.dispatch);
    }

    update();
    let mapStateToProps = (target.mapStateToProps || nop).bind(target);
    store.subscribe(() => {
        target.props = mapStateToProps(store.getState());
        update();
    });

    function update() {
        texts.forEach(t => t.node.textContent = t.value(target));
    }
}

function parseTextNode(node, texts) {
    if (node.nodeValue.indexOf('{') >= 0) {
        texts.push({
            node: node,
            value: new Function('target', 'return "' + node.nodeValue.replace(/"/g, '\\"').replace(/\{(.*?)\}/g, '"+target.access(target.props,"$1")()+"') + '"')
        });
    }
}

function access(target, expr) {
    return new Function('try{var v=' + expr + '; return v==null?"":v;}catch(e){return"";}').bind(target);
}

function parseHandlers(node, bindings) {
    const attrs = node.attributes;
    for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i];
        const name = attr.name;
        if (name.substring(0, 1) === '(' && name.substring(name.length - 1) === ')') {
            node[name.substring(1, name.length - 1)] = new Function('e', attr.value).bind(bindings);
        }
    }
}
