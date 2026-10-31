import { mkdirSync, rmSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { css, Document, node } from "@src/index"
import { Footer } from "@www/component/footer"
import { Highlight } from "@www/component/highlight"
import { HomePage } from "@www/home"

const DIST_PATH = join(dirname(import.meta.dir), "dist", "www")

const document = new Document().attribute("lang", "en")
document.head
    .child(new node.Element("meta").attribute("charset", "utf-8"))
    .child(new node.Element("meta")
        .attribute("name", "viewport")
        .attribute("content", "width=device-width, initial-scale=1"))
    .child(new node.Element("meta")
        .attribute("name", "description")
        .attribute("content", "A minimal, zero-dependency library for building fully-styled HTML in TypeScript/JavaScript."))
    .child(new node.Element("title").child(new node.Text("HTMLForge")))
    .child(new Highlight())
document.body
    .css(cls => css.css`
        .${cls}, .${cls} * { box-sizing: border-box; }
        .${cls} {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            min-height: 100svh;
            margin: 0;
            background: #008080;
            color: #000000;
            font-family: ui-monospace, "SFMono-Regular", Consolas, "Liberation Mono", monospace;
            font-size: 0.8rem;
            line-height: 1.6;
        }
    `)
    .child(new HomePage())
    .child(new Footer())

const html = document.toString()
rmSync(DIST_PATH, { recursive: true, force: true })
mkdirSync(DIST_PATH, { recursive: true })
writeFileSync(join(DIST_PATH, "index.html"), html)
