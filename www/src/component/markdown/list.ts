import type { List as MdastList } from "mdast"
import { css, node } from "@src/index"
import { ListItem } from "./list-item"

export class List implements node.Buildable {
    private readonly root: node.Element

    constructor(list: MdastList) {
        if (list.ordered) throw new Error("Ordered Markdown lists are not supported")
        this.root = new node.Element("ul")
            .css(cls => css.css`
                .${cls} { margin: 1rem 0; padding-left: 1.5rem; }
                .${cls} > li + li { margin-top: 0.4rem; }
            `)
        for (const item of list.children) {
            this.root.child(new node.Element("li").child(new ListItem(item)))
        }
    }

    build() {
        return this.root.build()
    }
}
