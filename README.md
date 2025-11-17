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
document.addAttribute("lang", "en-GB")
document.head.addChild(
    new NodeElement("title").addChild(
        new NodeText("Acme Title")
    )
)

document.body.addChild(
    new NodeElement("div")
        .addStyle("width", "100%")
        .addStyle("background-color", "blue")
        .addStyle("background-color", "red", { pseudoSelector: ":hover" })
        .addChild(new NodeText("Hello world"))
)

const validHTML = document.toString()
```

# Installation

Install the package from npm:

```bash
npm install htmlforge
```

# Usage

## Document structure

An `htmlforge` `Document` is a tree of nodes. Nodes come in a few flavors:
- `Element` nodes represent tags (e.g., `<div>`, `<head>`, `<body>`), can hold attributes and inline styles, and can nest any other node as a child.
- `Text` nodes hold plain text content that will be HTML-escaped.
- `Raw` nodes inject raw HTML without escaping.
- `Fragment` nodes group a collection of child nodes without introducing a wrapping element.

## Document creation

Create a `Document`, set attributes on the root `<html>` element via `document.addAttribute`, and work directly with `document.head` and `document.body` to populate content.

```ts
import { Document, NodeElement, NodeText } from "htmlforge"

const doc = new Document()
    .addAttribute("lang", "en")
    .addAttribute("data-theme", "dark")
```

## Element nodes

`document.head` and `document.body` are `Element` nodes, and you can create your own with `new NodeElement("tagname")`. Element nodes support:
- `addAttribute(name, value)` for HTML attributes
- `addStyle(property, value, options?)` for inline styles (with optional `pseudoSelector`, `mediaQuery`, `containerQuery`)
- `addChild(node)` to nest children nodes

These calls are chainable to keep element construction compact.

```ts
import { NodeElement, NodeText } from "htmlforge"

const card = new NodeElement("section")
    .addAttribute("aria-label", "profile card")
    .addStyle("border", "1px solid #ccc")
    .addChild(
        new NodeElement("h2").addChild(new NodeText("Ada Lovelace"))
    )
    .addChild(
        new NodeElement("p")
            .addStyle("color", "#555")
            .addChild(new NodeText("First computer programmer."))
    )
```

## Fragment nodes

`NodeFragment` groups child nodes without adding a wrapper element—helpful when you need to return multiple siblings. It only supports `addChild`.

```ts
import { NodeFragment, NodeElement, NodeText } from "htmlforge"

const listItems = new NodeFragment()
    .addChild(new NodeElement("li").addChild(new NodeText("One")))
    .addChild(new NodeElement("li").addChild(new NodeText("Two")))
    .addChild(new NodeElement("li").addChild(new NodeText("Three")))
```

## Text and Raw nodes

- `NodeText` holds HTML-escaped text content (no additional methods).
- `NodeRaw` injects raw HTML as-is (no additional methods).

```ts
import { NodeText, NodeRaw } from "htmlforge"

const safeText = new NodeText("<em>Escaped</em> output")  // renders as text: &lt;em&gt;Escaped&lt;/em&gt;
const rawHtml = new NodeRaw("<em>Unescaped</em> output") // renders as HTML: <em>Unescaped</em> output
```

## Define your own nodes

Implement the `INode` interface to build reusable components. Compose a private `NodeElement` (style/shape it however you like) and proxy its `build()` method. Anything that implements `INode` can be passed to `addChild` on `NodeElement` or `NodeFragment`.

```ts
import type { INode } from "htmlforge"
import { NodeElement, NodeText } from "htmlforge"

class Alert implements INode {
    private readonly el = new NodeElement("div")
        .addAttribute("role", "alert")
        .addStyle("padding", "12px 16px")
        .addStyle("background-color", "#fffae6")

    constructor(message: string) {
        this.el.addChild(new NodeText(message))
    }

    // Optional: expose addChild to let callers inject arbitrary child nodes
    addChild(child: INode) {
        this.el.addChild(child)
        return this
    }

    build() {
        return this.el.build()
    }
}
```
