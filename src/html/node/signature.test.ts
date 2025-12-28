import { describe, expect, test } from "bun:test"

import { HTMLNodeSignature, RAW } from "@src/html/node/signature"

describe("HTMLNodeSignature", () => {
    test("emits the signature notice as a RAW build artifact", () => {
        const node = new HTMLNodeSignature()
        const buildArtifacts = Array.from(node.build())

        expect(buildArtifacts).toEqual([{
            buildArtifactType: "RAW",
            raw: RAW
        }])
    })
})
