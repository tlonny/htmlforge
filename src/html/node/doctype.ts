import type { INode, BuildArtifact } from "@src/type"

const DOCTYPE = "<!DOCTYPE html>"

export class HTMLNodeDocType implements INode {

    *build() : Iterable<BuildArtifact> {
        yield {
            buildArtifactType: "RAW",
            raw: DOCTYPE
        }
    }
}

