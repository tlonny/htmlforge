import { node } from "@src/index"
import { Window } from "@www/component/window"
import { Components } from "./components"
import { Elements } from "./elements"
import { Fragments } from "./fragments"
import { Installation } from "./installation"
import { Introduction } from "./introduction"
import { QuickLook } from "./quick-look"
import { TextAndRaw } from "./text-and-raw"
import { Usage } from "./usage"

export class HomePage implements node.Buildable {
    private readonly root = new Window("HtmlForge")
        .child(new Introduction())
        .child(new QuickLook())
        .child(new Installation())
        .child(new Usage())
        .child(new Elements())
        .child(new Fragments())
        .child(new TextAndRaw())
        .child(new Components())

    build() {
        return this.root.build()
    }
}
