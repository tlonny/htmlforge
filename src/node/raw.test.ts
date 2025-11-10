import { NodeRaw } from "@src/node/raw"
import type { ArtifactRaw } from "@src/type"
import { describe, expect, test } from "bun:test"

describe("NodeRaw", () => {
    test("emits a RAW artifact", () => {
        const node = new NodeRaw("raw")
        const artifacts = Array.from(node.build()) as ArtifactRaw[]

        expect(artifacts).toEqual([{
            artifactType: "RAW",
            raw: "raw"
        }])
    })
})
