import type { InlineCode as MdastInlineCode } from "mdast"
import { css, node } from "@src/index"

export class InlineCode implements node.Buildable {
    private readonly root: node.Element

    constructor(code: MdastInlineCode) {
        this.root = new node.Element("code")
            .child(new node.Text(code.value))
        this.root.css(cls => css.css`
            .${cls} {
                font-family: inherit;
                font-size: 0.95em;
                padding: 0.15em 0.35em;
                background: #dfdfdf;
            }
        `)
    }

    build() {
        return this.root.build()
    }
}
