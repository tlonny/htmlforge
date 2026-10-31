import { dedent } from "@src/util"
import { node } from "@src/index"
import { CodeBlock, Heading, List, ListItem } from "@www/component"
import { Monospace } from "@www/component/block"

const TEXT_AND_RAW = dedent(`
    import { node } from "@lonnycorp/htmlforge"

    const safeText = new node.Text("<em>Escaped</em> output")
    const rawHtml = new node.Raw("<em>Unescaped</em> output")
`)

export class TextAndRaw extends node.Fragment {
    constructor() {
        super()
        this.child(new Heading(3, "Text and Raw nodes"))
            .child(new List(
                new ListItem(
                    new Monospace("node.Text"),
                    " holds HTML-escaped text content (no additional methods)."
                ),
                new ListItem(new Monospace("node.Raw"), " injects raw HTML as-is (no additional methods).")
            ))
            .child(new CodeBlock(TEXT_AND_RAW))
    }
}
