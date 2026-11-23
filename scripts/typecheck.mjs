import { readFileSync, statSync } from "node:fs";
import { resolve, relative, join } from "node:path";
import { parseArgs } from "node:util";
import { API } from "typescript/unstable/async";
import { typecheckFileSystem } from "./typescript-pnp-fs.mjs";

const { values } = parseArgs({ options: { project: { type: "string", short: "p", default: "tsconfig.json" }, noEmit: { type: "boolean" } } });
const path = resolve(values.project);
const config = statSync(path).isDirectory() ? join(path, "tsconfig.json") : path;
const { fs, sourcePath } = typecheckFileSystem(config);
const api = new API({ cwd: process.cwd(), fs });

function message(diagnostic, indent = "") {
    return [indent + diagnostic.text, ...(diagnostic.messageChain ?? []).map(child => message(child, indent + "  "))].join("\n");
}

try {
    const snapshot = await api.updateSnapshot({ openProjects: [config] });
    const project = snapshot.getProject(config);
    if (!project) throw new Error(`TypeScript could not open ${config}`);
    const program = project.program;
    const diagnostics = [
        ...await program.getConfigFileParsingDiagnostics(),
        ...await program.getProgramDiagnostics(),
        ...await program.getGlobalDiagnostics(),
        ...await program.getSyntacticDiagnostics(),
        ...await program.getBindDiagnostics(),
        ...await program.getSemanticDiagnostics(),
        ...(project.compilerOptions.declaration || project.compilerOptions.composite ? await program.getDeclarationDiagnostics() : []),
    ];
    const lines = new Set();
    const sources = new Map();
    for (const diagnostic of diagnostics) {
        let location = "";
        if (diagnostic.fileName) {
            const file = sourcePath(diagnostic.fileName);
            if (!sources.has(file)) sources.set(file, readFileSync(file, "utf8"));
            const before = sources.get(file).slice(0, diagnostic.pos).split(/\r\n|[\r\n\u2028\u2029]/);
            location = `${relative(process.cwd(), file)}(${before.length},${before.at(-1).length + 1}): `;
        }
        lines.add(`${location}error TS${diagnostic.code}: ${message(diagnostic)}`);
    }
    for (const line of lines) console.error(line);
    if (lines.size) process.exitCode = 2;
} finally {
    await api.close();
}
