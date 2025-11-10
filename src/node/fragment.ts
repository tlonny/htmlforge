import type { INode, Artifact } from "@src/type"

export class NodeFragment implements INode {

    readonly children: INode[]

    constructor() {
        this.children = []
    }

    addChild(node : INode) {
        this.children.push(node)
        return this
    }

    *build(): Iterable<Artifact> {
        for (const child of this.children) {
            yield* child.build()
        }
    }
}
