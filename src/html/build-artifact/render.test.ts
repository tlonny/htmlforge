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

        expect(HTMLBuildArtifactRender(buildArtifact)).toEqual([
            { fragment: HTMLEscape(text), indentAction: "NONE" }
        ])
    })

    test("renders RAW buildArtifacts without escaping", () => {
        const raw = "<script>alert(\"raw\")</script>"
        const buildArtifact: BuildArtifactRaw = {
            buildArtifactType: "RAW",
            raw
        }

        expect(HTMLBuildArtifactRender(buildArtifact)).toEqual([
            { fragment: raw, indentAction: "NONE" }
        ])
    })

    test("renders TAG_CLOSE buildArtifacts", () => {
        const buildArtifact: BuildArtifactTagClose = {
            buildArtifactType: "TAG_CLOSE",
            tagName: "section"
        }

        expect(HTMLBuildArtifactRender(buildArtifact)).toEqual([
            { fragment: "</section>", indentAction: "CLOSE" }
        ])
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

        expect(HTMLBuildArtifactRender(buildArtifact)).toEqual([
            { fragment: `<div id="root" title="${HTMLEscape(title)}">`, indentAction: "OPEN" }
        ])
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

        expect(HTMLBuildArtifactRender(buildArtifact)).toEqual([
            { fragment: "<img src=\"/logo.png\" alt=\"Logo\">", indentAction: "NONE" }
        ])
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

        expect(HTMLBuildArtifactRender(buildArtifact)).toEqual([
            { fragment: ".fabc123 {", indentAction: "OPEN" },
            { fragment: "color: red;", indentAction: "NONE" },
            { fragment: "background-color: #fff;", indentAction: "NONE" },
            { fragment: "}", indentAction: "CLOSE" }
        ])
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
            { fragment: ".fabc123:hover {", indentAction: "OPEN" },
            { fragment: "color: blue;", indentAction: "NONE" },
            { fragment: "}", indentAction: "CLOSE" },

            { fragment: "@media (max-width: 600px) {", indentAction: "OPEN" },
            { fragment: ".fabc123 {", indentAction: "OPEN" },
            { fragment: "max-width: 500px;", indentAction: "NONE" },
            { fragment: "}", indentAction: "CLOSE" },
            { fragment: "}", indentAction: "CLOSE" },

            { fragment: ".fabc123 {", indentAction: "OPEN" },
            { fragment: "padding: 4px;", indentAction: "NONE" },
            { fragment: "}", indentAction: "CLOSE" },

            { fragment: "@media (max-width: 600px) {", indentAction: "OPEN" },
            { fragment: ".fabc123:hover {", indentAction: "OPEN" },
            { fragment: "font-weight: 700;", indentAction: "NONE" },
            { fragment: "}", indentAction: "CLOSE" },
            { fragment: "}", indentAction: "CLOSE" },
        ])
    })
})
