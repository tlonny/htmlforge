import type { INode, Artifact, Attribute, MediaQuery, PseudoSelector, Style } from "@src/type"

const VOID_ELEMENTS = new Set([
    "area", "base", "br", "col", "embed", "hr", "img", "input", "link",
    "meta", "param", "source", "track", "wbr"
])

export class NodeElement implements INode {

    private readonly tagName : string
    private readonly attributes: Attribute[]
    private readonly styles: Style[]

    readonly children: INode[]

    constructor(tagName: string) {
        this.tagName = tagName.toLowerCase()
        this.attributes = []
        this.styles = []
        this.children = []
    }

    styleAdd(
        name: string,
        value: string,
        options?: {
            mediaQuery?: MediaQuery,
            pseudoSelector?: PseudoSelector,
        }
    ) {
        this.styles.push({
            name: name,
            value: value,
            pseudoSelector: options?.pseudoSelector ?? null,
            mediaQuery: options?.mediaQuery ?? null
        })
        return this
    }

    attributeAdd(name : string, value: string) {
        this.attributes.push({ name, value })
        return this
    }

    childAdd(node : INode) {
        this.children.push(node)
        return this
    }

    *build(): Iterable<Artifact> {
        yield {
            artifactType: "TAG_OPEN",
            tagName: this.tagName,
            attributes: this.attributes,
            styles: this.styles
        }

        if (VOID_ELEMENTS.has(this.tagName)) {
            return
        }

        for (const child of this.children) {
            yield* child.build()
        }

        yield {
            artifactType: "TAG_CLOSE",
            tagName: this.tagName
        }
    }

}
