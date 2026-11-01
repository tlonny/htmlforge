import type { PhrasingContent } from "mdast"
import { node } from "@src/index"
import { InlineCode } from "@www/component/markdown/inline-code"
import { Strong } from "@www/component/markdown/strong"
import { Text } from "@www/component/markdown/text"

export class PhrasingChild implements node.Buildable {
    private readonly root: node.Buildable

    constructor(child: PhrasingContent) {
        if (child.type === "text") {
            this.root = new Text(child)
            return
        }

        if (child.type === "inlineCode") {
            this.root = new InlineCode(child)
            return
        }

        if (child.type === "strong") {
            this.root = new Strong(child)
            return
        }

        throw new Error(`Markdown inline node is not supported: ${child.type}`)
    }

    build() {
        return this.root.build()
    }
}
