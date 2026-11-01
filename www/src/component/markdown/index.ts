import { node } from "@src/index"
import { fromMarkdown } from "mdast-util-from-markdown"
import { Blocks } from "@www/component/markdown/blocks"

export class Markdown implements node.Buildable {
    private readonly root: Blocks

    constructor(markdown: string) {
        this.root = new Blocks(fromMarkdown(markdown).children)
    }

    build() {
        return this.root.build()
    }
}
