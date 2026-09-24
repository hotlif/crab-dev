import { mkdir, readFile, writeFile } from "node:fs/promises";

// Exercise the actual docs-host stylesheet in the browser regression, without
// requiring a running docs server or duplicating the fix in the test fixture.
const motionCss = await readFile(new URL("../../rc-theme/docs/reduced-motion.css", import.meta.url), "utf8");
await mkdir(new URL("../.fixtures/", import.meta.url), { recursive: true });
await writeFile(new URL("../.fixtures/docs-motion.json", import.meta.url), `${JSON.stringify(motionCss)}\n`);
