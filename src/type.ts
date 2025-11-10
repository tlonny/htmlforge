export type {
    Properties as CSSProperties,
    Pseudos as CSSPseudoSelector
} from "csstype"

export type Style = {
    name: string,
    value: string,
    pseudoSelector: string | null
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

export interface INodeParent {
    addChild(child : INode): this
}
