export interface INode {
    build(): Iterable<BuildArtifact>
}

export type PseudoSelector = `:${string}`

export type MediaQuery = `@media${string}`

export type Style = {
    name: string,
    value: string,
    pseudoSelector: PseudoSelector | null,
    mediaQuery: MediaQuery | null
}

export type Attribute = {
    name: string
    value: string
}

export type BuildArtifactTagOpen = {
    buildArtifactType: "TAG_OPEN",
    tagName: string,
    isVoid: boolean
    attributes: Attribute[]
}

export type BuildArtifactTagClose = {
    buildArtifactType: "TAG_CLOSE",
    tagName: string
}

export type BuildArtifactText = {
    buildArtifactType: "TEXT"
    text: string
}

export type BuildArtifactRaw = {
    buildArtifactType: "RAW"
    raw: string
}

export type BuildArtifactStyledClass = {
    buildArtifactType: "STYLED_CLASS",
    styles: Style[]
    className: string
}

export type BuildArtifact =
    | BuildArtifactTagOpen
    | BuildArtifactTagClose
    | BuildArtifactText
    | BuildArtifactRaw
    | BuildArtifactStyledClass

export type RenderFragment = {
    fragment: string
    indentAction: "OPEN" | "CLOSE" | "NONE"
}
