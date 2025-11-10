import type { Artifact, ArtifactTagOpen } from "@src/type"
import { digest } from "@src/util/digest"
import { groupBy } from "@src/util/group-by"
import { HTMLEscape } from "@src/util/html-escape"

export class DocumentArtifactRenderer {

    private readonly seenSelectors : Set<string>

    constructor() {
        this.seenSelectors = new Set()
    }

    private artifactTagOpenRender(artifact : ArtifactTagOpen) {
        const renderFragments : string[] = []

        const attributes = [...artifact.attributes]

        if (artifact.styles.length > 0) {
            const groupedStyles = groupBy(artifact.styles, s => s.pseudoSelector)
            const classNames: string[] = []
            for (const [pseudoSelector, styles] of groupedStyles.entries()) {
                const joinedStyles = styles.map((s) => `${s.name}: ${s.value};`).join("")
                const className = `cls-${digest(joinedStyles, String(pseudoSelector))}`
                const selector = pseudoSelector ? `.${className}${pseudoSelector}` : `.${className}`
                if (!this.seenSelectors.has(selector)) {
                    this.seenSelectors.add(selector)
                    renderFragments.push(`<style>${selector} {${joinedStyles}}</style>`)
                }
                classNames.push(className)
            }
            attributes.push({ name: "class", value: classNames.join(" ") })
        }
        const attrString = attributes
            .map(({name, value}) => ` ${name}="${HTMLEscape(value)}"`)
            .join("")

        renderFragments.push(`<${artifact.tagName}${attrString}>`)
        return renderFragments.join("")
    }

    render(artifact: Artifact) {
        if (artifact.artifactType === "TAG_OPEN") {
            return this.artifactTagOpenRender(artifact)
        } else if (artifact.artifactType === "TAG_CLOSE") {
            return `</${artifact.tagName}>`
        } else if (artifact.artifactType === "TEXT") {
            return HTMLEscape(artifact.text)
        } else if (artifact.artifactType === "RAW") {
            return artifact.raw
        } else {
            artifact satisfies never
            throw new Error("Invariant: Invalid artifact type")
        }
    }

}
