import { dedent } from "@src/util"
import { node } from "@src/index"
import { CodeBlock, Heading, List, ListItem, Paragraph } from "@www/component"
import { Monospace } from "@www/component/block"

const ELEMENTS = dedent(`
    import { css, node } from "@lonnycorp/htmlforge"

    const card = new node.Element("section")
        .attribute("aria-label", "profile card")
        .css(cls => css.css\`.\${cls} { border: 1px solid #ccc; }\`)
        .child(
            new node.Element("h2").child(new node.Text("Ada Lovelace"))
        )
        .child(
            new node.Element("p")
                .css(cls => css.css\`.\${cls} { color: #555; }\`)
                .child(new node.Text("First computer programmer."))
        )
`)

export class Elements extends node.Fragment {
    constructor() {
        super()
        this.child(new Heading(2, new Monospace("node.Element"), " nodes"))
            .child(new Paragraph(new Monospace("node.Element"), " supports:"))
            .child(new List(
                new ListItem(new Monospace("attribute(name, value)"), " for HTML attributes"),
                new ListItem(
                    new Monospace("css(build)"),
                    " for complete CSS rules, with a callback receiving a class placeholder"
                ),
                new ListItem(new Monospace("child(node)"), " to nest children nodes")
            ))
            .child(new Paragraph("These calls are chainable to keep element construction compact."))
            .child(new Paragraph(
                "Each ",
                new Monospace(".css()"),
                " callback runs once and returns a ",
                new Monospace("css.Chunk"),
                " from the ",
                new Monospace("css.css"),
                " tagged template. Interpolate the placeholder as ",
                new Monospace(".${cls}"),
                " in selectors or ",
                new Monospace("${cls}-enter"),
                " in animation names. The chunk hash becomes its class name. Multiple calls attach multiple classes, and identical templates and interpolation values are emitted once per document."
            ))
            .child(new Paragraph("CSS is emitted verbatim, so media queries, keyframes, and global rules can be placed at the stylesheet level. String and number interpolations are inserted without escaping."))
            .child(new Paragraph(
                "Chunks can also be reused with ",
                new Monospace(".css(() => sharedChunk)"),
                ". When rules have equal specificity, their order in the document stylesheet determines precedence; chaining order does not override CSS cascade rules."
            ))
            .child(new CodeBlock(ELEMENTS))
    }
}
