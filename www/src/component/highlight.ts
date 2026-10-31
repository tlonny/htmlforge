import { node } from "@src/index"

const CDN = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1"

export class Highlight implements node.Buildable {
    private readonly root = new node.Fragment()
        .child(new node.Element("link")
            .attribute("rel", "stylesheet")
            .attribute("href", `${CDN}/styles/github.min.css`))
        .child(new node.Element("script")
            .attribute("src", `${CDN}/highlight.min.js`)
            .attribute("defer", "defer"))
        .child(new node.Element("script")
            .attribute("src", `${CDN}/languages/typescript.min.js`)
            .attribute("defer", "defer"))
        .child(new node.Element("script").child(new node.Raw(`
document.addEventListener("DOMContentLoaded", () => {
    if (window.hljs) {
        window.hljs.highlightAll()
    }
})
`)))

    build() {
        return this.root.build()
    }
}
