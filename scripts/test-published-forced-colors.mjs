import { parsePublishedVisualOptions, runPublishedVisualJob } from "./visual/published-job.mjs";

process.exitCode = await runPublishedVisualJob(parsePublishedVisualOptions(process.argv.slice(2)));
