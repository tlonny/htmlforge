import type { INode, INodeParent, Artifact, Attribute, Style, CSSPseudoSelector, CSSProperties } from "@src/type"

const VOID_ELEMENTS = new Set([
    "area", "base", "br", "col", "embed", "hr", "img", "input", "link",
    "meta", "param", "source", "track", "wbr"
])

const kebabCaseConvert = (value: string) =>
    value.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)

export class NodeElement implements INode, INodeParent {

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

    addStyle<T extends keyof CSSProperties>(
        name : T,
        value: Exclude<CSSProperties[T], undefined>,
        pseudoSelector?: CSSPseudoSelector
    ) {
        this.styles.push({
            name: kebabCaseConvert(name),
            value: String(value),
            pseudoSelector: pseudoSelector ?? null
        })
        return this
    }

    addAttribute(name : string, value: string) {
        this.attributes.push({ name, value })
        return this
    }

    addChild(node : INode) {
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
