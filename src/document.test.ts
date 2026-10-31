import { describe, expect, test } from "bun:test"

import { css, Document, node } from "@src/index"

describe("Document CSS", () => {
    test("deduplicates shared fragments across elements while attaching every class", () => {
        const shared = css.css`.${css.PLACEHOLDER} { color: red; }`
        const spacing = css.css`.${css.PLACEHOLDER} { padding: 8px; }`
        const document = new Document({ displaySignature: false })
        document.body
            .child(new node.Element("div")
                .attribute("class", "existing")
                .css(cls => css.css`.${cls} { color: red; }`)
                .css(() => spacing))
            .child(new node.Element("p")
                .css(cls => css.css`.${cls} { color: red; }`))

        const expected = "<!DOCTYPE html><html><head>"
            + `<style>${shared.css}</style><style>${spacing.css}</style>`
            + "</head><body>"
            + `<div class="existing ${shared.hash} ${spacing.hash}"></div>`
            + `<p class="${shared.hash}"></p>`
            + "</body></html>"
        expect(document.toString()).toBe(expected)
        expect(document.toString()).toBe(expected)
    })

    test("emits media queries, keyframes, and global rules verbatim at stylesheet level", () => {
        const rules = css.css`@font-face { font-family: Demo; src: url(demo.woff2); }
@media print { .${css.PLACEHOLDER} { display: none; } }
@keyframes ${css.PLACEHOLDER}-enter { from { opacity: 0; } to { opacity: 1; } }`
        const document = new Document({ displaySignature: false })
        document.body.child(new node.Element("article").css(() => rules))

        expect(document.toString()).toBe(
            `<!DOCTYPE html><html><head><style>${rules.css}</style></head>`
            + `<body><article class="${rules.hash}"></article></body></html>`
        )
    })

    test("keeps imports at the start of their own stylesheet after other chunks", () => {
        const rules = css.css`.${css.PLACEHOLDER} { color: red; }`
        const imported = css.css`@import url("theme.css");`
        const document = new Document({ displaySignature: false })
        document.head.child(new node.Element("style").child(new node.Raw("body { margin: 0; }")))
        document.body
            .css(() => rules)
            .child(new node.Element("p").css(() => imported))
            .child(new node.Element("div").css(() => imported))

        expect(document.toString()).toBe(
            "<!DOCTYPE html><html><head>"
            + `<style>${rules.css}</style><style>${imported.css}</style>`
            + "<style>body { margin: 0; }</style></head>"
            + `<body class="${rules.hash}">`
            + `<p class="${imported.hash}"></p><div class="${imported.hash}"></div>`
            + "</body></html>"
        )
    })

    test("omits generated style elements when there are no CSS chunks", () => {
        const document = new Document({ displaySignature: false })

        expect(document.toString()).toBe("<!DOCTYPE html><html><head></head><body></body></html>")
    })
})
