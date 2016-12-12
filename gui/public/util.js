module.exports = {
    defineElement: function (name, clazz) {
        customElements.define(name, clazz);
        return {
            find: function () {
                return document.getElementsByTagName(name);
            }
        };
    },
    bindHandlers: function (elem) {
        elem.querySelectorAll('[onclick]').forEach(e => {
            e.onclick = e.onclick.bind(elem);
        });
    },
    nop: () => {
    }

};

