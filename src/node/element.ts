import { createHash } from "crypto"
import type { INode, BuildArtifact, Attribute, MediaQuery, PseudoSelector, Style } from "@src/type"

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
        const pseudoSelector = options?.pseudoSelector ?? null
        const mediaQuery = options?.mediaQuery ?? null
        this.styles.push({ name, value, pseudoSelector, mediaQuery })
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

    *build(): Iterable<BuildArtifact> {
        const attributes = [...this.attributes]
        const isVoid = VOID_ELEMENTS.has(this.tagName)

        if (this.styles.length > 0) {
            const hash = createHash("sha256")
            for (const style of this.styles) {
                hash.update(JSON.stringify(style))
            }
            const digest = hash.digest()
                .subarray(0, 8)
                .toString("base64url")

            const className = `f${digest}`
            attributes.push({ name: "class", value: className })

            yield {
                buildArtifactType: "STYLED_CLASS",
                styles: [...this.styles],
                className: className
            }
        }


        yield {
            buildArtifactType: "TAG_OPEN",
            tagName: this.tagName,
            isVoid: isVoid,
            attributes: attributes,
        }

        if (isVoid) {
            return
        }

        for (const child of this.children) {
            yield* child.build()
        }

        yield {
            buildArtifactType: "TAG_CLOSE",
            tagName: this.tagName
        }
    }

}
