import editor from "./editor";
import log from "./log";
import view from "./view";

require('./app.css');

log.onError(editor.gotoLine);
log.onErrorClick(editor.gotoLine);

editor.beforeSave(() => log.set(''));
editor.afterSave(text => {
    log.set(text);
    view.load();
});

fetch(new Request('/doc/main.tex'))
    .then(res => res.text())
    .then(text => {
        editor.set(text);
        view.load();
    });


module.exports = {
    view: view
};
