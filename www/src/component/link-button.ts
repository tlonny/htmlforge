import { css, node } from "@src/index"

export class LinkButton implements node.Buildable {
    private readonly root = new node.Element("a")
        .css(cls => css.css`
            .${cls} {
                display: inline-block;
                max-width: 100%;
                padding: 8px 18px;
                border: 0;
                border-radius: 0;
                box-shadow:
                    inset -2px -2px 0 #000000,
                    inset 2px 2px 0 #ffffff,
                    inset -4px -4px 0 #808080,
                    inset 4px 4px 0 #dfdfdf;
                background: #c0c0c0;
                color: #000000;
                font: inherit;
                line-height: 1.5;
                text-align: center;
                text-decoration: none;
                cursor: pointer;
            }
            .${cls}:visited { color: #000000; }
            .${cls}:focus-visible {
                outline: 1px dotted #000000;
                outline-offset: -6px;
            }
            .${cls}:active {
                box-shadow:
                    inset -2px -2px 0 #ffffff,
                    inset 2px 2px 0 #000000,
                    inset -4px -4px 0 #dfdfdf,
                    inset 4px 4px 0 #808080;
                padding: 10px 16px 6px 20px;
            }
        `)

    constructor(href: string, label: string) {
        this.root.attribute("href", href).child(new node.Text(label))
    }

    build() {
        return this.root.build()
    }
}
