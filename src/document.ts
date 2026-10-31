import { render } from "@src/artifact"
import type { Artifact } from "@src/artifact"
import { Doctype, Element, Fragment, Signature } from "@src/node"

const DEFAULT_SIGNATURE_DISPLAY = true

export class Document {

    private readonly root : Fragment
    private readonly html : Element

    readonly head : Element
    readonly body : Element

    constructor(params? : {
        displaySignature?: boolean
    }) {
        this.head = new Element("head")

        this.body = new Element("body")

        this.html = new Element("html")
            .child(this.head)
            .child(this.body)

        this.root = new Fragment()
            .child(new Doctype())

        if (params?.displaySignature ?? DEFAULT_SIGNATURE_DISPLAY) {
            this.root.child(new Signature())
        }

        this.root.child(this.html)
    }

    attribute(name : string, value: string) {
        this.html.attribute(name, value)
        return this
    }

    toString() {
        const artifactBuffer : Artifact[] = []
        const chunkArtifacts : Artifact[] = []
        const seenChunks = new Set<string>()
        const fragments : string[] = []

        let spliceIndex = -1
        for (const artifact of this.root.build()) {
            if (artifact.buildArtifactType === "CSS_CHUNK") {
                if (seenChunks.has(artifact.hash)) {
                    continue
                }

                seenChunks.add(artifact.hash)
                chunkArtifacts.push(artifact)
            } else {
                artifactBuffer.push(artifact)
            }

            if (
                spliceIndex === -1 &&
                artifact.buildArtifactType === "TAG_OPEN" &&
                artifact.tagName === "head"
            ) {
                spliceIndex = artifactBuffer.length
            }
        }

        artifactBuffer.splice(spliceIndex, 0, ...chunkArtifacts)

        for (const artifact of artifactBuffer) {
            render(artifact, fragments)
        }

        return fragments.join("")
    }

}
