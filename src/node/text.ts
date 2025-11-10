import type { INode, Artifact } from "@src/type"

export class NodeText implements INode {

    private readonly text : string

    constructor(text : string) {
        this.text = text
    }

    *build() : Iterable<Artifact> {
        yield {
            artifactType: "TEXT",
            text: this.text
        }
    }
}
