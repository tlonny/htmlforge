import { css, node } from "@src/index"

export class Description extends node.Element {
    constructor(text: string) {
        super("p")
        this.css(cls => css.css`
            .${cls} {
                width: fit-content;
                margin: clamp(12px, 2vw, 20px);
                margin-bottom: 0;
                padding: 8px 12px;
                border: 1px solid #000000;
                background: #ffffe1;
                color: #000000;
                box-shadow: 2px 2px 0 #808080;
            }
        `)
            .child(new node.Text(text))
    }
}
