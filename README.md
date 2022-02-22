# Ariamis

Ariamis is a small and beautiful DOM creation library.

Ariamis is a thin abstraction over native browser APIs for constructing elements. It wraps up what would be multiple lines of browser API calls into a single function. With Ariamis, DOM can be defined declaratively; you can construct a DOM tree and give each element specific attributes and event listeners all in a single expression.

Ariamis leverages TypeScript to check that your DOM creation is valid and give hints to your IDE.

## Installation

```sh
npm install ariamis
```

<!--After the Linus Tech Tips 'Linux Challenge', I feel the need to include this.-->
Ariamis is an [NPM](https://www.npmjs.com) package.

NPM packages can be imported into the browser. However, please note:

* NodeJS-style bare imports aren't supported by browsers. (i.e. `import * as ariamis from "ariamis"`) (a bare import is one that doesn't start with "./" or "/")
* Generally a transpiler like Babel is used in combination with build tools like Webpack or Rollup to replace bare imports with real paths (and do other useful things).
* Ariamis, installed through NPM, can be imported in the browser by using a relative/absolute path to your `node_modules/ariamis/dist/index`. Ariamis itself doesn't contain bare imports.
* Browsers may eventually get a feature called ['import maps'](https://github.com/WICG/import-maps) that tells the browser what path to use when it encounters a bare import.

## Examples

### Elements

The following creates a button with:

* attribute `type="button"`,
* an event handler listening for the `click` event,
* and a child text node that says `"Click Me"`.

```ts
import { button } from "ariamis"

const myButton = button(
    { type: "button" },
    { click: () => alert("clicked") },
    ["Click Me"],
)

document.body.append(myButton)
```

Arguments can be omitted in various ways for conciseness.

```ts
import { br, button, input, main, li, textarea, ul } from "ariamis"

// no arguments
br()

// only attributes
input({ type: "text", name: "address" })

// only children
ul([
    li(["hello"]),
    li(["world"]),
])

// only listeners (attributes is required when listeners is provided to avoid ambiguity)
button({}, { click: () => console.log("clicked") })

// attributes and children
textarea({ name: "words" }, ["Lorem ipsum etc."])
```

Attributes have the names used in JavaScript, not those used in HTML.

```ts
// HTML: <button class="big-button">
button({ className: "big-button" })

// HTML: <button class="big-button red-button">
button({ className: "big-button red-button" })

// HTML: <label for="input-id">
label({ htmlFor: "input-id" })

// HTML: <div aria-label="button">
div({ ariaLabel: "button" })

// HTML: <div data-hello="world">
div({ dataset: { hello: "world" } })
```

There is a function for every HTML element known by TypeScript. These functions all call the `elem` function but with the tag name baked in. (The function that creates `<var>` elements is called `variable`.)

```ts
import { elem } from "ariamis"

const e = elem("made-up-element")
```

### Fragments

```ts
import { fragment, a } from "ariamis"

fragment([
    a({ href: "https://example.com" }),
    p(["Lorem ipsum"]),
])
```

### Raw HTML

This returns a document fragment containing elements created from the given string.

```ts
import { rawHtml } from "ariamis"

const dom = rawHtml("<p>Do you like being hacked?</p>")

console.log(dom.constructor.name) // DocumentFragment
console.log(dom.childNodes[0].constructor.name) // HTMLParagraphElement
```

### Custom Ariamis-like Functions

If you want a component with an API similar to an Ariamis function, you can do the following:

```ts
function ThemedParagraph(...args: ElemArgs<"p">): HTMLParagraphElement {
    const [attrs, listeners, children] = disambiguateElemArgs(...args)

    attrs.classList.push("themed-paragraph")

    return createElement("p", attrs, listeners, children)
}
```

## Why not JSX?

Whether Ariamis is more aesthetically pleasing than JSX is a matter of subjective taste.

JSX can be understood by libraries like React and Solid, but Ariamis can not.

These are some advantages I think Ariamis has:

### No extra build step

### Ariamis can avoid duplication when the key and value have the same name:

```tsx
<input value={value}/>

input({ value })
```

### Ariamis usually has less bracketing:

It's nice not having to wrap JavaScript in curly braces.

```tsx
<ul className={myClass} id={myId} {...props}>
    {lines.map(line => <li>{line}</li>)}
</ul>

ul({ className: myClass, id: myId, ...props },
    lines.map(line => li([line]))
)
```

### Ariamis has only one object syntax:

```tsx
// some higher order component implemented in some way
function MySelectComponent({ color, optionProps }) {
    // ...
}

<MySelectComponent color="primary" optionProps={{ color: "primary" }}/>

MySelectComponent({ color: "primary", optionProps: { color: "primary" } })
```

## Web Components

The current Ariamis API can probably be used to construct web components. However, the type checking will not consider it valid.

## Name

Ariamis is named after the painter from Dark Souls. It's pronounced something like a-ri-a-mis.
