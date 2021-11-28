# Ariamis

Ariamis is a small and beautiful DOM creation library.

Ariamis is a thin API over native DOM code for constructing DOM elements. It wraps up what could be several DOM API calls into a single function for constructing an element. This allows DOM hierarchy to be constructed declaratively by creating a parent element and passing it child nodes in a single expression.

Ariamis leverages TypeScript to check that your DOM creation is valid.

## Installation

```sh
npm install ariamis
```

## Examples

### Elements

Create a button with attributes and `type="button"`, an event handler listening for the `click` event, and a child text node that says `"Click Me"`.

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
    li(["hello"])
    li(["world"])
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
    p(["Lorem ipsum"])
])
```

### Raw HTML

This returns a document fragment containing elements created from the given string.

```ts
import { rawHtml } from "ariamis"

const dom = rawHtml("<p>Do you like being hacked?</p>")

console.log(dom.constructor.name) // DocumentFragment
console.log(s.childNodes[0].constructor.name) // HTMLParagraphElement
```

## Why not JSX?

Whether Ariamis is more aesthetically pleasing than JSX is a matter of taste.

JSX can be used with libraries like React and Solid, but Ariamis can not.

These are some advantages I think Ariamis has:

Ariamis can avoid duplication when the key and value have the same name:

```tsx
<input value={value}/>
// vs
input({ value })
```

Ariamis usually has less bracketing. It's nice not having to wrap JavaScript in curly braces.

```tsx
<ul className={myClass} id={myId}>
    {lines.map(line => <li>{line}</li>)}
</ul>

ul({ className: cls, id: myId },
    lines.map(line => li([line]))
)
```

## Name

Ariamis is named after the painter from Dark Souls. It's pronounced something like a-ri-a-mis.
