import { NodeElement } from "@src/node/element"
import type { Artifact, INode, MediaQuery, PseudoSelector } from "@src/type"

export class DocumentNodeBody implements INode {

    private readonly node : NodeElement
    private readonly styleRef: NodeElement

    constructor(styleRef: NodeElement) {
        this.node = new NodeElement("body")
        this.styleRef = styleRef
    }

    styleAdd(
        name: string,
        value: string,
        options?: {
            mediaQuery?: MediaQuery,
            pseudoSelector?: PseudoSelector,
        }
    ) {
        this.styleRef.styleAdd(name, value, options)
        return this
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
