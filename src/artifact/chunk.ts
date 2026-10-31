import type { Chunk as CssChunk } from "@src/css"

export type Chunk = CssChunk & {
    buildArtifactType: "CSS_CHUNK"
}

export const render = (artifact: Chunk, fragments: string[]): void => {
    fragments.push("<style>", artifact.css, "</style>")
}
