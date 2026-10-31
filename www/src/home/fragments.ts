import { dedent } from "@src/util"
import { node } from "@src/index"
import { CodeBlock, Heading, Paragraph } from "@www/component"
import { Monospace } from "@www/component/block"

const FRAGMENTS = dedent(`
    import { node } from "@lonnycorp/htmlforge"

    const listItems = new node.Fragment()
        .child(new node.Element("li").child(new node.Text("One")))
        .child(new node.Element("li").child(new node.Text("Two")))
        .child(new node.Element("li").child(new node.Text("Three")))
`)

export class Fragments extends node.Fragment {
    constructor() {
        super()
        this.child(new Heading(3, new Monospace("node.Fragment"), " nodes"))
            .child(new Paragraph(
                new Monospace("node.Fragment"),
                " groups child nodes without adding a wrapper element. It only supports ",
                new Monospace("child"),
                " (also chainable)."
            ))
            .child(new CodeBlock(FRAGMENTS))
    }
}
