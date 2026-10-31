import { describe, expect, test } from "bun:test"

import { dedent } from "@src/util"

describe("dedent", () => {
    test("removes outer blank lines and preserves relative indentation", () => {
        expect(dedent(`
            const example = () => {
                return true
            }
        `)).toBe("const example = () => {\n    return true\n}")
    })

    test("preserves internal blank lines and handles CRLF and tabs", () => {
        expect(dedent("\r\n\tfirst\r\n\t\r\n\t\tsecond\r\n"))
            .toBe("first\n\n\tsecond")
    })

    test("accepts empty, whitespace-only, and unindented input", () => {
        expect(dedent("")).toBe("")
        expect(dedent(" \n\t\n")).toBe("")
        expect(dedent("first\n  second")).toBe("first\n  second")
    })
})
