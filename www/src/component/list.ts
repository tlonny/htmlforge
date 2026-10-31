import { css, node } from "@src/index"
import { Block } from "./block"
import type { Content } from "./block"

export class ListItem implements node.Buildable {
    private readonly root = new node.Element("li")

    constructor(...content: Content[]) {
        this.root.child(new Block(...content))
    }

    build() {
        return this.root.build()
    }
}

export class List implements node.Buildable {
    private readonly root = new node.Element("ul")
        .css(cls => css.css`
            .${cls} { margin: 1rem 0; padding-left: 1.5rem; }
            .${cls} > li + li { margin-top: 0.4rem; }
        `)

    constructor(...items: ListItem[]) {
        for (const item of items) {
            this.root.child(item)
        }
    }

    build() {
        return this.root.build()
    }
}
