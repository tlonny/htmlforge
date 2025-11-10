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
            .addStyle("justifyContent", "center")
            .addStyle("color", "red", ":hover")
            .addStyle("backgroundColor", "#fafafa", ":focus")

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
                    { name: "display", value: "flex", pseudoSelector: null },
                    { name: "justify-content", value: "center", pseudoSelector: null },
                    { name: "color", value: "red", pseudoSelector: ":hover" },
                    { name: "background-color", value: "#fafafa", pseudoSelector: ":focus" }
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
            .addStyle("margin", "4px", ":first-child")
        const childOne = new NodeElement("div").addAttribute("data-child", "one")
            .addStyle("color", "green")
            .addStyle("fontWeight", "500", ":hover")
        const childTwo = new NodeElement("div").addAttribute("data-child", "two")
            .addStyle("backgroundColor", "#eee")
            .addStyle("borderColor", "#ccc", ":focus")

        childOne.addChild(new NodeText("child-one"))
        childTwo
            .addChild(new NodeText("child-two"))
            .addChild(
                new NodeElement("div")
                    .addAttribute("data-child", "nested")
                    .addStyle("fontWeight", "bold")
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
                    { name: "padding", value: "8px", pseudoSelector: null },
                    { name: "margin", value: "4px", pseudoSelector: ":first-child" }
                ]
            },
            {
                artifactType: "TAG_OPEN",
                tagName: "div",
                attributes: [{ name: "data-child", value: "one" }],
                styles: [
                    { name: "color", value: "green", pseudoSelector: null },
                    { name: "font-weight", value: "500", pseudoSelector: ":hover" }
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
                    { name: "background-color", value: "#eee", pseudoSelector: null },
                    { name: "border-color", value: "#ccc", pseudoSelector: ":focus" }
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
                    { name: "font-weight", value: "bold", pseudoSelector: null }
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
                    { name: "width", value: "128px", pseudoSelector: null }
                ]
            }
        ])
    })
})
