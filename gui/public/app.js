import Editor from "./editor";
import view from "./view";
import Log from "./log";

require('./app.css');

const log = Log.find()[0];
const editor = Editor.find()[0];

log.onError = editor.gotoLine.bind(editor);
log.onErrorClick = editor.gotoLine.bind(editor);

editor.onBeforeSave = () => log.set('');
editor.onAfterSave = text => {
    log.set(text);
    view.load();
};

fetch(new Request('/doc/main.tex'))
    .then(res => res.text())
    .then(text => {
        editor.set(text);
        editor.save();
    });

module.exports = {
    view: view
};
