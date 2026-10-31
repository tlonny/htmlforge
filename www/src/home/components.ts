import { dedent } from "@src/util"
import { node } from "@src/index"
import { CodeBlock, Heading, Paragraph } from "@www/component"
import { Monospace } from "@www/component/block"

const CUSTOM_COMPONENT = dedent(`
    import { css, node } from "@lonnycorp/htmlforge"

    class Alert implements node.Buildable {
        private readonly el = new node.Element("div")
            .attribute("role", "alert")
            .css(cls => css.css\`.\${cls} { padding: 12px 16px; background-color: #fffae6; }\`)

        constructor(message: string) {
            this.el.child(new node.Text(message))
        }

        // Optional: expose child to let callers inject arbitrary child nodes
        child(child: node.Buildable) {
            this.el.child(child)
            return this
        }

        build() {
            return this.el.build()
        }
    }
`)

export class Components extends node.Fragment {
    constructor() {
        super()
        this.child(new Heading(3, "Define your own nodes"))
            .child(new Paragraph(
                "Implement the ",
                new Monospace("node.Buildable"),
                " interface to build reusable components. Compose a private ",
                new Monospace("node.Element"),
                " (style/shape it however you like) and proxy its ",
                new Monospace("build()"),
                " method. Anything that implements ",
                new Monospace("node.Buildable"),
                " can be passed to ",
                new Monospace("child"),
                " on ",
                new Monospace("node.Element"),
                " or ",
                new Monospace("node.Fragment"),
                "."
            ))
            .child(new CodeBlock(CUSTOM_COMPONENT))
    }
}
