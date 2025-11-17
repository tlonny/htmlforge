import type { INode, Artifact } from "@src/type"

const SIGNATURE_LINE = "<!-- Created by htmlforge (https://github.com/tlonny/htmlforge) -->"

export class DocumentNodeSignature implements INode {

    *build() : Iterable<Artifact> {
        yield {
            artifactType: "RAW",
            raw: SIGNATURE_LINE
        }
    }
}
