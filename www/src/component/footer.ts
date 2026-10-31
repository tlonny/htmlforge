import { css, node } from "@src/index"

export class Footer implements node.Buildable {
    private readonly root = new node.Element("footer")
        .css(cls => css.css`
            .${cls} {
                width: 100%;
                margin-top: auto;
                padding: 12px 24px;
                background: #000000;
                color: #ffffff;
                font-size: 0.75rem;
                line-height: 1.5;
                text-align: center;
            }
            .${cls} a {
                color: inherit;
                font-weight: 700;
                padding: 0 2px;
                text-decoration: underline;
                text-underline-offset: 0.2em;
            }
            .${cls} a:hover, .${cls} a:focus-visible {
                background: #ffffff;
                color: #000000;
            }
        `)
        .child(new node.Text("Created by the "))
        .child(new node.Element("a")
            .attribute("href", "https://www.lonnycorp.com")
            .child(new node.Text("Lonny Corporation")))

    build() {
        return this.root.build()
    }
}
