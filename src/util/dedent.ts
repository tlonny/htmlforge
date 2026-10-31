/** Remove surrounding blank lines and the shared indentation of nonblank lines. */
export const dedent = (source: string): string => {
    const lines = source.replace(/\r\n?/g, "\n").split("\n")

    while (lines.length > 0 && lines[0]?.trim() === "") {
        lines.shift()
    }
    while (lines.length > 0 && lines[lines.length - 1]?.trim() === "") {
        lines.pop()
    }

    const nonblank = lines.filter(line => line.trim() !== "")
    const indentation = nonblank.reduce((minimum, line) =>
        Math.min(minimum, line.match(/^[\t ]*/)?.[0].length ?? 0), Infinity
    )

    return lines.map(line => line.trim() === "" ? "" : line.slice(indentation)).join("\n")
}
