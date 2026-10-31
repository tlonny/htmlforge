import { join } from "node:path"

const ROOT_DIRECTORY = import.meta.dir
const OUTPUT_DIRECTORY = join(ROOT_DIRECTORY, "dist", "htmlforge")

const build = Bun.spawn({
    cmd: [
        "bun",
        "run",
        "tsdown",
        "src/index.ts",
        "--no-config",
        "--out-dir",
        OUTPUT_DIRECTORY,
        "--format",
        "esm",
        "--dts",
        "--clean",
        "--target",
        "es2022",
        "--platform",
        "node",
    ],
    cwd: ROOT_DIRECTORY,
    stderr: "inherit",
    stdout: "inherit",
})

const exitCode = await build.exited

if (exitCode !== 0) {
    process.exit(exitCode)
}
