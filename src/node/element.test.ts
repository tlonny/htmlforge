import { describe, expect, test } from "bun:test"

import type { Artifact } from "@src/type"
import { NodeElement } from "@src/node/element"
import { NodeText } from "@src/node/text"

describe("NodeElement", () => {

    test("renders div with attributes and CSS rules", () => {
        const node = new NodeElement("div")
            .addAttribute("id", "demo")
            .addAttribute("data-role", "content")
            .addStyle("display", "flex")
            .addStyle("justify-content", "center")
            .addStyle("color", "red", { pseudoSelector: ":hover" })
            .addStyle("background-color", "#fafafa", { pseudoSelector: ":focus" })
            .addStyle("font-size", "12px", { mediaQuery: "@media (max-width: 600px)" })

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
                    { name: "display", value: "flex", pseudoSelector: null, mediaQuery: null, containerQuery: null },
                    { name: "justify-content", value: "center", pseudoSelector: null, mediaQuery: null, containerQuery: null },
                    { name: "color", value: "red", pseudoSelector: ":hover", mediaQuery: null, containerQuery: null },
                    { name: "background-color", value: "#fafafa", pseudoSelector: ":focus", mediaQuery: null, containerQuery: null },
                    { name: "font-size", value: "12px", pseudoSelector: null, mediaQuery: "@media (max-width: 600px)", containerQuery: null }
                ]
            },
            {
                artifactType: "TAG_CLOSE",
                tagName: "div"
            }
        ])
    })

    test("renders nested div tree", () => {
        const parent = new NodeElement("div").addAttribute("id", "root")
            .addStyle("padding", "8px")
            .addStyle("margin", "4px", { pseudoSelector: ":first-child" })
        const childOne = new NodeElement("div").addAttribute("data-child", "one")
            .addStyle("color", "green")
            .addStyle("font-weight", "500", { pseudoSelector: ":hover" })
        const childTwo = new NodeElement("div").addAttribute("data-child", "two")
            .addStyle("background-color", "#eee")
            .addStyle("border-color", "#ccc", { pseudoSelector: ":focus" })

        childOne.addChild(new NodeText("child-one"))
        childTwo
            .addChild(new NodeText("child-two"))
            .addChild(
                new NodeElement("div")
                    .addAttribute("data-child", "nested")
                    .addStyle("font-weight", "bold")
                    .addChild(new NodeText("nested-child"))
            )

        parent
            .addChild(childOne)
            .addChild(childTwo)

        const artifacts = Array.from(parent.build()) as Artifact[]

        expect(artifacts).toEqual([
            {
                artifactType: "TAG_OPEN",
                tagName: "div",
                attributes: [{ name: "id", value: "root" }],
                styles: [
                    { name: "padding", value: "8px", pseudoSelector: null, mediaQuery: null, containerQuery: null },
                    { name: "margin", value: "4px", pseudoSelector: ":first-child", mediaQuery: null, containerQuery: null }
                ]
            },
            {
                artifactType: "TAG_OPEN",
                tagName: "div",
                attributes: [{ name: "data-child", value: "one" }],
                styles: [
                    { name: "color", value: "green", pseudoSelector: null, mediaQuery: null, containerQuery: null },
                    { name: "font-weight", value: "500", pseudoSelector: ":hover", mediaQuery: null, containerQuery: null }
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
                    { name: "background-color", value: "#eee", pseudoSelector: null, mediaQuery: null, containerQuery: null },
                    { name: "border-color", value: "#ccc", pseudoSelector: ":focus", mediaQuery: null, containerQuery: null }
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
                    { name: "font-weight", value: "bold", pseudoSelector: null, mediaQuery: null, containerQuery: null }
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
            .addAttribute("src", "/logo.png")
            .addAttribute("alt", "Logo")
            .addStyle("width", "128px")
            .addChild(new NodeText("should-not-render"))

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
                    { name: "width", value: "128px", pseudoSelector: null, mediaQuery: null, containerQuery: null }
                ]
            }
        ])
    })
})
