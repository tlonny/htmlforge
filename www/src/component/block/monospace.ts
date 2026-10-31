import { css, node } from "@src/index"

export class Monospace implements node.Buildable {
    private readonly root: node.Element

    constructor(text: string) {
        this.root = new node.Element("code")
            .child(new node.Text(text))
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
