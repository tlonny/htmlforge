import { copyFileSync, mkdirSync, rmSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { Home } from "@www/page/home"

const DIST_PATH = join(dirname(import.meta.dir), "dist", "www")

const html = new Home().toString()
rmSync(DIST_PATH, { recursive: true, force: true })
mkdirSync(DIST_PATH, { recursive: true })
copyFileSync(join(import.meta.dir, "favicon.png"), join(DIST_PATH, "favicon.png"))
writeFileSync(join(DIST_PATH, "index.html"), html)
