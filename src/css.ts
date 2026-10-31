import { createHash } from "node:crypto"

const PLACEHOLDER_HASH_MARKER = "null"

export const PLACEHOLDER = Symbol("css.PLACEHOLDER")

type CssPart = string | typeof PLACEHOLDER
type CssInterpolation = string | number | typeof PLACEHOLDER

export type Chunk = {
    readonly hash: string
    readonly css: string
}

export const css = (
    strings: TemplateStringsArray,
    ...values: CssInterpolation[]
): Chunk => {
    const hasher = createHash("sha256")
    const parts: CssPart[] = []

    for (let index = 0; index < strings.length; index++) {
        const text = strings[index] ?? ""
        hasher.update(JSON.stringify(text))
        parts.push(text)

        if (index === values.length) {
            break
        }

        const value = values[index]
        if (value === PLACEHOLDER) {
            hasher.update(PLACEHOLDER_HASH_MARKER)
            parts.push(value)
        } else {
            const interpolated = String(value)
            hasher.update(JSON.stringify(interpolated))
            parts.push(interpolated)
        }
    }

    const digest = hasher
        .digest()
        .subarray(0, 8)
        .toString("hex")
    const hash = `f${digest}`
    const rendered = parts
        .map(part => part === PLACEHOLDER ? hash : part)
        .join("")

    return { hash, css: rendered }
}
