import type { Artifact } from "@src/artifact"
import { PLACEHOLDER } from "@src/css"
import type { Chunk } from "@src/css"
import type { Buildable } from "./buildable"

export type Attribute = {
    name: string
    value: string
}

const VOID_ELEMENTS = new Set([
    "area", "base", "br", "col", "embed", "hr", "img", "input", "link",
    "meta", "param", "source", "track", "wbr"
])

export class Element implements Buildable {

    private readonly tagName : string
    private readonly attributes: Attribute[]
    private readonly cssFragments: Chunk[]
    private readonly children: Buildable[]

    constructor(tagName: string) {
        this.tagName = tagName.toLowerCase()
        this.attributes = []
        this.cssFragments = []
        this.children = []
    }

    css(build: (cls: typeof PLACEHOLDER) => Chunk) {
        this.cssFragments.push(build(PLACEHOLDER))
        return this
    }

    attribute(name : string, value: string) {
        this.attributes.push({ name, value })
        return this
    }

    child(node : Buildable) {
        this.children.push(node)
        return this
    }

    *build(): Iterable<Artifact> {
        const attributes = [...this.attributes]
        const isVoid = VOID_ELEMENTS.has(this.tagName)

        const seenHashes = new Set<string>()
        for (const chunk of this.cssFragments) {
            if (seenHashes.has(chunk.hash)) {
                continue
            }
            seenHashes.add(chunk.hash)
            attributes.push({ name: "class", value: chunk.hash })
            yield {
                buildArtifactType: "CSS_CHUNK",
                ...chunk
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
