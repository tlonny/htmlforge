import { css, node } from "@src/index"

export class Heading implements node.Buildable {
    private readonly root: node.Element

    constructor(level: 1 | 2 | 3 | 4 | 5 | 6) {
        this.root = new node.Element(`h${level}`)
        this.root.css(cls => css.css`.${cls} { line-height: 1.3; }`)
        if (level === 1) {
            this.root.css(cls => css.css`.${cls} { margin: 0; font-size: 14px; line-height: 1.4; }`)
        } else if (level === 2) {
            this.root.css(cls => css.css`
                .${cls} {
                    margin-top: 2.5rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 2px solid #808080;
                    box-shadow: 0 2px 0 #ffffff;
                    font-size: 1.4rem;
                }
            `)
        } else {
            this.root.css(cls => css.css`.${cls} { margin-top: 2rem; font-size: 1.05rem; }`)
        }
    }

    child(child: node.Buildable | string) {
        this.root.child(typeof child === "string" ? new node.Text(child) : child)
        return this
    }

    build() {
        return this.root.build()
    }
}
