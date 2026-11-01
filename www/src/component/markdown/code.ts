import type { Code as MdastCode } from "mdast"
import { css, node } from "@src/index"

export class Code implements node.Buildable {
    private readonly root: node.Element

    constructor(code: MdastCode) {
        this.root = new node.Element("pre")
        this.root.css(cls => css.css`
            .${cls} {
                max-width: 100%;
                overflow-x: auto;
                padding: 12px 14px;
                margin: 1.5rem 0;
                border: 0;
                border-radius: 0;
                box-shadow:
                    inset -2px -2px 0 #ffffff,
                    inset 2px 2px 0 #808080,
                    inset -4px -4px 0 #dfdfdf,
                    inset 4px 4px 0 #000000;
                background: #ffffff;
                font-family: inherit;
                line-height: 1.6;
                overflow-wrap: normal;
            }
        `)
        this.root.child(new node.Element("code")
            .css(cls => css.css`
                .${cls}, .${cls}.hljs {
                    display: block;
                    font-family: inherit;
                    font-size: 0.95em;
                    padding: 0;
                    background: none;
                    overflow: visible;
                }
            `)
            .attribute("class", `language-${code.lang ?? "text"}`)
            .child(new node.Text(code.value)))
    }

    build() {
        return this.root.build()
    }
}
