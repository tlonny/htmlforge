import { dedent } from "@src/util"
import { node } from "@src/index"
import { CodeBlock, Heading } from "@www/component"

const QUICK_LOOK = dedent(`
    import { css, Document, node } from "@lonnycorp/htmlforge"

    const html = new Document()
    html.attribute("lang", "en-GB")
    html.head.child(
        new node.Element("title").child(
            new node.Text("Acme Title")
        )
    )

    html.body.child(
        new node.Element("div")
            .css(cls => css.css\`
                .\${cls} { width: 100%; background-color: blue; }
                .\${cls}:hover { background-color: red; }
            \`)
            .child(new node.Text("Hello world"))
    )

    const validHTML = html.toString()
`)

export class QuickLook extends node.Fragment {
    constructor() {
        super()
        this.child(new Heading(2, "Quick Look"))
            .child(new CodeBlock(QUICK_LOOK))
    }
}
