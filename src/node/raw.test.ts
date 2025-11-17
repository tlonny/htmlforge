import { NodeRaw } from "@src/node/raw"
import type { BuildArtifactRaw } from "@src/type"
import { describe, expect, test } from "bun:test"

describe("NodeRaw", () => {
    test("emits a RAW buildArtifact", () => {
        const node = new NodeRaw("raw")
        const buildArtifacts = Array.from(node.build()) as BuildArtifactRaw[]

        expect(buildArtifacts).toEqual([{
            buildArtifactType: "RAW",
            raw: "raw"
        }])
    })
})
