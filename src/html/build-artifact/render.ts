import type { BuildArtifact, BuildArtifactRaw, BuildArtifactStyledClass, BuildArtifactTagClose, BuildArtifactTagOpen, BuildArtifactText, Style } from "@src/type"
import { groupBy } from "@src/util/group-by"
import { HTMLEscape } from "@src/util/html-escape"

const HTMLBuildArtifactStyledClassRender = (buildArtifact: BuildArtifactStyledClass): string => {
    const groupedStyles = groupBy(
        buildArtifact.styles,
        s => JSON.stringify([s.mediaQuery, s.pseudoSelector])
    )

    const fragments: string[] = []
    for (const styles of groupedStyles.values()) {
        const { mediaQuery, pseudoSelector } = styles[0] as Style
        if (mediaQuery) {
            fragments.push(`${mediaQuery} {`)
        }

        const selector = pseudoSelector
            ? `.${buildArtifact.className}${pseudoSelector}`
            : `.${buildArtifact.className}`

        fragments.push(`${selector} {`)

        for (const style of styles) {
            fragments.push(`${style.name}: ${style.value};`)
        }

        fragments.push("}")

        if (mediaQuery) {
            fragments.push("}")
        }
    }

    return fragments.join("")
}

const HTMLBuildArtifactTagOpenRender = (buildArtifact: BuildArtifactTagOpen): string => {
    const attrString = buildArtifact.attributes
        .map(({name, value}) => ` ${name}="${HTMLEscape(value)}"`)
        .join("")

    return `<${buildArtifact.tagName}${attrString}>`
}

const HTMLBuildArtifactTagCloseRender = (buildArtifact: BuildArtifactTagClose): string => {
    return `</${buildArtifact.tagName}>`
}

const HTMLBuildArtifactTextRender = (buildArtifact: BuildArtifactText): string => {
    return HTMLEscape(buildArtifact.text)
}

const HTMLBuildArtifactRawRender = (buildArtifact: BuildArtifactRaw): string => {
    return buildArtifact.raw
}

export const HTMLBuildArtifactRender = (buildArtifact: BuildArtifact): string => {
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
