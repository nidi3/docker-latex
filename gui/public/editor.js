import editorHelp from "./editor-help";
import {nop, defineElement} from "./util";
const Range = ace.require('ace/range').Range;
require('./editor.scss');

class Editor extends HTMLElement {
    constructor() {
        super();
        this.onBeforeSave = nop;
        this.onAfterSave = nop;
        this.innerHTML = '<div id="container"><div id="editor"></div></div>';
        this.editor = ace.edit("editor");
        this.init(this.editor);
    }

    set(text) {
        this.editor.setValue(text);
        this.editor.clearSelection();
    }

    save() {
        this.onBeforeSave();
        fetch(new Request('/action/save', {method: 'POST', body: this.editor.getValue()}))
            .then(res => res.text().then(this.onAfterSave))
    }

    gotoLine(line) {
        this.editor.gotoLine(line);
        this.editor.focus();
    }

    init(editor) {
        editor.setTheme("ace/theme/clouds");
        editor.getSession().setMode("ace/mode/latex");
        editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: false
        });

        const langTools = ace.require("ace/ext/language_tools");
        langTools.addCompleter(editorHelp.completer);

        const Range = ace.require("ace/range").Range;
        editor.on('click', e => {
            if (e.domEvent.metaKey) {
                const pos = editor.getCursorPosition();
                const token = editor.session.getTokenAt(pos.row, pos.column);
                const link = editorHelp.tokenLink(token);
                if (link) {
                    window.open(link, 'latex-help');
                }
            }
        });
        editor.on('mousemove', e => {
            if (!this.markLinkable(e)) {
                editor.session.removeMarker(this.markerId);
                editor.renderer.setCursorStyle("");
            }
        });

        editor.commands.addCommand({
            name: 'save',
            bindKey: {win: 'Ctrl-S', mac: 'Command-S'},
            exec: this.save.bind(this)
        });
    }

    markLinkable(e) {
        if (e.domEvent.metaKey) {
            const pos = this.mousePos(e);
            const session = this.editor.session;
            const token = session.getTokenAt(pos.row, pos.column);
            if (editorHelp.tokenLink(token)) {
                session.removeMarker(this.markerId);
                this.editor.renderer.setCursorStyle("pointer");
                const range = new Range(pos.row, token.start, pos.row, token.start + token.value.length);
                this.markerId = session.addMarker(range, 'ace_linkable', 'text', true);
                return true;
            }
        }
        return false;
    }

    mousePos(e) {
        const renderer = this.editor.renderer;
        const canvasPos = renderer.scroller.getBoundingClientRect();
        const offset = (e.x + renderer.scrollLeft - canvasPos.left - renderer.$padding) / renderer.characterWidth;
        const row = Math.floor((e.y + renderer.scrollTop - canvasPos.top) / renderer.lineHeight);
        const col = Math.round(offset);
        const screenPos = {row: row, column: col, side: offset - col > 0 ? 1 : -1};
        return this.editor.session.screenToDocumentPosition(screenPos.row, screenPos.column);
    }

}

module.exports = defineElement('latex-editor', Editor);

