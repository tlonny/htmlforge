export type PseudoSelector = `:${string}`

export type MediaQuery = `@media${string}`
export type ContainerQuery = `@container${string}`

export type Style = {
    name: string,
    value: string,
    pseudoSelector: PseudoSelector | null,
    mediaQuery: MediaQuery | null
    containerQuery: ContainerQuery | null
}

export type Attribute = {
    name: string
    value: string
}

export type ArtifactTagOpen = {
    artifactType: "TAG_OPEN",
    tagName: string,
    attributes: Attribute[]
    styles: Style[]
}

export type ArtifactTagClose = {
    artifactType: "TAG_CLOSE",
    tagName: string
}

export type ArtifactText = {
    artifactType: "TEXT"
    text: string
}

export type ArtifactRaw = {
    artifactType: "RAW"
    raw: string
}

export type Artifact =
    | ArtifactTagOpen
    | ArtifactTagClose
    | ArtifactText
    | ArtifactRaw

export interface INode {
    build(): Iterable<Artifact>
}
