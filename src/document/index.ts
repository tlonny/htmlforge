import { DocumentArtifactRenderer } from "@src/document/artifact/renderer"
import { NodeElement } from "@src/node/element"

export class Document {

    private readonly html : NodeElement
    readonly head : NodeElement
    readonly body : NodeElement

    constructor() {
        this.head = new NodeElement("head")
        this.body = new NodeElement("body")

        this.html = new NodeElement("html")
            .addChild(this.head)
            .addChild(this.body)
    }

    addAttribute(name : string, value: string) {
        this.html.addAttribute(name, value)
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
