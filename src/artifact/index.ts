import * as raw from "./raw"
import * as chunk from "./chunk"
import * as tagClose from "./tag-close"
import * as tagOpen from "./tag-open"
import * as text from "./text"

export type { Raw } from "./raw"
export type { Chunk } from "./chunk"
export type { TagClose } from "./tag-close"
export type { TagOpen } from "./tag-open"
export type { Text } from "./text"

export type Artifact =
    | tagOpen.TagOpen
    | tagClose.TagClose
    | text.Text
    | raw.Raw
    | chunk.Chunk

export const render = (artifact: Artifact, fragments: string[]): void => {
    if (artifact.buildArtifactType === "TAG_OPEN") {
        tagOpen.render(artifact, fragments)
    } else if (artifact.buildArtifactType === "TAG_CLOSE") {
        tagClose.render(artifact, fragments)
    } else if (artifact.buildArtifactType === "TEXT") {
        text.render(artifact, fragments)
    } else if (artifact.buildArtifactType === "RAW") {
        raw.render(artifact, fragments)
    } else if (artifact.buildArtifactType === "CSS_CHUNK") {
        chunk.render(artifact, fragments)
    } else {
        artifact satisfies never
        throw new Error("Invariant: Invalid artifact type")
    }
}
