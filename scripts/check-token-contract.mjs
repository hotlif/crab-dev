import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
);
const componentsRoot = path.join(repositoryRoot, "components");
const globalPackageName = "@crab-dev/rc-token-global";
const semanticPackageName = "@crab-dev/rc-token-semantic";

const feedbackIntents = ["error", "success", "warning", "info"];
const feedbackRoles = [
    "text",
    "icon",
    "border",
    "background",
    "background-hover",
    "solid",
    "solid-hover",
    "solid-active",
    "on-solid",
];

const requiredSemanticKeys = [
    'color.brand.container',
    'color.brand.on-container',
    ...['canvas', 'content', 'container', 'raised', 'overlay'].map(role => `color.surface.${role}`),
    ...['hover', 'focus', 'pressed', 'dragged'].map(state => `state.opacity.${state}`),
    ...['control', 'card', 'overlay'].map(role => `shape.${role}`),
    ...['display', 'headline', 'title', 'body', 'label', 'caption'].flatMap(role =>
        ['font-family', 'font-size', 'font-weight', 'line-height'].map(property => `typography.${role}.${property}`)),
    'size.touch-target',
    'size.selection-target',
    "color.brand.primary",
    "color.brand.primary-hover",
    "color.brand.primary-active",
    "color.brand.primary-subtle",
    "color.background.surface",
    "color.background.elevated",
    "color.background.sunken",
    "color.background.inverse",
    "color.background.overlay",
    "color.background.disabled",
    "color.background.hover-subtle",
    "color.background.active-subtle",
    "color.background.selected",
    "color.text.primary",
    "color.text.secondary",
    "color.text.tertiary",
    "color.text.on-brand",
    "color.text.inverse",
    "color.text.disabled",
    "color.text.link",
    "color.text.link-hover",
    "color.border.subtle",
    "color.border.default",
    "color.border.hover",
    "color.border.strong",
    "color.border.focus",
    "color.border.error",
    "color.focus.ring",
    "color.selection.background",
    "color.selection.border",
    "color.selection.foreground",
    "color.highlight.background",
    "color.highlight.background-active",
    "color.highlight.foreground",
    "color.fill.subtle",
    "color.fill.default",
    "color.fill.strong",
    "color.fill.translucent",
    "color.fill.inactive",
    "color.fill.active",
    ...feedbackIntents.flatMap((intent) =>
        feedbackRoles.map((role) => `color.feedback.${intent}.${role}`),
    ),
];

const approvedDataColorTokens = new Map([
    // PDF page content keeps a white paper background in every UI theme.
    ["rc-pdf-editor:canvas.paper.background-color", "oklch(1 0 0)"],
    ["rc-bar-chart:palette.series.blue.color", "oklch(0.5753 0.1626 255.53)"],
    ["rc-bar-chart:palette.series.orange.color", "oklch(0.6708 0.175 40.64)"],
    ["rc-bar-chart:palette.series.aqua.color", "oklch(0.669 0.1408 162.11)"],
    ["rc-bar-chart:palette.series.yellow.color", "oklch(0.7644 0.1612 75.12)"],
    [
        "rc-bar-chart:palette.series.magenta.color",
        "oklch(0.7163 0.1412 357.39)",
    ],
    ["rc-bar-chart:palette.series.green.color", "oklch(0.5285 0.1798 142.5)"],
    ["rc-bar-chart:palette.series.violet.color", "oklch(0.4331 0.1671 283.62)"],
    ["rc-bar-chart:palette.series.red.color", "oklch(0.6226 0.1909 24.91)"],
]);

const approvedDataColorValues = new Set(
    [...approvedDataColorTokens]
        .filter(([key]) => key.startsWith("rc-bar-chart:"))
        .map(([, value]) => value),
);

const allowExactLines = (reason, lines) => {
    const allowedLines = new Set(lines);
    const usedLines = new Set();
    return {
        reason,
        allowedLines,
        usedLines,
        allows: (_value, line) => {
            const normalizedLine = line.trim();
            if (!allowedLines.has(normalizedLine)) return false;
            usedLines.add(normalizedLine);
            return true;
        },
    };
};

const uiRawColorAllowlist = new Map([
    [
        "components/rc-pdf-editor/src/capture-region.ts",
        allowExactLines("white paper background in exported OCR image data", [
            "context.fillStyle = '#ffffff'; context.fillRect(0, 0, width, height);",
        ]),
    ],
    [
        "components/rc-pdf-editor/src/color.ts",
        allowExactLines("conversion of user-selected PDF object color data", [
            "export function colorCss(color: Rgba): string { return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3] / 255})`; }",
            "return parseColor(`oklch(${value.lightness} ${value.chroma} ${value.hue} / ${value.alpha ?? 1})`).map(channel => Math.round(channel * 255)) as Rgba;",
        ]),
    ],
    [
        "components/rc-bar-chart/src/palette.ts",
        allowExactLines(
            "CVD-safe data colors and exact legacy renderer palette",
            [
                ...[...approvedDataColorValues].map((value) => `'${value}',`),
                "gridline: 'oklch(0.9055 0.0095 100)',",
                "baseline: 'oklch(0.8118 0.0152 102.51)',",
                "axisLabel: 'oklch(0.660 0.014 286)',",
                "canvasBackground: '#ffffff',",
                "out = `rgb(${mix(r, bgR)}, ${mix(g, bgG)}, ${mix(b, bgB)})`;",
            ],
        ),
    ],
    [
        "components/rc-canvas/src/palette.ts",
        allowExactLines(
            "exact DEFAULT_CANVAS_PALETTE and transparent parser result",
            [
                "foreground: '#000000',",
                "grid: '#b0b0b0',",
                "selectionStroke: '#4a9eff',",
                "selectionFill: 'rgba(74,158,255,0.08)',",
                "editorBackground: 'white',",
                "editorBorder: '#4a9eff',",
                "transformerHandleFill: '#ffffff',",
                "transformerHandleStroke: '#4a90e2',",
                "transformerSelectionStroke: '#4a90e2',",
                "minimapBackground: 'rgba(240,242,245,0.92)',",
                "minimapViewportStroke: 'rgba(59,130,246,0.8)',",
                "minimapViewportFill: 'rgba(59,130,246,0.08)',",
                "minimapBorder: 'rgba(0,0,0,0.08)',",
                "minimapShadow: '0 2px 10px rgba(0,0,0,0.14)',",
                "minimapImageFallback: 'rgba(160,160,160,0.7)',",
                "if (named === 'white') return 'rgba(255, 255, 255, 1)';",
                "if (named === 'black') return 'rgba(0, 0, 0, 1)';",
                "if (value.toLowerCase() === 'transparent') return 'rgba(0, 0, 0, 0)';",
                "return `rgba(${Math.round(red * 255)}, ${Math.round(green * 255)}, ${Math.round(blue * 255)}, ${alpha})`;",
                "return `rgba(${red}, ${green}, ${blue}, ${alpha / 255})`;",
            ],
        ),
    ],
    [
        "components/rc-canvas/src/shapes/minimap.tsx",
        allowExactLines("renderer conversion of normalized RGBA command data", [
            "return `rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)},${(a * alphaFactor).toFixed(2)})`;",
        ]),
    ],
    [
        "components/rc-flow-diagram/src/palette.ts",
        allowExactLines(
            "exact DEFAULT_FLOW_DIAGRAM_PALETTE renderer fallback",
            [
                "grid: '#eceef3',",
                "nodeFill: 'oklch(0.60 0.14 256)',",
                "nodeLabel: '#ffffff',",
                "edge: '#6b7280',",
            ],
        ),
    ],
    [
        "components/rc-canvas/src/renderer/text-atlas.ts",
        allowExactLines("black/white glyph atlas alpha masks", [
            "ctx2d.fillStyle = '#000';",
            "ctx2d.fillStyle = '#fff';",
        ]),
    ],
    [
        "components/rc-color-picker/src/panels/colorPickerPanel.tsx",
        allowExactLines(
            "user-selected color-space values and rendered gradients",
            [
                "oklch(0.7 0.15 0),",
                "oklch(0.7 0.15 60),",
                "oklch(0.7 0.15 120),",
                "oklch(0.7 0.15 180),",
                "oklch(0.7 0.15 240),",
                "oklch(0.7 0.15 300),",
                "oklch(0.7 0.15 360)",
                "const opaque = `oklch(${value.lightness} ${value.chroma} ${value.hue})`;",
                "backgroundColor: `oklch(${value.lightness} ${value.chroma} ${value.hue} / ${value.alpha ?? 1})`,",
                "oklch(0 ${value.chroma} ${value.hue}),",
                "oklch(1 ${value.chroma} ${value.hue})",
                '[TokenVars["thumb.fill"]]: `oklch(${value.lightness} ${value.chroma} ${value.hue})`,',
                "oklch(0.6 0 ${value.hue}),",
                "oklch(0.6 0.4 ${value.hue})",
                '[TokenVars["thumb.fill"]]: `oklch(0.6 ${value.chroma} ${value.hue})`,',
                '[TokenVars["thumb.fill"]]: `oklch(0.7 0.25 ${value.hue})`,',
                '[TokenVars["thumb.fill"]]: `oklch(${value.lightness} ${value.chroma} ${value.hue} / ${value.alpha ?? 1})`,',
            ],
        ),
    ],
    [
        "components/rc-color-picker/src/colorPicker/colorPickerInput.tsx",
        allowExactLines("rendering the user-selected color value", [
            "backgroundColor: `oklch(${value.lightness} ${value.chroma} ${value.hue} / ${value.alpha ?? 1})`,",
        ]),
    ],
    [
        "components/rc-color-picker/src/panels/presetSwatches.tsx",
        allowExactLines("rendering user-provided preset color data", [
            '<rect x="0.5" y="0.5" width="19" height="19" rx="4" fill={`oklch(${color.lightness} ${color.chroma} ${color.hue} / ${color.alpha ?? 1})`} />',
        ]),
    ],
    [
        "components/rc-color-picker/src/utils/color.ts",
        allowExactLines(
            "serializing user color data to requested output formats",
            [
                "return alpha < 1 ? `rgba(${r}, ${g}, ${b}, ${round(alpha, 2)})` : `rgb(${r}, ${g}, ${b})`;",
                "return alpha < 1 ? `hsla(${hh}, ${ss}%, ${ll}%, ${round(alpha, 2)})` : `hsl(${hh}, ${ss}%, ${ll}%)`;",
                "return alpha < 1 ? `oklch(${core} / ${round(alpha, 2)})` : `oklch(${core})`;",
            ],
        ),
    ],
    [
        "components/rc-token-semantic/src/brand-theme.ts",
        allowExactLines(
            "validated user brand seed serialized as gamut-mapped L2 theme colors",
            [
                "return `oklch(${value.lightness.toFixed(6)} ${value.chroma.toFixed(6)} ${value.hue.toFixed(4)})`;",
                "const onBrand = dark ? shade(0.2, Math.min(chroma * 0.15, 0.02)) : 'oklch(1 0 0)';",
            ],
        ),
    ],
]);

const cssProperties = new Set([
    "accent-color",
    "animation",
    "animation-delay",
    "animation-duration",
    "animation-timing-function",
    "appearance",
    "backdrop-filter",
    "background",
    "background-color",
    "block-size",
    "border",
    "border-color",
    "border-radius",
    "border-style",
    "border-width",
    "bottom",
    "box-shadow",
    "color",
    "column-gap",
    "cursor",
    "fill",
    "filter",
    "flex-basis",
    "font-family",
    "font-size",
    "font-weight",
    "gap",
    "height",
    "inline-size",
    "inset-block-start",
    "inset-inline-end",
    "left",
    "letter-spacing",
    "line-height",
    "margin",
    "margin-bottom",
    "margin-inline-end",
    "margin-right",
    "margin-top",
    "max-height",
    "max-width",
    "min-block-size",
    "min-height",
    "min-width",
    "opacity",
    "outline-color",
    "outline-offset",
    "outline-width",
    "padding",
    "padding-block",
    "padding-inline",
    "padding-inline-end",
    "padding-inline-start",
    "padding-left",
    "padding-right",
    "padding-top",
    "right",
    "row-gap",
    "scale",
    "scrollbar-color",
    "stroke",
    "stroke-color",
    "stroke-dasharray",
    "stroke-width",
    "tab-size",
    "text-decoration",
    "text-decoration-color",
    "text-decoration-width",
    "text-transform",
    "text-underline-offset",
    "top",
    "transform",
    "transition",
    "translate",
    "width",
    "z-index",
]);

const terminalStates = [
    "focus-within",
    "out-of-range",
    "indeterminate",
    "placeholder",
    "disabled",
    "dragging",
    "selected",
    "snapping",
    "warning",
    "checked",
    "inactive",
    "loading",
    "pressed",
    "active",
    "error",
    "hidden",
    "hover",
    "open",
    "plain",
    "focus",
];

const statePlacementWords = new Set([
    "hover",
    "active",
    "focus",
    "selected",
    "disabled",
    "error",
]);

const errors = [];

function recordError(message) {
    errors.push(message);
}

function toPosix(relativePath) {
    return relativePath.split(path.sep).join("/");
}

function stripTomlComment(line) {
    let quote;
    let escaped = false;
    for (let index = 0; index < line.length; index += 1) {
        const character = line[index];
        if (escaped) {
            escaped = false;
            continue;
        }
        if (quote === '"' && character === "\\") {
            escaped = true;
            continue;
        }
        if (quote) {
            if (character === quote) quote = undefined;
            continue;
        }
        if (character === '"' || character === "'") {
            quote = character;
            continue;
        }
        if (character === "#") return line.slice(0, index);
    }
    return line;
}

function isCompleteTomlValue(rawValue) {
    const value = rawValue.trim();
    if (value.startsWith('"""')) {
        return value.slice(3).includes('"""');
    }
    if (value.startsWith("'''")) {
        return value.slice(3).includes("'''");
    }

    let quote;
    let escaped = false;
    let squareDepth = 0;
    let curlyDepth = 0;
    for (const character of value) {
        if (escaped) {
            escaped = false;
            continue;
        }
        if (quote === '"' && character === "\\") {
            escaped = true;
            continue;
        }
        if (quote) {
            if (character === quote) quote = undefined;
            continue;
        }
        if (character === '"' || character === "'") {
            quote = character;
        } else if (character === "[") {
            squareDepth += 1;
        } else if (character === "]") {
            squareDepth -= 1;
        } else if (character === "{") {
            curlyDepth += 1;
        } else if (character === "}") {
            curlyDepth -= 1;
        }
    }
    return quote === undefined && squareDepth <= 0 && curlyDepth <= 0;
}

function decodeTomlValue(rawValue) {
    const value = rawValue.trim();
    if (
        (value.startsWith('"""') && value.endsWith('"""')) ||
        (value.startsWith("'''") && value.endsWith("'''"))
    ) {
        return value.slice(3, -3);
    }
    if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
    ) {
        return value.slice(1, -1);
    }
    return value;
}

function parseTokenToml(source, filePath) {
    const tokenHeader = /^\s*\[token\]\s*$/m.exec(source);
    if (!tokenHeader) {
        recordError(`${filePath}: missing [token] section`);
        return {
            prefix: undefined,
            output: undefined,
            imports: [],
            tokens: new Map(),
            lines: new Map(),
        };
    }

    const buildSource = source.slice(0, tokenHeader.index);
    const prefix = /^\s*prefix\s*=\s*["']([^"']+)["']\s*$/m.exec(
        buildSource,
    )?.[1];
    const output = /^\s*output\s*=\s*["']([^"']+)["']\s*$/m.exec(
        buildSource,
    )?.[1];
    const importsSource = /^\s*imports\s*=\s*\[([\s\S]*?)\]/m.exec(
        buildSource,
    )?.[1];
    const imports = importsSource
        ? [...importsSource.matchAll(/["']([^"']+)["']/g)].map(
              (match) => match[1],
          )
        : [];
    const tokenStart = tokenHeader.index + tokenHeader[0].length;
    const firstTokenLine = source.slice(0, tokenStart).split(/\r?\n/).length;
    const tokens = new Map();
    const lines = new Map();
    let pending;

    const finishToken = () => {
        if (!pending) return;
        if (tokens.has(pending.key)) {
            recordError(
                `${filePath}:${pending.line}: duplicate token key ${pending.key}`,
            );
        }
        tokens.set(pending.key, decodeTomlValue(pending.raw));
        lines.set(pending.key, pending.line);
        pending = undefined;
    };

    for (const [index, sourceLine] of source
        .slice(tokenStart)
        .split(/\r?\n/)
        .entries()) {
        const lineNumber = firstTokenLine + index;
        const preserveHash = pending && /^\s*(?:"""|''')/.test(pending.raw);
        const line = preserveHash ? sourceLine : stripTomlComment(sourceLine);
        if (pending) {
            pending.raw += `\n${line}`;
            if (isCompleteTomlValue(pending.raw)) finishToken();
            continue;
        }

        const assignment = /^\s*([A-Za-z0-9_.-]+)\s*=\s*(.*)$/.exec(line);
        if (!assignment) continue;
        pending = { key: assignment[1], raw: assignment[2], line: lineNumber };
        if (isCompleteTomlValue(pending.raw)) finishToken();
    }

    if (pending)
        recordError(
            `${filePath}:${pending.line}: unterminated TOML value for ${pending.key}`,
        );
    return { prefix, output, imports, tokens, lines };
}

function tokenReferences(value) {
    return [...String(value).matchAll(/\$ref\(([^)]+)\)/g)].map(
        (match) => match[1],
    );
}

function flattenedVariable(prefix, key) {
    return `--${prefix}-${key.replaceAll(".", "-")}`;
}

function hasCanonicalFinalProperty(segment) {
    if (cssProperties.has(segment)) return true;
    return terminalStates.some((state) => {
        const suffix = `-${state}`;
        return (
            segment.endsWith(suffix) &&
            cssProperties.has(segment.slice(0, -suffix.length))
        );
    });
}

function l3NameViolations(key) {
    const violations = [];
    const segments = key.split(".");
    if (segments.length < 2)
        violations.push("must include a part and a final CSS property");
    if (!hasCanonicalFinalProperty(segments.at(-1))) {
        violations.push(
            "final segment must be a complete CSS property with at most one terminal state",
        );
    }
    if (
        /\.(?:background\.color|border\.radius|font\.size|box\.shadow|stroke\.color|stroke\.width|z\.index|min\.width)(?:\.|$)/.test(
            `.${key}`,
        )
    ) {
        violations.push(
            "CSS property names must not be split across dot segments",
        );
    }
    const precedingAtoms = segments
        .slice(0, -1)
        .flatMap((segment) => segment.split("-"));
    const misplacedState = precedingAtoms.find((atom) =>
        statePlacementWords.has(atom),
    );
    if (misplacedState) {
        violations.push(
            `state ${misplacedState} must suffix the final CSS property`,
        );
    }
    return violations;
}

function nodeId(tokenPackage, key) {
    return `${tokenPackage.publishedName}::${key}`;
}

function nodeLabel(tokenPackage, key) {
    return `${tokenPackage.name}:${key}`;
}

function resolveReference(tokenPackage, key, packagesByPublishedName) {
    for (const importedName of tokenPackage.imports) {
        const importedPackage = packagesByPublishedName.get(importedName);
        if (importedPackage?.tokens.has(key)) return importedPackage;
    }
    if (tokenPackage.tokens.has(key)) return tokenPackage;
    return undefined;
}

function oklchToRelativeLuminance(value) {
    const match = /^oklch\(\s*([\d.]+)(%)?\s+([\d.]+)\s+([\d.]+)/i.exec(value);
    if (!match) return undefined;
    const lightness = match[2] ? Number(match[1]) / 100 : Number(match[1]);
    const chroma = Number(match[3]);
    const hue = (Number(match[4]) * Math.PI) / 180;
    const a = chroma * Math.cos(hue);
    const b = chroma * Math.sin(hue);
    const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
    const clamp = (channel) => Math.max(0, Math.min(1, channel));
    const red = clamp(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s);
    const green = clamp(
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    );
    const blue = clamp(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s);
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(first, second) {
    return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

function resolveOpaqueColor(
    tokenPackage,
    key,
    packagesByPublishedName,
    seen = new Set(),
) {
    const id = nodeId(tokenPackage, key);
    if (seen.has(id)) return undefined;
    seen.add(id);
    const value = tokenPackage.tokens.get(key);
    if (value === undefined) return undefined;
    if (/^oklch\(/i.test(value)) return value;
    const references = tokenReferences(value);
    if (references.length !== 1) return undefined;
    const targetPackage = resolveReference(
        tokenPackage,
        references[0],
        packagesByPublishedName,
    );
    if (!targetPackage) return undefined;
    return resolveOpaqueColor(
        targetPackage,
        references[0],
        packagesByPublishedName,
        seen,
    );
}

function requireContrast(
    label,
    foregroundPackage,
    foregroundKey,
    backgroundPackage,
    backgroundKey,
    minimum,
    packagesByPublishedName,
) {
    const foreground = resolveOpaqueColor(
        foregroundPackage,
        foregroundKey,
        packagesByPublishedName,
    );
    const background = resolveOpaqueColor(
        backgroundPackage,
        backgroundKey,
        packagesByPublishedName,
    );
    const foregroundLuminance =
        foreground && oklchToRelativeLuminance(foreground);
    const backgroundLuminance =
        background && oklchToRelativeLuminance(background);
    if (
        foregroundLuminance === undefined ||
        backgroundLuminance === undefined
    ) {
        recordError(`${label}: could not resolve opaque OKLCh colors`);
        return;
    }
    const ratio = contrastRatio(foregroundLuminance, backgroundLuminance);
    if (ratio + Number.EPSILON < minimum) {
        recordError(
            `${label}: contrast ${ratio.toFixed(2)}:1 is below ${minimum}:1`,
        );
    }
}

function stripJavaScriptComments(source) {
    let result = "";
    let state = "code";
    let escaped = false;
    for (let index = 0; index < source.length; index += 1) {
        const character = source[index];
        const next = source[index + 1];
        if (state === "line-comment") {
            if (character === "\n") {
                result += character;
                state = "code";
            } else {
                result += " ";
            }
            continue;
        }
        if (state === "block-comment") {
            if (character === "*" && next === "/") {
                result += "  ";
                index += 1;
                state = "code";
            } else {
                result += character === "\n" ? "\n" : " ";
            }
            continue;
        }
        if (state !== "code") {
            result += character;
            if (escaped) {
                escaped = false;
            } else if (character === "\\") {
                escaped = true;
            } else if (
                (state === "single" && character === "'") ||
                (state === "double" && character === '"') ||
                (state === "template" && character === "`")
            ) {
                state = "code";
            }
            continue;
        }
        if (character === "/" && next === "/") {
            result += "  ";
            index += 1;
            state = "line-comment";
        } else if (character === "/" && next === "*") {
            result += "  ";
            index += 1;
            state = "block-comment";
        } else {
            result += character;
            if (character === "'") state = "single";
            if (character === '"') state = "double";
            if (character === "`") state = "template";
        }
    }
    return result;
}

async function sourceFiles(directory) {
    const files = [];
    let entries;
    try {
        entries = await readdir(directory, { withFileTypes: true });
    } catch (error) {
        if (error?.code === "ENOENT") return files;
        throw error;
    }
    for (const entry of entries) {
        if (entry.name === "__tests__") continue;
        const absolutePath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            files.push(...(await sourceFiles(absolutePath)));
        } else if (
            /\.(?:[cm]?[jt]sx?)$/.test(entry.name) &&
            entry.name !== "token.ts"
        ) {
            files.push(absolutePath);
        }
    }
    return files;
}

const componentEntries = (
    await readdir(componentsRoot, { withFileTypes: true })
)
    .filter((entry) => entry.isDirectory())
    .sort((first, second) => first.name.localeCompare(second.name));
const tokenPackages = [];

for (const entry of componentEntries) {
    const packageRoot = path.join(componentsRoot, entry.name);
    let tokenSource;
    try {
        tokenSource = await readFile(
            path.join(packageRoot, "token.toml"),
            "utf8",
        );
    } catch (error) {
        if (error?.code === "ENOENT") continue;
        throw error;
    }
    const packageJson = JSON.parse(
        await readFile(path.join(packageRoot, "package.json"), "utf8"),
    );
    const relativePath = `components/${entry.name}/token.toml`;
    tokenPackages.push({
        name: entry.name,
        publishedName: packageJson.name,
        root: packageRoot,
        relativePath,
        packageJson,
        ...parseTokenToml(tokenSource, relativePath),
    });
}

const packagesByPublishedName = new Map(
    tokenPackages.map((tokenPackage) => [
        tokenPackage.publishedName,
        tokenPackage,
    ]),
);
const globalPackage = packagesByPublishedName.get(globalPackageName);
const semanticPackage = packagesByPublishedName.get(semanticPackageName);
if (!globalPackage || !semanticPackage) {
    throw new Error(
        "rc-token-global and rc-token-semantic must both define token.toml",
    );
}

const flattenedVariables = new Map();
const graph = new Map();
const graphLabels = new Map();
const canonicalTokenKey =
    /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:\.[a-z0-9]+(?:-[a-z0-9]+)*)*$/;
const rawColorPattern =
    /(?:oklch\(\s*[\d.]|rgba?\(\s*[\d.]|hsla?\(\s*[\d.]|(?<![a-z-])(?:oklab|lab|lch|hwb|color)\(|#[\da-f]{3,8}\b)/i;
const cssNamedColors = [
    "aliceblue",
    "antiquewhite",
    "aqua",
    "aquamarine",
    "azure",
    "beige",
    "bisque",
    "black",
    "blanchedalmond",
    "blue",
    "blueviolet",
    "brown",
    "burlywood",
    "cadetblue",
    "chartreuse",
    "chocolate",
    "coral",
    "cornflowerblue",
    "cornsilk",
    "crimson",
    "cyan",
    "darkblue",
    "darkcyan",
    "darkgoldenrod",
    "darkgray",
    "darkgreen",
    "darkgrey",
    "darkkhaki",
    "darkmagenta",
    "darkolivegreen",
    "darkorange",
    "darkorchid",
    "darkred",
    "darksalmon",
    "darkseagreen",
    "darkslateblue",
    "darkslategray",
    "darkslategrey",
    "darkturquoise",
    "darkviolet",
    "deeppink",
    "deepskyblue",
    "dimgray",
    "dimgrey",
    "dodgerblue",
    "firebrick",
    "floralwhite",
    "forestgreen",
    "fuchsia",
    "gainsboro",
    "ghostwhite",
    "gold",
    "goldenrod",
    "gray",
    "green",
    "greenyellow",
    "grey",
    "honeydew",
    "hotpink",
    "indianred",
    "indigo",
    "ivory",
    "khaki",
    "lavender",
    "lavenderblush",
    "lawngreen",
    "lemonchiffon",
    "lightblue",
    "lightcoral",
    "lightcyan",
    "lightgoldenrodyellow",
    "lightgray",
    "lightgreen",
    "lightgrey",
    "lightpink",
    "lightsalmon",
    "lightseagreen",
    "lightskyblue",
    "lightslategray",
    "lightslategrey",
    "lightsteelblue",
    "lightyellow",
    "lime",
    "limegreen",
    "linen",
    "magenta",
    "maroon",
    "mediumaquamarine",
    "mediumblue",
    "mediumorchid",
    "mediumpurple",
    "mediumseagreen",
    "mediumslateblue",
    "mediumspringgreen",
    "mediumturquoise",
    "mediumvioletred",
    "midnightblue",
    "mintcream",
    "mistyrose",
    "moccasin",
    "navajowhite",
    "navy",
    "oldlace",
    "olive",
    "olivedrab",
    "orange",
    "orangered",
    "orchid",
    "palegoldenrod",
    "palegreen",
    "paleturquoise",
    "palevioletred",
    "papayawhip",
    "peachpuff",
    "peru",
    "pink",
    "plum",
    "powderblue",
    "purple",
    "rebeccapurple",
    "red",
    "rosybrown",
    "royalblue",
    "saddlebrown",
    "salmon",
    "sandybrown",
    "seagreen",
    "seashell",
    "sienna",
    "silver",
    "skyblue",
    "slateblue",
    "slategray",
    "slategrey",
    "snow",
    "springgreen",
    "steelblue",
    "tan",
    "teal",
    "thistle",
    "tomato",
    "turquoise",
    "violet",
    "wheat",
    "white",
    "whitesmoke",
    "yellow",
    "yellowgreen",
];
const cssNamedColorSource = cssNamedColors.join("|");
const cssNamedColorPattern = new RegExp(
    `(?<![-\\w])(?:${cssNamedColorSource})(?![-\\w])`,
    "i",
);
const containsRawColor = (value) =>
    rawColorPattern.test(value) || cssNamedColorPattern.test(value);
const usedApprovedDataColorTokens = new Set();
const layerOneVariables = new Set(
    [...globalPackage.tokens.keys()].map((key) =>
        flattenedVariable(globalPackage.prefix, key),
    ),
);

for (const tokenPackage of tokenPackages) {
    const expectedPrefix = tokenPackage.name.replace(/^rc-/, "");
    if (tokenPackage.prefix !== expectedPrefix) {
        recordError(
            `${tokenPackage.relativePath}: prefix must be ${expectedPrefix}`,
        );
    }
    if (tokenPackage.output !== "./src/token.ts") {
        recordError(
            `${tokenPackage.relativePath}: output must be ./src/token.ts`,
        );
    }

    const declaredDependencies = {
        ...tokenPackage.packageJson.dependencies,
        ...tokenPackage.packageJson.devDependencies,
    };
    for (const importedName of tokenPackage.imports) {
        if (!packagesByPublishedName.has(importedName)) {
            recordError(
                `${tokenPackage.relativePath}: imported token package ${importedName} was not found`,
            );
        }
        if (declaredDependencies[importedName] !== "workspace:^") {
            recordError(
                `${tokenPackage.relativePath}: ${importedName} must be declared as workspace:^`,
            );
        }
    }

    for (const [key, value] of tokenPackage.tokens) {
        const id = nodeId(tokenPackage, key);
        graphLabels.set(id, nodeLabel(tokenPackage, key));
        const variable = flattenedVariable(
            tokenPackage.prefix ?? expectedPrefix,
            key,
        );
        const definitions = flattenedVariables.get(variable) ?? [];
        definitions.push({ id, label: nodeLabel(tokenPackage, key) });
        flattenedVariables.set(variable, definitions);

        const edges = [];
        for (const reference of tokenReferences(value)) {
            const targetPackage = resolveReference(
                tokenPackage,
                reference,
                packagesByPublishedName,
            );
            if (!targetPackage) {
                recordError(
                    `${tokenPackage.relativePath}:${tokenPackage.lines.get(key)}: ${key} has unresolved reference ${reference}`,
                );
                continue;
            }
            edges.push(nodeId(targetPackage, reference));
        }
        graph.set(id, edges);
    }
}

for (const [variable, definitions] of flattenedVariables) {
    if (definitions.length > 1) {
        recordError(
            `${variable}: flattened CSS variable collision between ${definitions.map(({ label }) => label).join(", ")}`,
        );
    }
}

for (const tokenPackage of tokenPackages) {
    for (const [key, value] of tokenPackage.tokens) {
        const edges = graph.get(nodeId(tokenPackage, key));
        for (const match of String(value).matchAll(
            /var\(\s*(--[a-z0-9-]+)/gi,
        )) {
            const definitions = flattenedVariables.get(match[1]);
            if (!definitions) {
                recordError(
                    `${tokenPackage.relativePath}:${tokenPackage.lines.get(key)}: ${key} references undefined CSS variable ${match[1]}; use a canonical token instead of an alias`,
                );
            } else if (definitions.length === 1) {
                edges.push(definitions[0].id);
            }
        }
    }
}

const visitState = new Map();
const visitStack = [];
const reportedCycles = new Set();

function visitNode(id) {
    visitState.set(id, 1);
    visitStack.push(id);
    for (const target of graph.get(id) ?? []) {
        if (visitState.get(target) === 1) {
            const cycleStart = visitStack.indexOf(target);
            const cycle = [...visitStack.slice(cycleStart), target].map(
                (node) => graphLabels.get(node),
            );
            const signature = cycle.join(" -> ");
            if (!reportedCycles.has(signature)) {
                reportedCycles.add(signature);
                recordError(`token reference cycle: ${signature}`);
            }
        } else if (!visitState.has(target)) {
            visitNode(target);
        }
    }
    visitStack.pop();
    visitState.set(id, 2);
}

for (const id of graph.keys()) {
    if (!visitState.has(id)) visitNode(id);
}

if (globalPackage.imports.length > 0) {
    recordError(
        `${globalPackage.relativePath}: Layer 1 must not import other token packages`,
    );
}
if (!semanticPackage.imports.includes(globalPackageName)) {
    recordError(
        `${semanticPackage.relativePath}: Layer 2 must import ${globalPackageName}`,
    );
}
for (const key of requiredSemanticKeys) {
    if (!semanticPackage.tokens.has(key)) {
        recordError(
            `${semanticPackage.relativePath}: missing required semantic token ${key}`,
        );
    }
}
for (const [key, value] of semanticPackage.tokens) {
    for (const reference of tokenReferences(value)) {
        const target = resolveReference(
            semanticPackage,
            reference,
            packagesByPublishedName,
        );
        if (target && target !== globalPackage) {
            recordError(
                `${semanticPackage.relativePath}: ${key} must reference Layer 1, not ${target.name}`,
            );
        }
    }
}

for (const tokenPackage of tokenPackages) {
    if (tokenPackage === globalPackage || tokenPackage === semanticPackage)
        continue;
    if (!tokenPackage.imports.includes(semanticPackageName)) {
        recordError(
            `${tokenPackage.relativePath}: Layer 3 must import ${semanticPackageName}`,
        );
    }
    if (tokenPackage.imports.includes(globalPackageName)) {
        recordError(
            `${tokenPackage.relativePath}: Layer 3 must not import ${globalPackageName}`,
        );
    }

    for (const [key, value] of tokenPackage.tokens) {
        const location = `${tokenPackage.relativePath}:${tokenPackage.lines.get(key)}`;
        const exceptionKey = `${tokenPackage.name}:${key}`;
        const nameProblems = [];
        if (!canonicalTokenKey.test(key))
            nameProblems.push("must use lowercase dotted/kebab syntax");
        const nameAtoms = key.split(/[.-]/);
        if (nameAtoms.includes("bg") || nameAtoms.includes("fg")) {
            nameProblems.push(
                "must use background/foreground instead of bg/fg",
            );
        }
        nameProblems.push(...l3NameViolations(key));
        if (nameProblems.length > 0) {
            recordError(
                `${location}: non-canonical L3 token ${key}: ${nameProblems.join("; ")}`,
            );
        }

        if (containsRawColor(value)) {
            const approvedValue = approvedDataColorTokens.get(exceptionKey);
            if (approvedValue !== value) {
                recordError(
                    `${location}: ${key} contains an unapproved raw color literal`,
                );
            } else {
                usedApprovedDataColorTokens.add(exceptionKey);
            }
        }
        for (const match of String(value).matchAll(
            /(--token-global-[a-z0-9-]+)/gi,
        )) {
            if (layerOneVariables.has(match[1])) {
                recordError(
                    `${location}: ${key} directly references Layer 1 CSS variable ${match[1]}`,
                );
            }
        }
        for (const reference of tokenReferences(value)) {
            const target = resolveReference(
                tokenPackage,
                reference,
                packagesByPublishedName,
            );
            if (target && target !== semanticPackage) {
                recordError(
                    `${location}: ${key} must reference Layer 2, not ${target.name}`,
                );
            }
        }
    }
}

for (const exceptionKey of approvedDataColorTokens.keys()) {
    if (!usedApprovedDataColorTokens.has(exceptionKey)) {
        recordError(`stale approved data color token ${exceptionKey}`);
    }
}

for (const textRole of ["primary", "secondary", "tertiary"]) {
    requireContrast(
        `color.text.${textRole} on color.background.surface`,
        semanticPackage,
        `color.text.${textRole}`,
        semanticPackage,
        "color.background.surface",
        4.5,
        packagesByPublishedName,
    );
}
for (const [label, foregroundKey, backgroundKey] of [
    ["default border", "color.border.default", "color.background.surface"],
    ["focus ring", "color.focus.ring", "color.background.surface"],
    [
        "selection border",
        "color.selection.border",
        "color.selection.background",
    ],
    [
        "selection border on surface",
        "color.selection.border",
        "color.background.surface",
    ],
]) {
    requireContrast(
        label,
        semanticPackage,
        foregroundKey,
        semanticPackage,
        backgroundKey,
        3,
        packagesByPublishedName,
    );
}
for (const intent of feedbackIntents) {
    requireContrast(
        `${intent} feedback text`,
        semanticPackage,
        `color.feedback.${intent}.text`,
        semanticPackage,
        `color.feedback.${intent}.background`,
        4.5,
        packagesByPublishedName,
    );
    requireContrast(
        `${intent} feedback solid`,
        semanticPackage,
        `color.feedback.${intent}.on-solid`,
        semanticPackage,
        `color.feedback.${intent}.solid`,
        4.5,
        packagesByPublishedName,
    );
}
for (const [label, foregroundKey, backgroundKey] of [
    [
        "selection foreground",
        "color.selection.foreground",
        "color.selection.background",
    ],
    [
        "highlight foreground",
        "color.highlight.foreground",
        "color.highlight.background",
    ],
]) {
    requireContrast(
        label,
        semanticPackage,
        foregroundKey,
        semanticPackage,
        backgroundKey,
        4.5,
        packagesByPublishedName,
    );
}

const uiColorPattern = new RegExp(
    String.raw`oklch\(\s*(?:[\d.]|\$\{)[^)]*\)|rgba?\(\s*(?:[\d.]|\$\{)[^)]*\)|hsla?\(\s*(?:[\d.]|\$\{)[^)]*\)|(?<![a-z-])(?:oklab|lab|lch|hwb)\(\s*(?:[\d.+-]|\$\{|none\b)[^)]*\)|(?<![a-z-])color\(\s*[a-z][a-z0-9-]*\s+[^)]*\)|#[\da-f]{3,8}\b|(['"])(?:${cssNamedColorSource})\1`,
    "gi",
);
const uiBareNamedColorPattern = new RegExp(
    String.raw`(?:accent-color|background|background-color|border|border-color|border-bottom-color|border-left-color|border-right-color|border-top-color|box-shadow|color|fill|outline|outline-color|stroke|text-decoration-color)\s*:\s*[^;\r\n]*?(?<color>(?<![-\w'".])(?:${cssNamedColorSource})(?![-\w'"]))`,
    "gim",
);
const cssTemplatePattern = /\bcss\s*`(?<body>(?:\\.|[^`])*)`/gs;
for (const entry of componentEntries) {
    const files = await sourceFiles(
        path.join(componentsRoot, entry.name, "src"),
    );
    for (const absolutePath of files) {
        const relativePath = toPosix(
            path.relative(repositoryRoot, absolutePath),
        );
        const source = stripJavaScriptComments(
            await readFile(absolutePath, "utf8"),
        );
        const sourceLines = source.split(/\r?\n/);
        for (const match of source.matchAll(uiColorPattern)) {
            const allowlist = uiRawColorAllowlist.get(relativePath);
            const line = source.slice(0, match.index).split(/\r?\n/).length;
            const sourceLine = sourceLines[line - 1] ?? "";
            if (allowlist?.allows(match[0], sourceLine)) continue;
            recordError(
                `${relativePath}:${line}: raw UI color ${match[0]} is not tokenized`,
            );
        }
        for (const templateMatch of source.matchAll(cssTemplatePattern)) {
            const body = templateMatch.groups?.body ?? "";
            const bodyOffset = templateMatch.index + templateMatch[0].indexOf("`") + 1;
            for (const match of body.matchAll(uiBareNamedColorPattern)) {
                const allowlist = uiRawColorAllowlist.get(relativePath);
                const absoluteIndex = bodyOffset + match.index;
                const line = source
                    .slice(0, absoluteIndex)
                    .split(/\r?\n/).length;
                const sourceLine = sourceLines[line - 1] ?? "";
                const matchedColor = match.groups?.color ?? match[0];
                if (allowlist?.allows(matchedColor, sourceLine)) continue;
                recordError(
                    `${relativePath}:${line}: raw UI color ${matchedColor} is not tokenized`,
                );
            }
        }
    }
}

for (const [relativePath, allowlist] of uiRawColorAllowlist) {
    for (const allowedLine of allowlist.allowedLines) {
        if (!allowlist.usedLines.has(allowedLine)) {
            recordError(
                `${relativePath}: stale raw UI color allowlist line: ${allowedLine}`,
            );
        }
    }
}

if (errors.length > 0) {
    console.error("Token contract check failed:");
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
} else {
    console.log(
        `Token contract check passed for ${tokenPackages.length} token packages.`,
    );
}
