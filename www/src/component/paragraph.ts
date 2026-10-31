import { css, node } from "@src/index"
import { Block } from "./block"
import type { Content } from "./block"

export class Paragraph implements node.Buildable {
    private readonly root = new node.Element("p")
        .css(cls => css.css`.${cls} { margin: 1rem 0; }`)

    constructor(...content: Content[]) {
        this.root.child(new Block(...content))
    }

    build() {
        return this.root.build()
    }
}
