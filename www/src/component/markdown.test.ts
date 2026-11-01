import { describe, expect, test } from "bun:test"
import { Document } from "@src/index"
import { Markdown } from "./markdown/index"

const render = (markdown: string) => {
    const document = new Document({ displaySignature: false })
    document.body.child(new Markdown(markdown))
    return document.toString()
}

describe("Markdown", () => {
    test("renders nested inline content and escapes text and code", () => {
        const html = render("## A **bold heading**\n\nUse `a < b` & **docs**.\n\n```ts\nconst value = `<script>`\n```")
        expect(html).toMatch(/<h2[^>]*>A <strong>bold heading<\/strong><\/h2>/)
        expect(html).toContain("a &lt; b</code> &amp; <strong>docs</strong>.")
        expect(html).toContain("language-ts")
        expect(html).toContain("const value = `&lt;script&gt;`")
        expect(html).toContain("<style>")
    })

    test("renders the documentation's simple bullet lists", () => {
        const html = render("- **Zero dependencies**.\n- Use `node.Element`.")
        expect(html).toMatch(/<ul[^>]*><li><strong>Zero dependencies<\/strong>.<\/li><li>Use <code[^>]*>node.Element<\/code>.<\/li><\/ul>/)
    })

    test("fails the build for unsupported raw HTML", () => {
        expect(() => render("<div>raw HTML</div>")).toThrow("Markdown block node is not supported: html")
        expect(() => render("![example](/example.png)")).toThrow("Markdown inline node is not supported: image")
    })
})
