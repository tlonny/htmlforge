import { describe, expect, test } from "bun:test"

import { PLACEHOLDER, css } from "@src/css"

describe("css", () => {
    test("renders CSS chunks with a shared class and animation name", () => {
        const fragment = css`
.${PLACEHOLDER} { animation: ${PLACEHOLDER}-enter 200ms; }
@media print { .${PLACEHOLDER}:hover { color: black; } }
@keyframes ${PLACEHOLDER}-enter { from { opacity: 0; } to { opacity: 1; } }
`
        const name = fragment.hash

        expect(name).toMatch(/^f[0-9a-f]{16}$/)
        expect(fragment.css).toBe(`
.${name} { animation: ${name}-enter 200ms; }
@media print { .${name}:hover { color: black; } }
@keyframes ${name}-enter { from { opacity: 0; } to { opacity: 1; } }
`)
    })

    test("deduplicates identical templates and interpolation values", () => {
        const color = "red"
        const width = 12
        const interpolated = css`.${PLACEHOLDER} { color: ${color}; width: ${width}px; }`
        const repeated = css`.${PLACEHOLDER} { color: ${color}; width: ${width}px; }`

        expect(interpolated).toEqual(repeated)
        expect(interpolated.css).toBe(`.${interpolated.hash} { color: red; width: 12px; }`)
    })

    test("preserves string boundaries and distinguishes literal null from a placeholder", () => {
        expect(css`${"foo"}${"bar"}`.hash).not.toBe(css`${"fo"}${"obar"}`.hash)
        expect(css`${"null"}`.hash).not.toBe(css`${PLACEHOLDER}`.hash)
    })

    test("distinguishes class tokens from hardcoded placeholder text", () => {
        const token = css`.${PLACEHOLDER} { color: red; }`
        const literal = css`.htmlforge_class_placeholder { color: red; }`

        expect(token.hash).not.toBe(literal.hash)
        expect(literal.css).toBe(".htmlforge_class_placeholder { color: red; }")
    })

    test("includes captured values in the hash", () => {
        const red = css`.${PLACEHOLDER} { color: ${"red"}; }`
        const blue = css`.${PLACEHOLDER} { color: ${"blue"}; }`

        expect(red.hash).not.toBe(blue.hash)
    })

    test("hashes a placeholder alias identically to the exported constant", () => {
        const cls: typeof PLACEHOLDER = PLACEHOLDER
        const reused = css`.${cls} { animation: ${cls}-enter 200ms; }`
        const separate = css`.${PLACEHOLDER} { animation: ${PLACEHOLDER}-enter 200ms; }`

        expect(reused).toEqual(separate)
    })

    test("preserves global CSS verbatim and accepts an empty template", () => {
        expect(css`@font-face { font-family: "Demo"; src: url("demo.woff2"); }`.css)
            .toBe("@font-face { font-family: \"Demo\"; src: url(\"demo.woff2\"); }")
        expect(css``.css).toBe("")
    })
})
