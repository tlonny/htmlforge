import { describe, expect, test } from "bun:test"

import { HTMLBuildArtifactRender } from "@src/html/build-artifact/render"
import type {
    BuildArtifactRaw,
    BuildArtifactStyledClass,
    BuildArtifactTagClose,
    BuildArtifactTagOpen,
    BuildArtifactText
} from "@src/type"
import { HTMLEscape } from "@src/util/html-escape"

describe("HTMLBuildArtifactRender", () => {

    test("renders TEXT buildArtifacts with HTML escaping", () => {
        const text = "<div data-value=\"1\">& literal text"
        const buildArtifact: BuildArtifactText = {
            buildArtifactType: "TEXT",
            text
        }

        expect(HTMLBuildArtifactRender(buildArtifact)).toEqual(HTMLEscape(text))
    })

    test("renders RAW buildArtifacts without escaping", () => {
        const raw = "<script>alert(\"raw\")</script>"
        const buildArtifact: BuildArtifactRaw = {
            buildArtifactType: "RAW",
            raw
        }

        expect(HTMLBuildArtifactRender(buildArtifact)).toEqual(raw)
    })

    test("renders TAG_CLOSE buildArtifacts", () => {
        const buildArtifact: BuildArtifactTagClose = {
            buildArtifactType: "TAG_CLOSE",
            tagName: "section"
        }

        expect(HTMLBuildArtifactRender(buildArtifact)).toEqual("</section>")
    })

    test("renders TAG_OPEN buildArtifacts with escaped attributes", () => {
        const title = "1 < 2"
        const buildArtifact: BuildArtifactTagOpen = {
            buildArtifactType: "TAG_OPEN",
            tagName: "div",
            isVoid: false,
            attributes: [
                { name: "id", value: "root" },
                { name: "title", value: title }
            ]
        }

        expect(HTMLBuildArtifactRender(buildArtifact)).toEqual(
            `<div id="root" title="${HTMLEscape(title)}">`
        )
    })

    test("renders void TAG_OPEN buildArtifacts without further indentation", () => {
        const buildArtifact: BuildArtifactTagOpen = {
            buildArtifactType: "TAG_OPEN",
            tagName: "img",
            isVoid: true,
            attributes: [
                { name: "src", value: "/logo.png" },
                { name: "alt", value: "Logo" }
            ]
        }

        expect(HTMLBuildArtifactRender(buildArtifact)).toEqual("<img src=\"/logo.png\" alt=\"Logo\">")
    })

    test("renders basic STYLED_CLASS buildArtifacts", () => {
        const buildArtifact: BuildArtifactStyledClass = {
            buildArtifactType: "STYLED_CLASS",
            className: "fabc123",
            styles: [
                { name: "color", value: "red", pseudoSelector: null, mediaQuery: null },
                { name: "background-color", value: "#fff", pseudoSelector: null, mediaQuery: null },
            ]
        }

        expect(HTMLBuildArtifactRender(buildArtifact)).toEqual(
            ".fabc123 {color: red;background-color: #fff;}"
        )
    })

    test("renders STYLED_CLASS buildArtifacts scoped by pseudo selectors and media queries", () => {
        const buildArtifact: BuildArtifactStyledClass = {
            buildArtifactType: "STYLED_CLASS",
            className: "fabc123",
            styles: [
                { name: "color", value: "blue", pseudoSelector: ":hover", mediaQuery: null },
                { name: "max-width", value: "500px", pseudoSelector: null, mediaQuery: "@media (max-width: 600px)" },
                { name: "padding", value: "4px", pseudoSelector: null, mediaQuery: null },
                { name: "font-weight", value: "700", pseudoSelector: ":hover", mediaQuery: "@media (max-width: 600px)" },
            ]
        }

        expect(HTMLBuildArtifactRender(buildArtifact)).toEqual([
            ".fabc123:hover {color: blue;}",
            "@media (max-width: 600px) {.fabc123 {max-width: 500px;}}",
            ".fabc123 {padding: 4px;}",
            "@media (max-width: 600px) {.fabc123:hover {font-weight: 700;}}"
        ].join(""))
    })
})
