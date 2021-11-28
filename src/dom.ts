/**
 * A DOM Node or a string that will become a text node. A lot of DOM API methods naturally take this type.
 */
export type Dom = Node | string

/**
 * The set of all tag names
 */
export type Tag = keyof HTMLElementTagNameMap

/**
 * The type of the element with the given tag name
 */
export type Elem<T extends Tag> = HTMLElementTagNameMap[T]

/**
 * An object that can contain any of the possible attributes of an element with the given tag.
 */
export type Attrs<T extends Tag> = Partial<Elem<T>> & object

/**
 * A list of children can be represented as a list of nodes or HTML strings.
 */
export type Children = Dom[]

/**
 * The set of all event names
 */
export type EventName = keyof HTMLElementEventMap

/**
 * A function that handles the given event emitted by an element with the given tag name
 */
export type Handler<T extends Tag, E extends EventName> = (this: Elem<T>, ev: HTMLElementEventMap[E]) => any

/**
 * A handler and options for the behaviour of the listener it is given to.
 * @see {@link HTMLObjectElement["addEventListener"]}
 */
export type HandlerWithOptions<T extends Tag, E extends EventName> = {
    handler: Handler<T,E>,
    options?: AddEventListenerOptions,
};

/**
 * A collection of listeners for the given events coming from an element with the given tag.
 */
export type Listeners<T extends Tag, Es extends EventName> = {
    [E in Es]?: Handler<T, E> | HandlerWithOptions<T, E>
}

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

/**
 * Creates an element.
 * Takes a tag name, optionally followed by any of:
 * * children
 * * attributes
 * * attributes, children
 * * attributes, listeners
 * * attributes, listeners, children
 */
export const elem = createElem as ElemCreator<Tag>

function createElem<T extends Tag, E extends EventName>(
    tag: T,
    arg1?: Children | Attrs<T>,
    arg2?: Children | Listeners<T, E>,
    arg3?: Children,
): Elem<T> {
    // disambiguate arguments

    let attr: Attrs<T> = {}
    let listeners: Listeners<T,E> = {}
    let children: Children = []

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

    // build the element

    const elem = document.createElement(tag)

    for (const key in attr) {
        // TypeScript complains without this cast. I think this situation is just too complicated for it.
        elem[key] = attr[key] as Elem<T>[Extract<keyof Elem<T>, string>]
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
    return ((...args: any) => (elem as any)(tag, ...args))
}
