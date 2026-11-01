import type { BlockContent, RootContent } from "mdast"
import { node } from "@src/index"
import { Code } from "@www/component/markdown/code"
import { Heading } from "@www/component/markdown/heading"
import { List } from "@www/component/markdown/list"
import { Paragraph } from "@www/component/markdown/paragraph"
import { Phrasing } from "@www/component/markdown/phrasing"

export class Block implements node.Buildable {
    private readonly root: node.Buildable

    constructor(block: BlockContent | RootContent) {
        if (block.type === "heading") {
            this.root = new Heading(block.depth)
                .child(new Phrasing(block.children))
            return
        }

        if (block.type === "paragraph") {
            this.root = new Paragraph(block)
            return
        }

        if (block.type === "code") {
            this.root = new Code(block)
            return
        }

        if (block.type === "list") {
            this.root = new List(block)
            return
        }

        throw new Error(`Markdown block node is not supported: ${block.type}`)
    }

    build() {
        return this.root.build()
    }
}
