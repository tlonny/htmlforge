import { describe, expect, test } from "bun:test"

import { PLACEHOLDER, css } from "@src/css"
import { Element, Text } from "@src/node"

describe("Element", () => {
    test("chains CSS callbacks with attributes and children", () => {
        const layout = css`.${PLACEHOLDER} { display: flex; }`
        const hover = css`.${PLACEHOLDER}:hover { color: red; }`
        const node = new Element("div")
            .css(cls => css`.${cls} { display: flex; }`)
            .css(cls => css`.${cls}:hover { color: red; }`)
            .attribute("id", "demo")
            .child(new Text("content"))

        expect(Array.from(node.build())).toEqual([
            { buildArtifactType: "CSS_CHUNK", ...layout },
            { buildArtifactType: "CSS_CHUNK", ...hover },
            {
                buildArtifactType: "TAG_OPEN",
                tagName: "div",
                isVoid: false,
                attributes: [
                    { name: "id", value: "demo" },
                    { name: "class", value: layout.hash },
                    { name: "class", value: hover.hash }
                ]
            },
            { buildArtifactType: "TEXT", text: "content" },
            { buildArtifactType: "TAG_CLOSE", tagName: "div" }
        ])
    })

    test("runs callbacks once when CSS is added and keeps repeated builds stable", () => {
        let calls = 0
        const node = new Element("div").css(cls => {
            calls++
            expect(cls).toBe(PLACEHOLDER)
            return css`.${cls} { color: red; }`
        })

        expect(calls).toBe(1)
        const first = Array.from(node.build())
        expect(Array.from(node.build())).toEqual(first)
        expect(calls).toBe(1)
    })

    test("attaches duplicate chunks only once and preserves existing classes", () => {
        const shared = css`.${PLACEHOLDER} { color: red; }`
        const node = new Element("div")
            .attribute("class", "existing")
            .css(() => shared)
            .css(() => shared)

        expect(Array.from(node.build())).toEqual([
            { buildArtifactType: "CSS_CHUNK", ...shared },
            {
                buildArtifactType: "TAG_OPEN",
                tagName: "div",
                isVoid: false,
                attributes: [
                    { name: "class", value: "existing" },
                    { name: "class", value: shared.hash }
                ]
            },
            { buildArtifactType: "TAG_CLOSE", tagName: "div" }
        ])
    })

    test("does not emit a chunk when no CSS is provided", () => {
        const node = new Element("section")
            .attribute("data-kind", "plain")
            .child(new Text("content"))

        expect(Array.from(node.build())).toEqual([
            {
                buildArtifactType: "TAG_OPEN",
                tagName: "section",
                isVoid: false,
                attributes: [{ name: "data-kind", value: "plain" }]
            },
            { buildArtifactType: "TEXT", text: "content" },
            { buildArtifactType: "TAG_CLOSE", tagName: "section" }
        ])
    })

    test("renders void elements once and ignores children", () => {
        const width = css`.${PLACEHOLDER} { width: 128px; }`
        const img = new Element("img")
            .attribute("src", "/logo.png")
            .css(cls => css`.${cls} { width: 128px; }`)
            .child(new Text("should-not-render"))

        expect(Array.from(img.build())).toEqual([
            { buildArtifactType: "CSS_CHUNK", ...width },
            {
                buildArtifactType: "TAG_OPEN",
                tagName: "img",
                isVoid: true,
                attributes: [
                    { name: "src", value: "/logo.png" },
                    { name: "class", value: width.hash }
                ]
            }
        ])
    })
})
