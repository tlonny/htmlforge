import { describe, expect, test } from "bun:test"

import type { Artifact } from "@src/type"
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

        const artifacts = Array.from(node.build()) as Artifact[]

        expect(artifacts).toEqual([
            {
                artifactType: "TAG_OPEN",
                tagName: "div",
                attributes: [
                    { name: "id", value: "demo" },
                    { name: "data-role", value: "content" }
                ],
                styles: [
                    { name: "display", value: "flex", pseudoSelector: null, mediaQuery: null },
                    { name: "justify-content", value: "center", pseudoSelector: null, mediaQuery: null },
                    { name: "color", value: "red", pseudoSelector: ":hover", mediaQuery: null },
                    { name: "background-color", value: "#fafafa", pseudoSelector: ":focus", mediaQuery: null },
                    { name: "font-size", value: "12px", pseudoSelector: null, mediaQuery: "@media (max-width: 600px)" }
                ]
            },
            {
                artifactType: "TAG_CLOSE",
                tagName: "div"
            }
        ])
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

        const artifacts = Array.from(parent.build()) as Artifact[]

        expect(artifacts).toEqual([
            {
                artifactType: "TAG_OPEN",
                tagName: "div",
                attributes: [{ name: "id", value: "root" }],
                styles: [
                    { name: "padding", value: "8px", pseudoSelector: null, mediaQuery: null },
                    { name: "margin", value: "4px", pseudoSelector: ":first-child", mediaQuery: null }
                ]
            },
            {
                artifactType: "TAG_OPEN",
                tagName: "div",
                attributes: [{ name: "data-child", value: "one" }],
                styles: [
                    { name: "color", value: "green", pseudoSelector: null, mediaQuery: null },
                    { name: "font-weight", value: "500", pseudoSelector: ":hover", mediaQuery: null }
                ]
            },
            {
                artifactType: "TEXT",
                text: "child-one"
            },
            {
                artifactType: "TAG_CLOSE",
                tagName: "div"
            },
            {
                artifactType: "TAG_OPEN",
                tagName: "div",
                attributes: [{ name: "data-child", value: "two" }],
                styles: [
                    { name: "background-color", value: "#eee", pseudoSelector: null, mediaQuery: null },
                    { name: "border-color", value: "#ccc", pseudoSelector: ":focus", mediaQuery: null }
                ]
            },
            {
                artifactType: "TEXT",
                text: "child-two"
            },
            {
                artifactType: "TAG_OPEN",
                tagName: "div",
                attributes: [{ name: "data-child", value: "nested" }],
                styles: [
                    { name: "font-weight", value: "bold", pseudoSelector: null, mediaQuery: null }
                ]
            },
            {
                artifactType: "TEXT",
                text: "nested-child"
            },
            {
                artifactType: "TAG_CLOSE",
                tagName: "div"
            },
            {
                artifactType: "TAG_CLOSE",
                tagName: "div"
            },
            {
                artifactType: "TAG_CLOSE",
                tagName: "div"
            }
        ])
    })

    test("renders void elements once and ignores children", () => {
        const img = new NodeElement("img")
            .attributeAdd("src", "/logo.png")
            .attributeAdd("alt", "Logo")
            .styleAdd("width", "128px")
            .childAdd(new NodeText("should-not-render"))

        const artifacts = Array.from(img.build()) as Artifact[]

        expect(artifacts).toEqual([
            {
                artifactType: "TAG_OPEN",
                tagName: "img",
                attributes: [
                    { name: "src", value: "/logo.png" },
                    { name: "alt", value: "Logo" }
                ],
                styles: [
                    { name: "width", value: "128px", pseudoSelector: null, mediaQuery: null }
                ]
            }
        ])
    })
})
