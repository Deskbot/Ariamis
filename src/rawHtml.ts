/**
 * Creates a document fragment containing the given HTML converted into DOM.
 */
export function rawHtml(html: string) {
    const elem = document.createElement("div")
    elem.innerHTML = html

    const frag = document.createDocumentFragment()

    for (let i = 0; i < elem.childNodes.length; i++) {
        frag.append(elem.childNodes[i])
    }

    return frag
}
