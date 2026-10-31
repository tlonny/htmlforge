import { css, node } from "@src/index"

export class Strong implements node.Buildable {
    private readonly root: node.Element

    constructor(text: string) {
        this.root = new node.Element("strong")
            .child(new node.Text(text))
        this.root.css(cls => css.css`.${cls} { font-weight: 700; }`)
    }

    build() {
        return this.root.build()
    }
}
