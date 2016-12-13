export function defineElement(name, clazz) {
    customElements.define(name, clazz);
    return {
        find: function () {
            return document.getElementsByTagName(name);
        }
    };
}

export function nop() {
}

export function observeStore(store, select, onChange) {
    let currentState;
    let unsubscribe = store.subscribe(handleChange);
    handleChange();
    return unsubscribe;

    function handleChange() {
        let nextState = select(store.getState());
        if (!equals(nextState, currentState)) {
            currentState = nextState;
            onChange(currentState);
        }
    }

    function equals(a, b) {
        if (Array.isArray(a) && Array.isArray(b)) {
            if (a.length !== b.length) {
                return false;
            }
            for (let i = 0; i < a.length; i++) {
                if (a[i] !== b[i]) {
                    return false;
                }
            }
            return true;
        }
        return a === b;
    }
}

