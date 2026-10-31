import { describe, expect, test } from "bun:test"

import { css } from "@src/css"
import type { Artifact } from "@src/artifact"
import { Element, Fragment, Text } from "@src/node"

describe("Fragment", () => {

    test("renders nested div tree", () => {
        const parent = new Fragment()
        const childOne = new Element("div").attribute("data-child", "one")
            .css(cls => css`.${cls} { color: green; }.${cls}:hover { font-weight: 500; }`)
        const childTwo = new Element("div").attribute("data-child", "two")
            .css(cls => css`.${cls} { background-color: #eee; }.${cls}:focus { border-color: #ccc; }`)

        childOne.child(new Text("child-one"))
        childTwo
            .child(new Text("child-two"))
            .child(
                new Element("div")
                    .attribute("data-child", "nested")
                    .css(cls => css`.${cls} { font-weight: bold; }`)
                    .child(new Text("nested-child"))
            )

        parent
            .child(childOne)
            .child(childTwo)

        const buildArtifacts = Array.from(parent.build()) as Artifact[]

        expect(buildArtifacts.map(a => a.buildArtifactType)).toEqual([
            "CSS_CHUNK",
            "TAG_OPEN",
            "TEXT",
            "TAG_CLOSE",
            "CSS_CHUNK",
            "TAG_OPEN",
            "TEXT",
            "CSS_CHUNK",
            "TAG_OPEN",
            "TEXT",
            "TAG_CLOSE",
            "TAG_CLOSE",
        ])
    })
})
