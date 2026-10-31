import { dedent } from "@src/util"
import { node } from "@src/index"
import { CodeBlock, Heading, Paragraph } from "@www/component"

const INSTALLATION = dedent(`
    npm install @lonnycorp/htmlforge
`)

export class Installation extends node.Fragment {
    constructor() {
        super()
        this.child(new Heading(2, "Installation"))
            .child(new Paragraph("Install the package from npm:"))
            .child(new CodeBlock(INSTALLATION, "bash"))
    }
}
