import { describe, expect, test } from "bun:test"

import { NodeText } from "@src/node/text"
import type { ArtifactText } from "@src/type"

describe("NodeText", () => {

    test("emits a text fragment", () => {
        const node = new NodeText("text")
        const artifacts = Array.from(node.build()) as ArtifactText[]

        expect(artifacts).toEqual([{
            artifactType: "TEXT",
            text: "text"
        }])
    })
})
