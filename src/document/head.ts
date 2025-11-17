import { NodeElement } from "@src/node/element"
import type { Artifact, INode } from "@src/type"

export class DocumentNodeHead implements INode {

    private readonly node : NodeElement
    readonly styleRef: NodeElement

    constructor() {
        this.styleRef = new NodeElement("meta")
        this.node = new NodeElement("head")
            .childAdd(this.styleRef)
    }

    attributeAdd(name : string, value: string) {
        this.node.attributeAdd(name, value)
        return this
    }

    childAdd(node : INode) {
        this.node.childAdd(node)
        return this
    }

    build(): Iterable<Artifact> {
        return this.node.build()
    }

}
