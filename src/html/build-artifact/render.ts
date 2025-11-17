import type { BuildArtifact, BuildArtifactRaw, BuildArtifactStyledClass, BuildArtifactTagClose, BuildArtifactTagOpen, BuildArtifactText, RenderFragment, Style } from "@src/type"
import { groupBy } from "@src/util/group-by"
import { HTMLEscape } from "@src/util/html-escape"

const HTMLBuildArtifactStyledClassRender = (buildArtifact: BuildArtifactStyledClass): RenderFragment[] => {
    const groupedStyles = groupBy(
        buildArtifact.styles,
        s => JSON.stringify([s.mediaQuery, s.pseudoSelector])
    )

    const fragments: RenderFragment[] = []
    for (const styles of groupedStyles.values()) {
        const { mediaQuery, pseudoSelector } = styles[0] as Style
        if (mediaQuery) {
            fragments.push({
                fragment: `${mediaQuery} {`,
                indentAction: "OPEN"
            })
        }

        const selector = pseudoSelector
            ? `.${buildArtifact.className}${pseudoSelector}`
            : `.${buildArtifact.className}`

        fragments.push({
            fragment: `${selector} {`,
            indentAction: "OPEN"
        })

        for (const style of styles) {
            fragments.push({
                fragment: `${style.name}: ${style.value};`,
                indentAction: "NONE"
            })
        }

        fragments.push({
            fragment: "}",
            indentAction: "CLOSE"
        })

        if (mediaQuery) {
            fragments.push({
                fragment: "}",
                indentAction: "CLOSE"
            })
        }
    }

    return fragments
}

const HTMLBuildArtifactTagOpenRender = (buildArtifact: BuildArtifactTagOpen): RenderFragment[] => {
    const attrString = buildArtifact.attributes
        .map(({name, value}) => ` ${name}="${HTMLEscape(value)}"`)
        .join("")

    return [{
        fragment: `<${buildArtifact.tagName}${attrString}>`,
        indentAction: buildArtifact.isVoid ? "NONE" : "OPEN"
    }]
}

const HTMLBuildArtifactTagCloseRender = (buildArtifact: BuildArtifactTagClose): RenderFragment[] => [{
    fragment: `</${buildArtifact.tagName}>`,
    indentAction: "CLOSE"
}]

const HTMLBuildArtifactTextRender = (buildArtifact: BuildArtifactText): RenderFragment[] => [{
    fragment: HTMLEscape(buildArtifact.text),
    indentAction: "NONE"
}]

const HTMLBuildArtifactRawRender = (buildArtifact: BuildArtifactRaw): RenderFragment[] => [{
    fragment: buildArtifact.raw,
    indentAction: "NONE"
}]

export const HTMLBuildArtifactRender = (buildArtifact: BuildArtifact): RenderFragment[] => {
    if (buildArtifact.buildArtifactType === "TAG_OPEN") {
        return HTMLBuildArtifactTagOpenRender(buildArtifact)
    } else if (buildArtifact.buildArtifactType === "TAG_CLOSE") {
        return HTMLBuildArtifactTagCloseRender(buildArtifact)
    } else if (buildArtifact.buildArtifactType === "TEXT") {
        return HTMLBuildArtifactTextRender(buildArtifact)
    } else if (buildArtifact.buildArtifactType === "RAW") {
        return HTMLBuildArtifactRawRender(buildArtifact)
    } else if (buildArtifact.buildArtifactType === "STYLED_CLASS") {
        return HTMLBuildArtifactStyledClassRender(buildArtifact)
    } else {
        buildArtifact satisfies never
        throw new Error("Invariant: Invalid buildArtifact type")
    }
}
