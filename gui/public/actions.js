export function nextPage() {
    return {type: 'next.page'};
}

export function lastPage() {
    return {type: 'prev.page'};
}

export function scale(s) {
    return {type: 'scale', value: s};
}

export function setPage(page) {
    return {type: 'set.page', page: page};
}