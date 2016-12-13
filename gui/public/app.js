import editors from "./editor";
import views from "./view";
import logs from "./log";

require('./app.css');

const log = logs.find()[0];
const editor = editors.find()[0];
const view = views.find()[0];

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
