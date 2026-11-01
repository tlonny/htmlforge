import { css, node } from "@src/index"
import { LinkButton } from "./link-button"

export class Navigation extends node.Element {
    constructor() {
        super("nav")
        this.attribute("aria-label", "Project links")
            .css(cls => css.css`
                .${cls} {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    padding: clamp(12px, 2vw, 20px);
                    padding-bottom: 0;
                }
            `)
            .child(new LinkButton("https://github.com/tlonny/htmlforge", "source"))
            .child(new LinkButton("https://www.npmjs.com/package/@lonnycorp/htmlforge", "npm"))
    }
}
