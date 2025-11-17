import { describe, expect, test } from "bun:test"

import type { BuildArtifact, BuildArtifactStyledClass, BuildArtifactTagOpen } from "@src/type"
import { NodeElement } from "@src/node/element"
import { NodeText } from "@src/node/text"

describe("NodeElement", () => {

    test("renders div with attributes and CSS rules", () => {
        const node = new NodeElement("div")
            .attributeAdd("id", "demo")
            .attributeAdd("data-role", "content")
            .styleAdd("display", "flex")
            .styleAdd("justify-content", "center")
            .styleAdd("color", "red", { pseudoSelector: ":hover" })
            .styleAdd("background-color", "#fafafa", { pseudoSelector: ":focus" })
            .styleAdd("font-size", "12px", { mediaQuery: "@media (max-width: 600px)" })

        const buildArtifacts = Array.from(node.build()) as BuildArtifact[]

        expect(buildArtifacts.map(a => a.buildArtifactType)).toEqual([
            "STYLED_CLASS",
            "TAG_OPEN",
            "TAG_CLOSE"
        ])

        const styledClass = buildArtifacts[0] as BuildArtifactStyledClass
        expect(styledClass.styles).toEqual([
            { name: "display", value: "flex", pseudoSelector: null, mediaQuery: null },
            { name: "justify-content", value: "center", pseudoSelector: null, mediaQuery: null },
            { name: "color", value: "red", pseudoSelector: ":hover", mediaQuery: null },
            { name: "background-color", value: "#fafafa", pseudoSelector: ":focus", mediaQuery: null },
            { name: "font-size", value: "12px", pseudoSelector: null, mediaQuery: "@media (max-width: 600px)" }
        ])

        const tagOpen = buildArtifacts[1] as BuildArtifactTagOpen
        expect(tagOpen.tagName).toBe("div")
        expect(tagOpen.isVoid).toBe(false)
        expect(tagOpen.attributes).toEqual([
            { name: "id", value: "demo" },
            { name: "data-role", value: "content" },
            { name: "class", value: styledClass.className }
        ])

        const tagClose = buildArtifacts[2]
        expect(tagClose).toEqual({
            buildArtifactType: "TAG_CLOSE",
            tagName: "div"
        })
    })

    test("renders nested div tree", () => {
        const parent = new NodeElement("div").attributeAdd("id", "root")
            .styleAdd("padding", "8px")
            .styleAdd("margin", "4px", { pseudoSelector: ":first-child" })
        const childOne = new NodeElement("div").attributeAdd("data-child", "one")
            .styleAdd("color", "green")
            .styleAdd("font-weight", "500", { pseudoSelector: ":hover" })
        const childTwo = new NodeElement("div").attributeAdd("data-child", "two")
            .styleAdd("background-color", "#eee")
            .styleAdd("border-color", "#ccc", { pseudoSelector: ":focus" })

        childOne.childAdd(new NodeText("child-one"))
        childTwo
            .childAdd(new NodeText("child-two"))
            .childAdd(
                new NodeElement("div")
                    .attributeAdd("data-child", "nested")
                    .styleAdd("font-weight", "bold")
                    .childAdd(new NodeText("nested-child"))
            )

        parent
            .childAdd(childOne)
            .childAdd(childTwo)

        const buildArtifacts = Array.from(parent.build()) as BuildArtifact[]

        expect(buildArtifacts.map(a => a.buildArtifactType)).toEqual([
            "STYLED_CLASS",
            "TAG_OPEN",
            "STYLED_CLASS",
            "TAG_OPEN",
            "TEXT",
            "TAG_CLOSE",
            "STYLED_CLASS",
            "TAG_OPEN",
            "TEXT",
            "STYLED_CLASS",
            "TAG_OPEN",
            "TEXT",
            "TAG_CLOSE",
            "TAG_CLOSE",
            "TAG_CLOSE"
        ])
    })

    test("does not emit a styled class artifact when no styles are provided", () => {
        const node = new NodeElement("section")
            .attributeAdd("data-kind", "plain")
            .childAdd(new NodeText("content"))

        const buildArtifacts = Array.from(node.build()) as BuildArtifact[]

        expect(buildArtifacts).toEqual([
            {
                buildArtifactType: "TAG_OPEN",
                tagName: "section",
                isVoid: false,
                attributes: [
                    { name: "data-kind", value: "plain" }
                ]
            },
            {
                buildArtifactType: "TEXT",
                text: "content"
            },
            {
                buildArtifactType: "TAG_CLOSE",
                tagName: "section"
            }
        ])
    })

    test("renders void elements once and ignores children", () => {
        const img = new NodeElement("img")
            .attributeAdd("src", "/logo.png")
            .attributeAdd("alt", "Logo")
            .styleAdd("width", "128px")
            .childAdd(new NodeText("should-not-render"))

        const buildArtifacts = Array.from(img.build()) as BuildArtifact[]

        const styledClass = buildArtifacts[0] as BuildArtifactStyledClass
        expect(styledClass.styles).toEqual([
            { name: "width", value: "128px", pseudoSelector: null, mediaQuery: null }
        ])

        expect(buildArtifacts[1]).toEqual({
            buildArtifactType: "TAG_OPEN",
            tagName: "img",
            isVoid: true,
            attributes: [
                { name: "src", value: "/logo.png" },
                { name: "alt", value: "Logo" },
                { name: "class", value: styledClass.className }
            ]
        })
    })
})
