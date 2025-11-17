import { describe, expect, test } from "bun:test"

import { NodeText } from "@src/node/text"
import type { BuildArtifactText } from "@src/type"

describe("NodeText", () => {

    test("emits a text fragment", () => {
        const node = new NodeText("text")
        const buildArtifacts = Array.from(node.build()) as BuildArtifactText[]

        expect(buildArtifacts).toEqual([{
            buildArtifactType: "TEXT",
            text: "text"
        }])
    })
})
