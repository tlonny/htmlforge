import { css, Document, node } from "@src/index"
import content from "@www/content/home.md" with { type: "text" }
import { Description } from "@www/component/description"
import { Footer } from "@www/component/footer"
import { Highlight } from "@www/component/highlight"
import { Markdown } from "@www/component/markdown/index"
import { Navigation } from "@www/component/navigation"
import { Window } from "@www/component/window"

export class Home extends Document {
    constructor() {
        super()
        this.attribute("lang", "en")
        this.head
            .child(new node.Element("meta").attribute("charset", "utf-8"))
            .child(new node.Element("meta")
                .attribute("name", "viewport")
                .attribute("content", "width=device-width, initial-scale=1"))
            .child(new node.Element("meta")
                .attribute("name", "description")
                .attribute("content", "A minimal, zero-dependency library for building fully-styled HTML in TypeScript/JavaScript."))
            .child(new node.Element("title").child(new node.Text("HTMLForge")))
            .child(new node.Element("link")
                .attribute("rel", "icon")
                .attribute("href", "/favicon.png")
                .attribute("type", "image/png"))
            .child(new Highlight())
        this.body
            .css(cls => css.css`
                html { background: #000000; }
                .${cls}, .${cls} * { box-sizing: border-box; }
                .${cls} {
                    display: flex;
                    flex-direction: column;
                    min-height: 100vh;
                    min-height: 100svh;
                    margin: 0;
                    background: #000000;
                    color: #000000;
                    font-family: ui-monospace, "SFMono-Regular", Consolas, "Liberation Mono", monospace;
                    font-size: 0.8rem;
                    line-height: 1.6;
                }
            `)
            .child(new node.Element("div")
                .css(cls => css.css`
                    .${cls} {
                        display: flow-root;
                        flex: 1;
                        background: #008080;
                    }
                `)
                .child(new Window(
                    "HTMLForge",
                    new Navigation(),
                    new Description("A minimal, zero-dependency library for building fully-styled HTML in TypeScript/JavaScript.")
                )
                    .child(new Markdown(content))))
            .child(new Footer())
    }
}
