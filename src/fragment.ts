import { Dom } from "./dom"

/**
 * Creates a {@link DocumentFragment} with the given children
 */
export function fragment(children: Dom[]) {
    const f = document.createDocumentFragment()
    f.append(...children)
    return f
}
