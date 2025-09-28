import {
    fontFamily,
    fontSize,
    fontStyle,
    textDecoration,
    textTransform,
    textLetterSpacing,
    textWrap,
    textAlign,
    textOverflow,
    textIndent,
    textVerticalAlign,
    textWordBreak
} from "../typography";

describe("typography utils", () => {
    // fontFamily
    describe("fontFamily", () => {
        it("should return correct font-family for sans", () => {
            expect(fontFamily("sans")).toBe("font-family: var(--styleify-font-family-sans, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace );");
        });
        it("should return correct font-family for serif", () => {
            expect(fontFamily("serif")).toBe("font-family: var(--styleify-font-family-serif, ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji');");
        });
        it("should return correct font-family for mono", () => {
            expect(fontFamily("mono")).toBe("font-family: var(--styleify-font-family-mono, ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif);");
        });
    });

    // fontSize
    describe("fontSize", () => {

        it("should return correct font-size and line-height for lg", () => {
            expect(fontSize("lg")).toContain("--styleify-font-size-lg");
            expect(fontSize("lg")).toContain("--styleify-line-height-lg");
        });
        it("should return correct font-size and line-height for xl", () => {
            expect(fontSize("xl")).toContain("--styleify-font-size-xl");
            expect(fontSize("xl")).toContain("--styleify-line-height-xl");
        });
        it("should return correct font-size and line-height for 2xl", () => {
            expect(fontSize("2xl")).toContain("--styleify-font-size-2xl");
            expect(fontSize("2xl")).toContain("--styleify-line-height-2xl");
        });
        it("should return correct font-size and line-height for 3xl", () => {
            expect(fontSize("3xl")).toContain("--styleify-font-size-3xl");
            expect(fontSize("3xl")).toContain("--styleify-line-height-3xl");
        });
        it("should return correct font-size and line-height for 4xl", () => {
            expect(fontSize("4xl")).toContain("--styleify-font-size-4xl");
            expect(fontSize("4xl")).toContain("--styleify-line-height-4xl");
        });
        it("should return correct font-size and line-height for 5xl", () => {
            expect(fontSize("5xl")).toContain("--styleify-font-size-5xl");
            expect(fontSize("5xl")).toContain("--styleify-line-height-5xl");
        });
        it("should return correct font-size and line-height for 6xl", () => {
            expect(fontSize("6xl")).toContain("--styleify-font-size-6xl");
            expect(fontSize("6xl")).toContain("--styleify-line-height-6xl");
        });
        it("should return correct font-size and line-height for 7xl", () => {
            expect(fontSize("7xl")).toContain("--styleify-font-size-7xl");
            expect(fontSize("7xl")).toContain("--styleify-line-height-7xl");
        });
        it("should return correct font-size and line-height for 8xl", () => {
            expect(fontSize("8xl")).toContain("--styleify-font-size-8xl");
            expect(fontSize("8xl")).toContain("--styleify-line-height-8xl");
        });
        it("should return correct font-size and line-height for xs", () => {
            expect(fontSize("xs")).toContain("--styleify-font-size-xs");
        });
        it("should return correct font-size and line-height for sm", () => {
            expect(fontSize("sm")).toContain("--styleify-font-size-xs");
        });
        it("should return correct font-size and line-height for base", () => {
            expect(fontSize("base")).toContain("--styleify-font-size-base");
        });
        it("should return correct font-size and line-height for 9xl", () => {
            expect(fontSize("9xl")).toContain("--styleify-font-size-9xl");
        });
        it("should fallback to base for unknown", () => {
            // @ts-expect-error
            expect(fontSize("unknown")).toContain("--styleify-font-size-base");
        });
    });

    // fontStyle
    describe("fontStyle", () => {
        it("should return italic", () => {
            expect(fontStyle("italic")).toBe("font-style: italic;");
        });
        it("should return normal", () => {
            expect(fontStyle("not-italic")).toBe("font-style: normal;");
        });
    });

    // textDecoration
    describe("textDecoration", () => {
        it("should return underline", () => {
            expect(textDecoration("underline")).toBe("text-decoration: underline;");
        });
        it("should return line-through", () => {
            expect(textDecoration("lineThrough")).toBe("text-decoration: line-through;");
        });
        it("should return overline", () => {
            expect(textDecoration("overline")).toBe("text-decoration: overline;");
        });
        it("should return none", () => {
            expect(textDecoration("none")).toBe("text-decoration: none;");
        });
        it("should fallback to none", () => {
            // @ts-expect-error
            expect(textDecoration("foo")).toBe("text-decoration: none;");
        });
    });

    // textTransform
    describe("textTransform", () => {
        it("should return uppercase", () => {
            expect(textTransform("uppercase")).toBe("text-transform: uppercase;");
        });
        it("should return lowercase", () => {
            expect(textTransform("lowercase")).toBe("text-transform: lowercase;");
        });
        it("should return capitalize", () => {
            expect(textTransform("capitalize")).toBe("text-transform: capitalize;");
        });
        it("should return empty string for unknown", () => {
            // @ts-expect-error
            expect(textTransform("foo")).toBe("");
        });
    });

    // textLetterSpacing
    describe("textLetterSpacing", () => {
        it("should return extraCompact", () => {
            expect(textLetterSpacing("extraCompact")).toContain("--styleify-text-letter-spacing-extra-compact");
        });
        it("should return compact", () => {
            expect(textLetterSpacing("compact")).toContain("--styleify-text-letter-spacing-extra-compact");
        });
        it("should return comfortable", () => {
            expect(textLetterSpacing("comfortable")).toContain("--styleify-text-letter-spacing-comfortable");
        });
        it("should return relaxed", () => {
            expect(textLetterSpacing("relaxed")).toContain("--styleify-text-letter-spacing-relaxed");
        });
        it("should return spacious", () => {
            expect(textLetterSpacing("spacious")).toContain("--styleify-text-letter-spacing-spacious");
        });
        it("should return airy", () => {
            expect(textLetterSpacing("airy")).toContain("--styleify-text-letter-spacing-airy");
        });
        it("should fallback to comfortable", () => {
            // @ts-expect-error
            expect(textLetterSpacing("foo")).toContain("--styleify-text-letter-spacing-comfortable");
        });
    });

    // textWrap
    describe("textWrap", () => {
        it("should return wrap", () => {
            expect(textWrap("wrap")).toBe("text-wrap: wrap;");
        });
        it("should return nowrap", () => {
            expect(textWrap("nowrap")).toBe("text-wrap: nowrap;");
        });
        it("should return balance", () => {
            expect(textWrap("balance")).toBe("text-wrap: balance;");
        });
        it("should return pretty", () => {
            expect(textWrap("pretty")).toBe("text-wrap: pretty;");
        });
        it("should fallback to wrap", () => {
            // @ts-expect-error
            expect(textWrap("foo")).toBe("text-wrap: wrap;");
        });
    });

    // textAlign
    describe("textAlign", () => {
        it("should return left", () => {
            expect(textAlign("left")).toBe("text-align: left;");
        });
        it("should return center", () => {
            expect(textAlign("center")).toBe("text-align: center;");
        });
        it("should return right", () => {
            expect(textAlign("right")).toBe("text-align: right;");
        });
        it("should return justify", () => {
            expect(textAlign("justify")).toBe("text-align: justify;");
        });
        it("should return start", () => {
            expect(textAlign("start")).toBe("text-align: start;");
        });
        it("should return end", () => {
            expect(textAlign("end")).toBe("text-align: end;");
        });
        it("should fallback to left", () => {
            // @ts-expect-error
            expect(textAlign("foo")).toBe("text-align: left;");
        });
    });

    // textOverflow
    describe("textOverflow", () => {
        it("should return truncate", () => {
            expect(textOverflow("truncate")).toContain("overflow: hidden");
        });
        it("should return ellipsis", () => {
            expect(textOverflow("ellipsis")).toBe("text-overflow: ellipsis;");
        });
        it("should return clip", () => {
            expect(textOverflow("clip")).toBe("text-overflow: clip;");
        });
        it("should fallback to ellipsis", () => {
            // @ts-expect-error
            expect(textOverflow("foo")).toBe("text-overflow: ellipsis;");
        });
    });

    // textIndent
    describe("textIndent", () => {
        it("should return correct indent for sm", () => {
            expect(textIndent("sm")).toContain("calc(var(--styleify-text-indent-spacing) * 2)");
        });
        it("should return correct indent for base", () => {
            expect(textIndent("base")).toContain("calc(var(--styleify-text-indent-spacing) * 3)");
        });
        it("should return correct indent for lg", () => {
            expect(textIndent("lg")).toContain("calc(var(--styleify-text-indent-spacing) * 4)");
        });
        it("should return correct indent for xl", () => {
            expect(textIndent("xl")).toContain("calc(var(--styleify-text-indent-spacing) * 5)");
        });
        it("should return correct indent for 2xl", () => {
            expect(textIndent("2xl")).toContain("calc(var(--styleify-text-indent-spacing) * 6)");
        });
        it("should return correct indent for 3xl", () => {
            expect(textIndent("3xl")).toContain("calc(var(--styleify-text-indent-spacing) * 7)");
        });
        it("should return correct indent for 4xl", () => {
            expect(textIndent("4xl")).toContain("calc(var(--styleify-text-indent-spacing) * 8)");
        });
        it("should return correct indent for 5xl", () => {
            expect(textIndent("5xl")).toContain("calc(var(--styleify-text-indent-spacing) * 9)");
        });
        it("should return correct indent for 6xl", () => {
            expect(textIndent("6xl")).toContain("calc(var(--styleify-text-indent-spacing) * 10)");
        });
        it("should return correct indent for 7xl", () => {
            expect(textIndent("7xl")).toContain("calc(var(--styleify-text-indent-spacing) * 11)");
        });
        it("should return correct indent for 8xl", () => {
            expect(textIndent("8xl")).toContain("calc(var(--styleify-text-indent-spacing) * 12)");
        });

        it("should return correct indent for xs", () => {
            expect(textIndent("xs")).toContain("calc(var(--styleify-text-indent-spacing) * 1)");
        });
        it("should return correct indent for 9xl", () => {
            expect(textIndent("9xl")).toContain("calc(var(--styleify-text-indent-spacing) * 13)");
        });
        it("should fallback to base", () => {
            // @ts-expect-error
            expect(textIndent("foo")).toContain("calc(var(--styleify-text-indent-spacing) * 3)");
        });
    });

    // textVerticalAlign
    describe("textVerticalAlign", () => {
        it("should return baseline", () => {
            expect(textVerticalAlign("baseline")).toBe("vertical-align: baseline;");
        });
        it("should return top", () => {
            expect(textVerticalAlign("top")).toBe("vertical-align: top;");
        });
        it("should return middle", () => {
            expect(textVerticalAlign("middle")).toBe("vertical-align: middle;");
        });
        it("should return bottom", () => {
            expect(textVerticalAlign("bottom")).toBe("vertical-align: bottom;");
        });
        it("should return textTop", () => {
            expect(textVerticalAlign("textTop")).toBe("vertical-align: text-top;");
        });
        it("should return textBottom", () => {
            expect(textVerticalAlign("textBottom")).toBe("vertical-align: text-bottom;");
        });
        it("should return sub", () => {
            expect(textVerticalAlign("sub")).toBe("vertical-align: sub;");
        });
        it("should return super", () => {
            expect(textVerticalAlign("super")).toBe("vertical-align: super;");
        });
        it("should fallback to middle", () => {
            // @ts-expect-error
            expect(textVerticalAlign("foo")).toBe("vertical-align: middle;");
        });
    });

    // textWordBreak
    describe("textWordBreak", () => {
        it("should return normal", () => {
            expect(textWordBreak("normal")).toBe("word-break: normal;");
        });
        it("should return all", () => {
            expect(textWordBreak("all")).toBe("word-break: break-all;");
        });
        it("should return keep", () => {
            expect(textWordBreak("keep")).toBe("word-break: keep-all;");
        });
        it("should fallback to normal", () => {
            // @ts-expect-error
            expect(textWordBreak("foo")).toBe("word-break: normal;");
        });
    });
});
