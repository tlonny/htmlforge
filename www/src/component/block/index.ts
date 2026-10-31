import { node } from "@src/index"
import type { Monospace } from "./monospace"
import type { Strong } from "./strong"

export { Monospace } from "./monospace"
export { Strong } from "./strong"

export type Content = string | Monospace | Strong

export class Block implements node.Buildable {
    private readonly root = new node.Fragment()

    constructor(...content: Content[]) {
        for (const part of content) {
            this.root.child(typeof part === "string" ? new node.Text(part) : part)
        }
    }

    build() {
        return this.root.build()
    }
}
