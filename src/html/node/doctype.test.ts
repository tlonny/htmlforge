import { describe, expect, test } from "bun:test"

import { HTMLNodeDocType, RAW } from "@src/html/node/doctype"

describe("HTMLNodeDocType", () => {
    test("emits the HTML doctype as a RAW build artifact", () => {
        const node = new HTMLNodeDocType()
        const buildArtifacts = Array.from(node.build())

        expect(buildArtifacts).toEqual([{
            buildArtifactType: "RAW",
            raw: RAW
        }])
    })
})
