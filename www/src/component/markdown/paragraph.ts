import type { Paragraph as MdastParagraph } from "mdast"
import { css, node } from "@src/index"
import { Phrasing } from "./phrasing"

export class Paragraph implements node.Buildable {
    private readonly root: node.Element

    constructor(paragraph: MdastParagraph) {
        this.root = new node.Element("p")
            .css(cls => css.css`.${cls} { margin: 1rem 0; }`)
            .child(new Phrasing(paragraph.children))
    }

    build() {
        return this.root.build()
    }
}
