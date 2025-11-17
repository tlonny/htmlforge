import type { INode, BuildArtifact } from "@src/type"

export class NodeFragment implements INode {

    readonly children: INode[]

    constructor() {
        this.children = []
    }

    childAdd(node : INode) {
        this.children.push(node)
        return this
    }

    *build(): Iterable<BuildArtifact> {
        for (const child of this.children) {
            yield* child.build()
        }
    }
}
