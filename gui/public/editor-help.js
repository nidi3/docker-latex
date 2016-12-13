const TokenIterator = ace.require("ace/token_iterator").TokenIterator;

const texinfo = 'http://mirror.switch.ch/ftp/mirror/tex/info/latex2e-help-texinfo/latex2e.html';
const help = {
    '\\documentclass': {help: texinfo + '#Document-classes', type: 'command'},
    '\\usepackage': {help: null, type: 'command'},
    '\\maketitle': {help: texinfo + '#g_t_005cmaketitle-1', type: 'command'},
    '\\author': {help: texinfo + '#g_t_005cmaketitle-1', type: 'command'},
    '\\date': {help: texinfo + '#g_t_005cmaketitle-1', type: 'command'},
    '\\thanks': {help: texinfo + '#g_t_005cmaketitle-1', type: 'command'},
    '\\title': {help: texinfo + '#g_t_005cmaketitle-1', type: 'command'},
    '\\begin': {help: texinfo + '#Environments', type: 'command'},
    '\\end': {
        help: texinfo + '#Environments', type: 'command', completer: (editor, session, pos, prefix, res, inEnv) => {
            if (inEnv) {
                let env = findEnvToEnd(pos.row, pos.column - prefix.length - 1);
                if (env) {
                    res.push({caption: env, value: env, meta: 'env', score: 16000});
                }
            } else {
                res.push({caption: '\\end', snippet: 'end{$0}', meta: 'command', score: 15000});
                let env = findEnvToEnd(pos.row, pos.column);
                if (env) {
                    let val = '\\end{' + env + '}';
                    res.push({caption: val, value: val, meta: 'command', score: 16000});
                }
            }

            //TODO support nested begin/end
            function findEnvToEnd(row, column) {
                let iter = new TokenIterator(session, row, column);
                let token;
                do {
                    token = iter.stepBackward();
                } while (token && token.value !== '\\end' && token.value !== '\\begin');
                if (token.value === '\\begin') {
                    iter.stepForward();
                    return iter.stepForward().value;
                }
            }
        }
    },
    'abstract': {help: texinfo + '#abstract', type: 'env'},
    'array': {help: texinfo + '#array', type: 'env'},
    'center': {help: texinfo + '#center', type: 'env'},
    'description': {help: texinfo + '#description', type: 'env'},
    'displaymath': {help: texinfo + '#displaymath', type: 'env'},
    'document': {help: texinfo + '#document', type: 'env'},
    'enumerate': {help: texinfo + '#enumerate', type: 'env'},
    'eqnarray': {help: texinfo + '#eqnarray', type: 'env'},
    'equation': {help: texinfo + '#equation', type: 'env'},
    'figure': {help: texinfo + '#figure', type: 'env'},
    'filecontents': {help: texinfo + '#filecontents', type: 'env'},
    'flushleft': {help: texinfo + '#flushleft', type: 'env'},
    '\\raggedright': {help: texinfo + '#raggedright', type: 'env'},
    'flushright': {help: texinfo + '#flushright', type: 'env'},
    '\\raggedleft': {help: texinfo + '#raggedleft', type: 'env'},
    'itemize': {help: texinfo + '#itemize', type: 'env'},
    '\\item': {help: texinfo + '#itemize', type: 'command'},
    'letter': {help: texinfo + '#letter', type: 'env'},
    'list': {help: texinfo + '#list', type: 'env'},
    'math': {help: texinfo + '#math', type: 'env'},
    'minipage': {help: texinfo + '#minipage', type: 'env'},
    'picture': {help: texinfo + '#picture', type: 'env'},
    'quotation': {help: texinfo + '#quotation-and-quote', type: 'env'},
    'quote': {help: texinfo + '#quotation-and-quote', type: 'env'},
    'tabbing': {help: texinfo + '#tabbing', type: 'env'},
    'table': {help: texinfo + '#table', type: 'env'},
    'tabular': {help: texinfo + '#tabular', type: 'env'},
    'thebibliography': {help: texinfo + '#thebibliography', type: 'env'},
    'theorem': {help: texinfo + '#theorem', type: 'env'},
    'titlepage': {help: texinfo + '#titlepage', type: 'env'},
    'verbatim': {help: texinfo + '#verbatim', type: 'env'},
    'verse': {help: texinfo + '#verse', type: 'env'},
    '\\part': {help: texinfo + '#Sectioning', type: 'command'},
    '\\chapter': {help: texinfo + '#Sectioning', type: 'command'},
    '\\section': {help: texinfo + '#Sectioning', type: 'command'},
    '\\subsection': {help: texinfo + '#Sectioning', type: 'command'},
    '\\subsubsection': {help: texinfo + '#Sectioning', type: 'command'},
    '\\paragraph': {help: texinfo + '#Sectioning', type: 'command'},
    '\\subparagraph': {help: texinfo + '#Sectioning', type: 'command'},
    '\\textrm': {help: texinfo + '#Fonts', type: 'command'},
    '\\rmfamily': {help: texinfo + '#Fonts', type: 'command'},
    '\\textit': {help: texinfo + '#Fonts', type: 'command'},
    '\\itshape': {help: texinfo + '#Fonts', type: 'command'},
    '\\textmd': {help: texinfo + '#Fonts', type: 'command'},
    '\\mdseries': {help: texinfo + '#Fonts', type: 'command'},
    '\\textbf': {help: texinfo + '#Fonts', type: 'command'},
    '\\bfseries': {help: texinfo + '#Fonts', type: 'command'},
    '\\textup': {help: texinfo + '#Fonts', type: 'command'},
    '\\upshape': {help: texinfo + '#Fonts', type: 'command'},
    '\\textsl': {help: texinfo + '#Fonts', type: 'command'},
    '\\slshape': {help: texinfo + '#Fonts', type: 'command'},
    '\\textsf': {help: texinfo + '#Fonts', type: 'command'},
    '\\sffamily': {help: texinfo + '#Fonts', type: 'command'},
    '\\textsc': {help: texinfo + '#Fonts', type: 'command'},
    '\\scshape': {help: texinfo + '#Fonts', type: 'command'},
    '\\texttt': {help: texinfo + '#Fonts', type: 'command'},
    '\\ttfamily': {help: texinfo + '#Fonts', type: 'command'},
    '\\textnormal': {help: texinfo + '#Fonts', type: 'command'},
    '\\normalfont': {help: texinfo + '#Fonts', type: 'command'},
    '\\bf': {help: texinfo + '#Fonts', type: 'command'},
    '\\cal': {help: texinfo + '#Fonts', type: 'command'},
    '\\it': {help: texinfo + '#Fonts', type: 'command'},
    '\\rm': {help: texinfo + '#Fonts', type: 'command'},
    '\\sc': {help: texinfo + '#Fonts', type: 'command'},
    '\\sf': {help: texinfo + '#Fonts', type: 'command'},
    '\\sl': {help: texinfo + '#Fonts', type: 'command'},
    '\\tt': {help: texinfo + '#Fonts', type: 'command'},
    '\\mathrm': {help: texinfo + '#Fonts', type: 'command'},
    '\\mathbf': {help: texinfo + '#Fonts', type: 'command'},
    '\\mathsf': {help: texinfo + '#Fonts', type: 'command'},
    '\\mathtt': {help: texinfo + '#Fonts', type: 'command'},
    '\\mathit': {help: texinfo + '#Fonts', type: 'command'},
    '\\mit': {help: texinfo + '#Fonts', type: 'command'},
    '\\mathnormal': {help: texinfo + '#Fonts', type: 'command'},
    '\\mathcal': {help: texinfo + '#Fonts', type: 'command'},
    '\\tiny': {help: texinfo + '#Font-sizes', type: 'command'},
    '\\scriptsize': {help: texinfo + '#Font-sizes', type: 'command'},
    '\\footnotesize': {help: texinfo + '#Font-sizes', type: 'command'},
    '\\small': {help: texinfo + '#Font-sizes', type: 'command'},
    '\\normalsize': {help: texinfo + '#Font-sizes', type: 'command'},
    '\\large': {help: texinfo + '#Font-sizes', type: 'command'},
    '\\Large': {help: texinfo + '#Font-sizes', type: 'command'},
    '\\LARGE': {help: texinfo + '#Font-sizes', type: 'command'},
    '\\huge': {help: texinfo + '#Font-sizes', type: 'command'},
    '\\Huge': {help: texinfo + '#Font-sizes', type: 'command'},
    '\\label': {help: texinfo + '#g_t_005clabel', type: 'command'},
    '\\pageref': {help: texinfo + '#g_t_005cpageref', type: 'command'},
    '\\ref': {help: texinfo + '#g_t_005cref', type: 'command'},
    '\\include': {help: texinfo + '#g_t_005cinclude', type: 'command'},
    '\\includeonly': {help: texinfo + '#g_t_005cincludeonly', type: 'command'},
    '\\input': {help: texinfo + '#g_t_005cinput', type: 'command'},
    '\\cleardoublepage': {help: texinfo + '#g_t_005ccleardoublepage', type: 'command'},
    '\\clearpage': {help: texinfo + '#g_t_005cclearpage', type: 'command'},
    '\\newpage': {help: texinfo + '#g_t_005cnewpage', type: 'command'},
    '\\enlargethispage': {help: texinfo + '#g_t_005cenlargethispage', type: 'command'},
    '\\pagebreak': {help: texinfo + '#g_t_005cpagebreak-_0026-_005cnopagebreak', type: 'command'},
    '\\nopagebreak': {help: texinfo + '#g_t_005cpagebreak-_0026-_005cnopagebreak', type: 'command'},
    '\\hspace': {help: texinfo + '#g_t_005chspace', type: 'command'},
    '\\hfill': {help: texinfo + '#g_t_005chfill', type: 'command'},
    '\\thinspace': {help: texinfo + '#g_t_005cthinspace', type: 'command'},
    '\\hrulefill': {help: texinfo + '#g_t_005chrulefill-_005cdotfill', type: 'command'},
    '\\dotfill': {help: texinfo + '#g_t_005chrulefill-_005cdotfill', type: 'command'},
    '\\addvspace': {help: texinfo + '#g_t_005caddvspace', type: 'command'},
    '\\bigskip': {help: texinfo + '#g_t_005cbigskip-_005cmedskip-_005csmallskip', type: 'command'},
    '\\medskip': {help: texinfo + '#g_t_005cbigskip-_005cmedskip-_005csmallskip', type: 'command'},
    '\\smallskip': {help: texinfo + '#g_t_005cbigskip-_005cmedskip-_005csmallskip', type: 'command'},
    '\\vfill': {help: texinfo + '#g_t_005cvfill', type: 'command'},
    '\\vspace': {help: texinfo + '#g_t_005cvspace', type: 'command'},
};

const completer = {
    getCompletions: (editor, session, pos, prefix, callback) => {
        const token = editor.session.getTokenAt(pos.row, pos.column);
        const lastToken = editor.session.getTokenAt(pos.row, pos.column - prefix.length - 1);
        const isEnv = lastToken && (lastToken.value === '\\begin' || lastToken.value === '\\end');
        const isCommand = token && token.value && token.value.charAt(0) === '\\';
        const res = [];
        if (isEnv) {
            let h = help[lastToken.value];
            if (h.completer) {
                h.completer(editor, session, pos, prefix, res, true);
            }
        }
        for (let h in help) {
            const he = help[h];
            if (isCommand && he.type === 'command' && h.substring(1, prefix.length + 1) === prefix) {
                if (he.completer) {
                    he.completer(editor, session, pos, prefix, res, false);
                } else {
                    res.push({caption: h, snippet: h.substring(1) + '{$0}', meta: he.type, score: 15000});
                }
            }
            if (isEnv && he.type === 'env' && h.substring(0, prefix.length) === prefix) {
                res.push({caption: h, value: h, meta: he.type, score: 15000});
            }
        }
        callback(null, res);
    }
};

function tokenLink(token) {
    if (token && (token.type === 'keyword' || token.type === 'storage.type' || token.type === 'variable.parameter')) {
        const h = help[token.value];
        return h && h.help;
    }
    return false;
}

module.exports = {
    completer: completer,
    tokenLink: tokenLink
};