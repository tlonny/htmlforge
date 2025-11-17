import type { INode, Artifact } from "@src/type"

export class NodeSignature implements INode {

    *build() : Iterable<Artifact> {
        yield {
            artifactType: "SIGNATURE",
        }
    }
}
