import { NodeElement } from "@src/node/element"
import { DocumentNodeBody } from "@src/document/body"
import { DocumentNodeHead } from "@src/document/head"
import { DocumentNodeSignature } from "@src/document/signature"
import { DocumentArtifactRenderer } from "@src/document/artifact/renderer"

export class Document {

    private readonly html : NodeElement
    readonly head : DocumentNodeHead
    readonly body : DocumentNodeBody

    constructor() {
        this.head = new DocumentNodeHead()
        this.body = new DocumentNodeBody(this.head.styleRef)
        this.html = new NodeElement("html")
            .childAdd(new DocumentNodeSignature())
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
