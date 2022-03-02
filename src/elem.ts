import { Tag, Elem, Children, Attrs, EventName, Listeners } from "./dom"

/**
 * A function that creates an element with the given tag name.
 * The function has many valid call signatures for the sake of convenience and conciseness.
 */
export type ElemCreator<T extends Tag> = {
    /**
     * @param tag The tag name of the element
     */
    (tag: T): Elem<T>

    /**
     * @param tag The tag name of the element
     * @param children The child nodes of the element
     */
    (tag: T, children: Children): Elem<T>

    /**
     * @param tag The tag name of the element
     * @param attrs Element attributes as an object of attribute names to values
     */
    (tag: T, attrs: Attrs<T>): Elem<T>

    /**
     * @param tag The tag name of the element
     * @param attrs Element attributes as an object of attribute names to values
     * @param children The child nodes of the element
     */
    (tag: T, attrs: Attrs<T>, children: Children): Elem<T>

    /**
     * @param tag The tag name of the element
     * @param attrs Element attributes as an object of attribute names to values
     * @param listeners Event listeners attached to the element as an object of event names to handlers
     */
    <E extends EventName>(tag: T, attrs: Attrs<T>, listeners: Listeners<T, E>): Elem<T>

    /**
     * @param tag The tag name of the element
     * @param attrs Element attributes as an object of attribute names to values
     * @param listeners Event listeners attached to the element as an object of event names to handlers
     * @param children The child nodes of the element
     */
    <E extends EventName>(tag: T, attrs: Attrs<T>, listeners: Listeners<T, E>, children: Children): Elem<T>
}

export type ElemArgs<T extends Tag, E extends EventName = EventName> = [
    arg1?: Children | Attrs<T>,
    arg2?: Children | Listeners<T, E>,
    arg3?: Children,
]

export type ElemArgsAll<T extends Tag, E extends EventName = EventName> = [
    attrs: Attrs<T>,
    listeners: Listeners<T, E>,
    children: Children,
]

export function distinguishElemArgs
    <T extends Tag, E extends EventName>
    ([arg1, arg2, arg3]: ElemArgs<T, E>): ElemArgsAll<T, E>
{
    return distinguishAriamisArgs<
        Attrs<T>,
        Listeners<T,E>,
        Children,
        Children | Attrs <T>,
        Children | Listeners<T, E>,
        Children
    >([arg1, arg2, arg3])
}

export function distinguishAriamisArgs
    <
        A extends object,
        L extends object,
        C extends unknown[],
        Arg1 extends C | A,
        Arg2 extends C | L,
        Arg3 extends C,
    >
    ([arg1, arg2, arg3]: [Arg1 | undefined, Arg2 | undefined, Arg3 | undefined]): [A, L, C]
{
    let attr = {}
    let listeners = {}
    let children = [] as unknown[]

    if (Array.isArray(arg1)) {
        children = arg1
    } else if (arg1 !== undefined) {
        attr = arg1
    }

    if (Array.isArray(arg2)) {
        children = arg2
    } else if (arg2 !== undefined) {
        listeners = arg2
    }

    if (arg3 !== undefined) {
        children = arg3
    }

    return [attr as A, listeners as L, children as C]
}

export function createElement<T extends Tag, E extends EventName>(
    tag: T,
    attrs: Attrs<T>,
    listeners: Listeners<T, E>,
    children: Children,
): Elem<T> {
    const elem = document.createElement(tag)

    for (const key in attrs) {
        // TypeScript complains without this cast. I think this situation is just too complicated for it.
        elem[key] = attrs[key] as Elem<T>[Extract<keyof Elem<T>, string>]
    }

    for (const k in listeners) {
        const listener = listeners[k] as any

        if (typeof listener === "function") {
            elem.addEventListener(k, listener)
        } else {
            elem.addEventListener(k, listener.handler, listener.options)
        }
    }

    elem.append(...children)

    return elem
}

/**
 * Creates an element.
 * Takes a tag name, optionally followed by any of the following sequences:
 * * children
 * * attributes
 * * attributes, children
 * * attributes, listeners
 * * attributes, listeners, children
 */
export function elem<T extends Tag, E extends EventName>(tag: T, ...elemArgs: ElemArgs<T,E>): Elem<T> {
    return createElement(tag, ...distinguishElemArgs(elemArgs))
}

/**
 * A function that creates an element of the given tag type.
 * This tag type is baked into the function and isn't chosen by an argument.
 */
export type TagFunc<T extends Tag> = {
    /**
     * Creates an element
     */
    (): Elem<T>

    /**
     * Creates an element
     * @param children The child nodes of the element
     */
    (children: Children): Elem<T>

    /**
     * Creates an element
     * @param attrs Element attributes as an object of attribute names to values
     */
    (attrs: Attrs<T>): Elem<T>

    /**
     * Creates an element
     * @param attrs Element attributes as an object of attribute names to values
     * @param children The child nodes of the element
     */
    (attrs: Attrs<T>, children: Children): Elem<T>

    /**
     * Creates an element
     * @param attrs Element attributes as an object of attribute names to values
     * @param listeners Event listeners attached to the element as an object of event names to handlers
     */
    <E extends EventName>(attrs: Attrs<T>, listeners: Listeners<T, E>): Elem<T>

    /**
     * Creates an element
     * @param attrs Element attributes as an object of attribute names to values
     * @param listeners Event listeners attached to the element as an object of event names to handlers
     * @param children The child nodes of the element
     */
    <E extends EventName>(attrs: Attrs<T>, listeners: Listeners<T, E>, children: Children): Elem<T>
}

/**
 * Creates a {@link TagFunc}.
 * i.e. it creates an element creating function with the given tag name baked in.
 */
export function tag<T extends Tag>(tag: T): TagFunc<T> {
    return ((...args: any) => elem(tag, ...args))
}
