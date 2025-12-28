import { NodeRaw } from "@src/node/raw"
import type { INode, BuildArtifact } from "@src/type"

export const RAW = "<!DOCTYPE html>"

export class HTMLNodeDocType implements INode {

    private readonly raw : NodeRaw

    constructor() {
        this.raw = new NodeRaw(RAW)
    }

    build() : Iterable<BuildArtifact> {
        return this.raw.build()
    }
}

