import { css, node } from "@src/index"
import { Heading } from "@www/component/markdown/heading"

export class Window implements node.Buildable {
    private readonly content = new node.Element("article")
        .css(cls => css.css`
            .${cls} { padding: clamp(12px, 2vw, 20px); }
            .${cls} > :first-child { margin-top: 0; }
            .${cls} > :last-child { margin-bottom: 0; }
        `)

    private readonly root = new node.Element("main")
        .css(cls => css.css`
            .${cls} {
                width: calc(100% - 24px);
                max-width: 960px;
                margin: clamp(12px, 2vw, 24px) auto;
                padding: 6px;
                border: 0;
                border-radius: 0;
                box-shadow:
                    inset -2px -2px 0 #000000,
                    inset 2px 2px 0 #dfdfdf,
                    inset -4px -4px 0 #808080,
                    inset 4px 4px 0 #ffffff;
                background: #c0c0c0;
                overflow-wrap: anywhere;
            }
        `)

    constructor(title: string, navigation?: node.Buildable, description?: node.Buildable) {
        this.root
            .child(new node.Element("header")
                .css(cls => css.css`
                    .${cls} {
                        padding: 3px 6px;
                        background: #000080;
                        color: #ffffff;
                    }
                `)
                .child(new Heading(1).child(title)))
        if (description) this.root.child(description)
        if (navigation) this.root.child(navigation)
        this.root.child(this.content)
    }

    child(child: node.Buildable) {
        this.content.child(child)
        return this
    }

    build() {
        return this.root.build()
    }
}
