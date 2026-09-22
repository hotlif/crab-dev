// Deliberately accepts the literal, dotted-key subset used by this package.
// Fail closed when the source grows new syntax: never silently omit a token.
export function readGlobalTokens(source) {
    let section = "";
    let prefix = "token-global";
    const entries = [];
    const seen = new Set();
    for (const [index, original] of source.split(/\r?\n/).entries()) {
        const line = original.trim();
        if (!line || line.startsWith("#")) continue;
        if (/^\[[\w-]+\]$/.test(line)) { section = line.slice(1, -1); continue; }
        if (section === "build" && line.startsWith("prefix")) {
            const prefixMatch = line.match(/^prefix\s*=\s*"([\w-]+)"\s*(?:#.*)?$/);
            if (!prefixMatch) throw new Error("Global token reference: unsupported prefix");
            prefix = prefixMatch[1];
        }
        if (section !== "token") continue;
        const match = line.match(/^([\w.-]+)\s*=\s*("(?:[^"\\]|\\.)*")\s*(?:#.*)?$/);
        if (!match) throw new Error(`Global token reference: unsupported syntax at line ${index + 1}`);
        const [, key, literal] = match;
        if (seen.has(key)) throw new Error(`Duplicate global token: ${key}`);
        seen.add(key);
        const value = JSON.parse(literal);
        const group = /^(material|purple|zinc|blue|red|green|amber)\./.test(key) || key === "white" || key === "black"
            ? "colors" : key.startsWith("font.") || key.startsWith("line.") ? "typography"
                : /^(duration|easing)\./.test(key) ? "motion" : key.startsWith('size.') ? 'space' : key.split(".")[0];
        if (!["colors", "space", "radius", "typography", "shadow", "motion", "opacity", "z-index"].includes(group)) {
            throw new Error(`Unmapped global token category: ${key}`);
        }
        const expression = "globalToken" + key.split(".").map(part => /^[a-zA-Z_$][\w$]*$/.test(part) ? `.${part}` : `[${JSON.stringify(part)}]`).join("");
        entries.push({ key, value, group, expression, variable: `--${prefix}-${key.replaceAll(".", "-")}` });
    }
    if (!entries.length) throw new Error("Global token reference: empty token table");
    return entries;
}

function sampleStyle(entry, index) {
    const ref = `\${${entry.expression}}`;
    if (entry.group === "colors") return `background: ${ref};`;
    if (entry.group === "space") return `width: ${ref};`;
    if (entry.group === "radius") return `border-radius: ${ref};`;
    if (entry.group === "shadow") return `box-shadow: ${ref};`;
    if (entry.group === "opacity") return `opacity: ${ref};`;
    if (entry.group === "z-index") return `z-index: ${ref}; top: calc(\${globalToken.space[2]} * ${index}); left: calc(\${globalToken.space[3]} * ${index});`;
    if (entry.key.startsWith("font.family.")) return `font-family: ${ref};`;
    if (entry.key.startsWith("font.size.")) return `font-size: ${ref};`;
    if (entry.key.startsWith("font.weight.")) return `font-weight: ${ref};`;
    if (entry.key.startsWith("line.height.")) return `line-height: ${ref};`;
    if (entry.key.startsWith("duration.")) return `transition-duration: ${ref};`;
    return `transition-timing-function: ${ref};`;
}

export function createTokenReferenceData(source) {
    const entries = readGlobalTokens(source);
    const layerEntries = entries.filter(entry => entry.group === "z-index");
    return `// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.\n// Source: components/rc-token-global/token.toml\n// Reset only the sampled variable so site overrides cannot replace its public fallback.\nimport { css } from "@crab-dev/css";\nimport globalToken from "@crab-dev/rc-token-global";\n\nexport const tokenEntries = [\n${entries.map(entry => `    { ...${JSON.stringify(entry)}, sampleClass: css\`&.tgr-item[data-token-key] .tgr-sample { ${entry.variable}: initial; ${sampleStyle(entry, layerEntries.indexOf(entry))} }\` },`).join("\n")}\n];\n`;
}
