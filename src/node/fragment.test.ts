import { describe, expect, test } from "bun:test"

import type { BuildArtifact } from "@src/type"
import { NodeElement } from "@src/node/element"
import { NodeText } from "@src/node/text"
import { NodeFragment } from "@src/node/fragment"

describe("NodeFragment", () => {

    test("renders nested div tree", () => {
        const parent = new NodeFragment()
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
        ])
    })
})
