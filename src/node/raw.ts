import type { INode, Artifact } from "@src/type"

export class NodeRaw implements INode {

    private readonly raw : string

    constructor(raw : string) {
        this.raw = raw
    }

    *build() : Iterable<Artifact> {
        yield {
            artifactType: "RAW",
            raw: this.raw
        }
    }
}
