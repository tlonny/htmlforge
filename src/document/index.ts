import { DocumentArtifactRenderer } from "@src/document/artifact/renderer"
import { NodeSignature } from "@src/node/signature"
import { NodeElement } from "@src/node/element"

export class Document {

    private readonly html : NodeElement
    readonly head : NodeElement
    readonly body : NodeElement

    constructor() {
        this.head = new NodeElement("head")
        this.body = new NodeElement("body")

        this.html = new NodeElement("html")
            .childAdd(new NodeSignature())
            .childAdd(this.head)
            .childAdd(this.body)
    }

    attributeAdd(name : string, value: string) {
        this.html.attributeAdd(name, value)
        return this
    }

    toString() {
        const fragments : string[] = [
            "<!DOCTYPE html>"
        ]

        const renderer = new DocumentArtifactRenderer()
        for (const artifact of this.html.build()) {
            fragments.push(renderer.render(artifact))
        }

        return fragments.join("")
    }

}
