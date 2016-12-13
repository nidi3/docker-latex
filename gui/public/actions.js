export function nextPage() {
    return {type: 'next.page'};
}

export function lastPage() {
    return {type: 'prev.page'};
}

export function scale(s) {
    return {type: 'set.scale', scale: s};
}

export function setPageNum(page) {
    return {type: 'set.pageNum', pageNum: page};
}

export function setPdf(pdf) {
    return {type: 'set.pdf', pdf: pdf};
}

export function setPage(page) {
    return {type: 'set.page', page: page};
}