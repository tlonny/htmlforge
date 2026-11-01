import type { BlockContent, RootContent } from "mdast"
import { node } from "@src/index"
import { Block } from "@www/component/markdown/block"

export class Blocks implements node.Buildable {
    private readonly root = new node.Fragment()

    constructor(blocks: Array<BlockContent | RootContent>) {
        for (const block of blocks) {
            this.root.child(new Block(block))
        }
    }

    build() {
        return this.root.build()
    }
}
