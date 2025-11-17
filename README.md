# htmlforge

htmlforge is a minimal, zero-dependency library for building fully-styled HTML in TypeScript/JavaScript.

# Features

- Zero dependencies.
- Efficient and ergonomic inline styling (using de-duplicated dynamic classes).
- Reusable "Component"-pattern for composing common UIs.

# Quick Look

```typescript
import { Document, NodeElement, NodeText } from "htmlforge"

const document = new Document()
document.attributeAdd("lang", "en-GB")
document.head.childAdd(
    new NodeElement("title").childAdd(
        new NodeText("Acme Title")
    )
)

document.body.childAdd(
    new NodeElement("div")
        .styleAdd("width", "100%")
        .styleAdd("background-color", "blue")
        .styleAdd("background-color", "red", { pseudoSelector: ":hover" })
        .childAdd(new NodeText("Hello world"))
)

const validHTML = document.toString()
```

# Installation

Install the package from npm:

```bash
npm install htmlforge
```

# Usage

## HTML Document structure

An `htmlforge` `Document` is a tree of nodes. Nodes come in a few flavors:
- `NodeElement`: represent tags (e.g., `<div>`, `<head>`, `<body>`), can hold attributes and inline styles, and can nest any other node as a child.
- `NodeText`: hold plain text content that will be HTML-escaped.
- `NodeRaw`: hold raw HTML without escaping.
- `NodeFragment`: groups a collection of child nodes without introducing a wrapping element.

## Creating an HTML document

Create a new HTML document using `new Document()`, set attributes on the root `<html>` element via `document.attributeAdd`, and work directly with `document.head` and `document.body` to populate content.

```typescript
import { Document, NodeElement, NodeText } from "htmlforge"

const doc = new Document()
    .attributeAdd("lang", "en")
    .attributeAdd("data-theme", "dark")

doc.body.childAdd(new NodeText("Hello world"))
```

## Element nodes

`document.head` and `document.body` are `NodeElement` nodes. You can create your own with `new NodeElement("tagname")`. Element nodes support:
- `attributeAdd(name, value)` for HTML attributes
- `styleAdd(property, value, options?)` for inline styles (with optional `pseudoSelector`, `mediaQuery`)
- `childAdd(node)` to nest children nodes

These calls are chainable to keep element construction compact.

```typescript
import { NodeElement, NodeText } from "htmlforge"

const card = new NodeElement("section")
    .attributeAdd("aria-label", "profile card")
    .styleAdd("border", "1px solid #ccc")
    .childAdd(
        new NodeElement("h2").childAdd(new NodeText("Ada Lovelace"))
    )
    .childAdd(
        new NodeElement("p")
            .styleAdd("color", "#555")
            .childAdd(new NodeText("First computer programmer."))
    )
```

## Fragment nodes

`NodeFragment` groups child nodes without adding a wrapper element. It only supports `childAdd` (also chainable).

```typescript
import { NodeFragment, NodeElement, NodeText } from "htmlforge"

const listItems = new NodeFragment()
    .childAdd(new NodeElement("li").childAdd(new NodeText("One")))
    .childAdd(new NodeElement("li").childAdd(new NodeText("Two")))
    .childAdd(new NodeElement("li").childAdd(new NodeText("Three")))
```

## Text and Raw nodes

- `NodeText` holds HTML-escaped text content (no additional methods).
- `NodeRaw` injects raw HTML as-is (no additional methods).

```typescript
import { NodeText, NodeRaw } from "htmlforge"

const safeText = new NodeText("<em>Escaped</em> output")
const rawHtml = new NodeRaw("<em>Unescaped</em> output")
```

## Define your own nodes

Implement the `INode` interface to build reusable components. Compose a private `NodeElement` (style/shape it however you like) and proxy its `build()` method. Anything that implements `INode` can be passed to `childAdd` on `NodeElement` or `NodeFragment`.

```typescript
import type { INode } from "htmlforge"
import { NodeElement, NodeText } from "htmlforge"

class Alert implements INode {
    private readonly el = new NodeElement("div")
        .attributeAdd("role", "alert")
        .styleAdd("padding", "12px 16px")
        .styleAdd("background-color", "#fffae6")

    constructor(message: string) {
        this.el.childAdd(new NodeText(message))
    }

    // Optional: expose childAdd to let callers inject arbitrary child nodes
    childAdd(child: INode) {
        this.el.childAdd(child)
        return this
    }

    build() {
        return this.el.build()
    }
}
```
