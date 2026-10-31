import { css, node } from "@src/index"
import { Heading, List, ListItem, Paragraph } from "@www/component"
import { Strong } from "@www/component/block"
import { LinkButton } from "@www/component/link-button"

export class Introduction extends node.Fragment {
    constructor() {
        super()
        this.child(new Paragraph("A minimal, zero-dependency library for building fully-styled HTML in TypeScript/JavaScript."))
            .child(new node.Element("div")
                .css(cls => css.css`
                    .${cls} { display: flex; flex-wrap: wrap; gap: 8px; }
                `)
                .child(new LinkButton("https://github.com/tlonny/htmlforge", "source"))
                .child(new LinkButton("https://www.npmjs.com/package/@lonnycorp/htmlforge", "npm")))
            .child(new Heading(2, "Features"))
            .child(new List(
                new ListItem(new Strong("Zero dependencies"), "."),
                new ListItem("Arbitrary CSS with content-based classes and CSS chunk deduplication."),
                new ListItem("Reusable \"Component\"-pattern for composing common UIs.")
            ))
    }
}
