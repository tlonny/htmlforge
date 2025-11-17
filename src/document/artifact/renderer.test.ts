import { describe, expect, test } from "bun:test"

import { DocumentArtifactRenderer } from "@src/document/artifact/renderer"
import type { ArtifactRaw, ArtifactTagClose, ArtifactTagOpen, ArtifactText, Style } from "@src/type"
import { HTMLEscape } from "@src/util/html-escape"

describe("DOMDocumentArtifactRenderer", () => {

    test("renders TEXT artifacts with HTML escaping", () => {
        const renderer = new DocumentArtifactRenderer()
        const text = "<div data-value=\"1\">& literal text"
        const artifact: ArtifactText = {
            artifactType: "TEXT",
            text
        }

        const rendered = renderer.render(artifact)

        expect(rendered).toBe(HTMLEscape(text))
    })

    test("renders RAW artifacts without escaping", () => {
        const renderer = new DocumentArtifactRenderer()
        const raw = "<script>alert(\"raw\")</script>"
        const artifact: ArtifactRaw = {
            artifactType: "RAW",
            raw
        }

        const rendered = renderer.render(artifact)

        expect(rendered).toBe(raw)
    })

    test("renders TAG_CLOSE artifacts", () => {
        const renderer = new DocumentArtifactRenderer()
        const artifact: ArtifactTagClose = {
            artifactType: "TAG_CLOSE",
            tagName: "section"
        }

        const rendered = renderer.render(artifact)

        expect(rendered).toBe("</section>")
    })

    test("renders TAG_OPEN artifacts without CSS", () => {
        const renderer = new DocumentArtifactRenderer()
        const title = "1 < 2"
        const artifact: ArtifactTagOpen = {
            artifactType: "TAG_OPEN",
            tagName: "div",
            attributes: [
                { name: "id", value: "root" },
                { name: "title", value: title }
            ],
            styles: []
        }

        const rendered = renderer.render(artifact)

        expect(rendered).toBe(`<div id="root" title="${HTMLEscape(title)}">`)
    })

    test("renders TAG_OPEN artifacts with CSS", () => {
        const renderer = new DocumentArtifactRenderer()
        const styles: Style[] = [
            { name: "max-width", value: "500px", pseudoSelector: null, mediaQuery: null, containerQuery: null }
        ]

        const artifact: ArtifactTagOpen = {
            artifactType: "TAG_OPEN",
            tagName: "section",
            attributes: [],
            styles
        }

        const rendered = renderer.render(artifact)
        const match = rendered.match(
            /^<style>(\.[^. ]+) {([^}]*)}<\/style><section class="([^"]+)">$/
        )

        expect(match).not.toBeNull()
        if (!match) {
            return
        }

        const [, selector, rules, className] = match
        expect(selector).toBe(`.${className}`)
        expect(rules).toContain("max-width: 500px")
    })

    test("renders TAG_OPEN artifacts with media-query-scoped CSS", () => {
        const renderer = new DocumentArtifactRenderer()
        const styles: Style[] = [
            { name: "max-width", value: "500px", pseudoSelector: null, mediaQuery: "@media (max-width: 600px)", containerQuery: null }
        ]

        const artifact: ArtifactTagOpen = {
            artifactType: "TAG_OPEN",
            tagName: "section",
            attributes: [],
            styles
        }

        const rendered = renderer.render(artifact)
        const match = rendered.match(
            /^<style>@media \(max-width: 600px\) {\.(\S+) {(.*)}}<\/style><section class="([^"]+)">$/
        )

        expect(match).not.toBeNull()
        if (!match) {
            return
        }

        const [, selector, rules, className] = match
        expect(selector).toBe(className)
        expect(rules).toContain("max-width: 500px")
    })

    test("renders TAG_OPEN artifacts with pseudo-selector scoped media-query CSS", () => {
        const renderer = new DocumentArtifactRenderer()
        const styles: Style[] = [
            { name: "color", value: "blue", pseudoSelector: ":hover", mediaQuery: "@media (max-width: 600px)", containerQuery: null }
        ]

        const artifact: ArtifactTagOpen = {
            artifactType: "TAG_OPEN",
            tagName: "button",
            attributes: [],
            styles
        }

        const rendered = renderer.render(artifact)
        const match = rendered.match(
            /^<style>@media \(max-width: 600px\) {\.(\S+):hover {(.*)}}<\/style><button class="([^"]+)">$/
        )

        expect(match).not.toBeNull()
        if (!match) {
            return
        }

        const [, selector, rules, className] = match
        expect(selector).toBe(className)
        expect(rules).toContain("color: blue")
    })

    test("renders TAG_OPEN artifacts with nested container and media queries", () => {
        const renderer = new DocumentArtifactRenderer()
        const styles: Style[] = [
            {
                name: "color",
                value: "blue",
                pseudoSelector: null,
                containerQuery: "@container (min-width: 700px)",
                mediaQuery: "@media (max-width: 600px)"
            }
        ]

        const artifact: ArtifactTagOpen = {
            artifactType: "TAG_OPEN",
            tagName: "section",
            attributes: [],
            styles
        }

        const rendered = renderer.render(artifact)
        const match = rendered.match(
            /^<style>@media \(max-width: 600px\) {@container \(min-width: 700px\) {\.(\S+) {(.*)}}}<\/style><section class="([^"]+)">$/
        )

        expect(match).not.toBeNull()
        if (!match) {
            return
        }

        const [, selector, rules, className] = match
        expect(selector).toBe(className)
        expect(rules).toContain("color: blue")
    })

    test("reuses style blocks for identical CSS", () => {
        const renderer = new DocumentArtifactRenderer()
        const styles: Style[] = [
            { name: "max-width", value: "500px", pseudoSelector: null, mediaQuery: null, containerQuery: null }
        ]
        const firstArtifact: ArtifactTagOpen = {
            artifactType: "TAG_OPEN",
            tagName: "div",
            attributes: [],
            styles
        }
        const secondArtifact: ArtifactTagOpen = {
            artifactType: "TAG_OPEN",
            tagName: "section",
            attributes: [{ name: "id", value: "second" }],
            styles
        }

        const firstRender = renderer.render(firstArtifact)
        const secondRender = renderer.render(secondArtifact)
        const firstClass = firstRender.match(/class="([^"]+)"/)?.[1]
        const secondClass = secondRender.match(/class="([^"]+)"/)?.[1]

        expect(firstRender).toContain("max-width: 500px")
        expect(firstClass).toBeString()

        expect(secondRender).not.toContain("max-width: 500px")
        expect(secondClass).toEqual(firstClass)
    })

    test("emits distinct style blocks for different CSS", () => {
        const renderer = new DocumentArtifactRenderer()
        const stylesA: Style[] = [
            { name: "max-width", value: "500px", pseudoSelector: null, mediaQuery: null, containerQuery: null }
        ]
        const stylesB: Style[] = [
            { name: "max-width", value: "600px", pseudoSelector: null, mediaQuery: null, containerQuery: null }
        ]
        const firstArtifact: ArtifactTagOpen = {
            artifactType: "TAG_OPEN",
            tagName: "div",
            attributes: [],
            styles: stylesA
        }
        const secondArtifact: ArtifactTagOpen = {
            artifactType: "TAG_OPEN",
            tagName: "section",
            attributes: [],
            styles: stylesB
        }

        const firstRender = renderer.render(firstArtifact)
        const secondRender = renderer.render(secondArtifact)
        const firstClass = firstRender.match(/class="([^"]+)"/)?.[1]
        const secondClass = secondRender.match(/class="([^"]+)"/)?.[1]

        expect(firstRender).toContain("max-width: 500px")
        expect(firstClass).toBeString()

        expect(secondRender).toContain("max-width: 600px")
        expect(secondClass).not.toEqual(firstClass)
    })

    test("emits distinct style blocks for different CSS (different pseduo-selectors)", () => {
        const renderer = new DocumentArtifactRenderer()
        const stylesA: Style[] = [
            { name: "max-width", value: "500px", pseudoSelector: ":hover", mediaQuery: null, containerQuery: null }
        ]
        const stylesB: Style[] = [
            { name: "max-width", value: "600px", pseudoSelector: null, mediaQuery: null, containerQuery: null }
        ]
        const firstArtifact: ArtifactTagOpen = {
            artifactType: "TAG_OPEN",
            tagName: "div",
            attributes: [],
            styles: stylesA
        }
        const secondArtifact: ArtifactTagOpen = {
            artifactType: "TAG_OPEN",
            tagName: "section",
            attributes: [],
            styles: stylesB
        }

        const firstRender = renderer.render(firstArtifact)
        const secondRender = renderer.render(secondArtifact)
        const firstClass = firstRender.match(/class="([^"]+)"/)?.[1]
        const secondClass = secondRender.match(/class="([^"]+)"/)?.[1]

        expect(firstRender).toContain("max-width: 500px")
        expect(firstClass).toBeString()

        expect(secondRender).toContain("max-width: 600px")
        expect(secondClass).not.toEqual(firstClass)
    })

    test("emits distinct style blocks for different CSS (different media queries)", () => {
        const renderer = new DocumentArtifactRenderer()
        const stylesA: Style[] = [
            { name: "max-width", value: "500px", pseudoSelector: null, mediaQuery: "@media (max-width: 600px)", containerQuery: null }
        ]
        const stylesB: Style[] = [
            { name: "max-width", value: "500px", pseudoSelector: null, mediaQuery: "@media (min-width: 601px)", containerQuery: null }
        ]
        const firstArtifact: ArtifactTagOpen = {
            artifactType: "TAG_OPEN",
            tagName: "div",
            attributes: [],
            styles: stylesA
        }
        const secondArtifact: ArtifactTagOpen = {
            artifactType: "TAG_OPEN",
            tagName: "section",
            attributes: [],
            styles: stylesB
        }

        const firstRender = renderer.render(firstArtifact)
        const secondRender = renderer.render(secondArtifact)
        const firstClass = firstRender.match(/class="([^"]+)"/)?.[1]
        const secondClass = secondRender.match(/class="([^"]+)"/)?.[1]

        expect(firstRender).toContain("@media (max-width: 600px)")
        expect(firstRender).toContain("max-width: 500px")
        expect(firstClass).toBeString()

        expect(secondRender).toContain("@media (min-width: 601px)")
        expect(secondRender).toContain("max-width: 500px")
        expect(secondClass).not.toEqual(firstClass)
    })

    test("emits distinct style blocks for different CSS (different container queries)", () => {
        const renderer = new DocumentArtifactRenderer()
        const stylesA: Style[] = [
            { name: "max-width", value: "500px", pseudoSelector: null, mediaQuery: null, containerQuery: "@container (min-width: 700px)" }
        ]
        const stylesB: Style[] = [
            { name: "max-width", value: "500px", pseudoSelector: null, mediaQuery: null, containerQuery: "@container (min-width: 900px)" }
        ]
        const firstArtifact: ArtifactTagOpen = {
            artifactType: "TAG_OPEN",
            tagName: "div",
            attributes: [],
            styles: stylesA
        }
        const secondArtifact: ArtifactTagOpen = {
            artifactType: "TAG_OPEN",
            tagName: "section",
            attributes: [],
            styles: stylesB
        }

        const firstRender = renderer.render(firstArtifact)
        const secondRender = renderer.render(secondArtifact)
        const firstClass = firstRender.match(/class="([^"]+)"/)?.[1]
        const secondClass = secondRender.match(/class="([^"]+)"/)?.[1]

        expect(firstRender).toContain("@container (min-width: 700px)")
        expect(firstRender).toContain("max-width: 500px")
        expect(firstClass).toBeString()

        expect(secondRender).toContain("@container (min-width: 900px)")
        expect(secondRender).toContain("max-width: 500px")
        expect(secondClass).not.toEqual(firstClass)
    })
})
