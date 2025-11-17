import type { INode, BuildArtifact } from "@src/type"

export class NodeText implements INode {

    private readonly text : string

    constructor(text : string) {
        this.text = text
    }

    *build() : Iterable<BuildArtifact> {
        yield {
            buildArtifactType: "TEXT",
            text: this.text
        }
    }
}
