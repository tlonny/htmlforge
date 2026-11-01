import type { Strong as MdastStrong } from "mdast"
import { node } from "@src/index"
import { Phrasing } from "./phrasing"

export class Strong implements node.Buildable {
    private readonly root: node.Element

    constructor(strong: MdastStrong) {
        this.root = new node.Element("strong").child(new Phrasing(strong.children))
    }

    build() {
        return this.root.build()
    }
}
