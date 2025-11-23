/**
 * A DOM Node or a string that will become a text node. A lot of DOM API methods naturally take this type.
 */
export type Dom = Node | string

/**
 * The set of all tag names
 */
export type Tag = keyof HTMLElementTagNameMap | keyof HTMLElementDeprecatedTagNameMap

/**
 * The type of the element with the given tag name
 */
export type Elem<T extends Tag> = (HTMLElementTagNameMap & HTMLElementDeprecatedTagNameMap)[T]
/**
 * An object that can contain any of the possible attributes of an element with the given tag.
 */
export type Attrs<T extends Tag> = Partial<Elem<T> & object>

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
