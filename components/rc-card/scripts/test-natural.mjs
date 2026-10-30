import path from "node:path";
import { fileURLToPath } from "node:url";
import { runPublishedVisualJob } from "../../../scripts/visual/published-job.mjs";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.exitCode = await runPublishedVisualJob({
    kind: "natural", packageRoot,
    entry: path.join(packageRoot, "src/__tests__/browser/natural-fixture.tsx"),
    api: "__cardNatural", forcedColors: false, reducedMotion: false,
});
