import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { buildContext } from "./ai-context/context.mjs";
import { formatContext } from "./ai-context/format.mjs";

export { buildContext, formatContext };
export { inheritedRules } from "./ai-context/paths.mjs";

export async function main(args = process.argv.slice(2)) {
    if (args.includes("--help")) {
        console.log("yarn ai:context <包名或仓库相对路径，默认 .> [--json] [--dependents]\n只读查询；所有文件路径相对仓库根，反向关系仅列直接使用方。");
        return;
    }
    const flags = new Set(["--json", "--dependents"]);
    const unknown = args.find(arg => arg.startsWith("-") && !flags.has(arg));
    if (unknown) throw new Error(`未知选项：${unknown}`);
    const targets = args.filter(arg => !flags.has(arg));
    if (targets.length > 1) throw new Error("一次只查询一个包或路径。");
    const context = await buildContext(targets[0] ?? ".", { dependents: args.includes("--dependents") });
    process.stdout.write(args.includes("--json") ? `${JSON.stringify(context, null, 2)}\n` : formatContext(context));
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    try { await main(); }
    catch (error) { console.error(error.message); process.exitCode = 1; }
}
