import type { PhrasingContent } from "mdast"
import { node } from "@src/index"
import { PhrasingChild } from "@www/component/markdown/phrasing-child"

export class Phrasing implements node.Buildable {
    private readonly root = new node.Fragment()

    constructor(children: PhrasingContent[]) {
        for (const child of children) {
            this.root.child(new PhrasingChild(child))
        }
    }

    build() {
        return this.root.build()
    }
}
