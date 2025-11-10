import { describe, expect, test } from "bun:test"

import type { Artifact } from "@src/type"
import { NodeElement } from "@src/node/element"
import { NodeText } from "@src/node/text"
import { NodeFragment } from "@src/node/fragment"

describe("NodeFragment", () => {

    test("renders nested div tree", () => {
        const parent = new NodeFragment()
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
        ])
    })
})
