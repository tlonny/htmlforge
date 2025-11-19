import { NodeElement } from "@src/node/element"
import { HTMLNodeSignature } from "@src/html/node/signature"
import { HTMLBuildArtifactRender } from "@src/html/build-artifact/render"
import type { BuildArtifact } from "@src/type"
import { HTMLNodeDocType } from "@src/html/node/doctype"
import { NodeFragment } from "@src/node/fragment"

const DEFAULT_INDENT_COUNT = 4
const DEFAULT_SIGNATURE_DISPLAY = true

export class HTML {

    private readonly root : NodeFragment
    private readonly html : NodeElement
    private readonly indent : string

    readonly head : NodeElement
    readonly body : NodeElement

    constructor(params? : {
        indentCount?: number,
        signatureDisplay?: boolean
    }) {
        this.indent = " ".repeat(Math.max(params?.indentCount ?? DEFAULT_INDENT_COUNT, 0))
        this.head = new NodeElement("head")
            .childAdd(new NodeElement("style"))

        this.body = new NodeElement("body")

        this.html = new NodeElement("html")
            .childAdd(this.head)
            .childAdd(this.body)

        this.root = new NodeFragment()
            .childAdd(new HTMLNodeDocType())

        if (params?.signatureDisplay ?? DEFAULT_SIGNATURE_DISPLAY) {
            this.root.childAdd(new HTMLNodeSignature())
        }

        this.root.childAdd(this.html)
    }

    attributeAdd(name : string, value: string) {
        this.html.attributeAdd(name, value)
        return this
    }

    toString() {
        const buildArtifactBuffer : BuildArtifact[] = []
        const styledClassBuildArtifacts : BuildArtifact[] = []
        const seenStyledClasses = new Set<string>()
        const fragments : string[] = []

        let spliceIndex = -1
        for (const buildArtifact of this.root.build()) {
            if (buildArtifact.buildArtifactType === "STYLED_CLASS") {
                if (seenStyledClasses.has(buildArtifact.className)) {
                    continue
                }

                seenStyledClasses.add(buildArtifact.className)
                styledClassBuildArtifacts.push(buildArtifact)
            } else {
                buildArtifactBuffer.push(buildArtifact)
            }

            if (
                spliceIndex === -1 &&
                buildArtifact.buildArtifactType === "TAG_OPEN" &&
                buildArtifact.tagName === "style"
            ) {
                spliceIndex = buildArtifactBuffer.length
            }
        }

        buildArtifactBuffer.splice(spliceIndex, 0, ...styledClassBuildArtifacts)

        for (const buildArtifact of buildArtifactBuffer) {
            fragments.push(HTMLBuildArtifactRender(buildArtifact))
        }

        return fragments.join("\n")
    }

}
