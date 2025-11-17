import type { Artifact, ArtifactTagOpen, Style } from "@src/type"
import { digest } from "@src/util/digest"
import { groupBy } from "@src/util/group-by"
import { HTMLEscape } from "@src/util/html-escape"

export class DocumentArtifactRenderer {

    private readonly digests : Set<string>

    constructor() {
        this.digests = new Set()
    }

    private artifactTagOpenRender(artifact : ArtifactTagOpen) {
        const renderFragments : string[] = []

        const attributes = [...artifact.attributes]

        if (artifact.styles.length > 0) {
            const groupedStyles = groupBy(
                artifact.styles,
                s => JSON.stringify([s.mediaQuery, s.pseudoSelector])
            )
            const classNames: string[] = []
            for (const styles of groupedStyles.values()) {
                const style = styles[0] as Style

                const joinedStyles = styles.map((s) => `${s.name}: ${s.value};`).join("")
                const digestStr = digest(JSON.stringify([
                    style.mediaQuery,
                    style.pseudoSelector,
                    joinedStyles,
                ]))

                const className = `f${digestStr}`
                if (!this.digests.has(digestStr)) {
                    this.digests.add(digestStr)
                    const selector = style.pseudoSelector
                        ? `.${className}${style.pseudoSelector}`
                        : `.${className}`

                    const wrappedStyle = style.mediaQuery
                        ? `${style.mediaQuery} {${selector} {${joinedStyles}}}`
                        : `${selector} {${joinedStyles}}`
                    renderFragments.push(`<style>${wrappedStyle}</style>`)
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
