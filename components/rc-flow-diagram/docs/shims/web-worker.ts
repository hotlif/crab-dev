/**
 * Wake Docs scans Browserify's internal `require.resolve("web-worker")` as a
 * bare dependency even though elk.bundled.js already contains its fallback.
 * The layout hook never requests a worker URL, so this docs-only resolution
 * target is intentionally unreachable at runtime.
 */
export default class UnusedWebWorker {
    constructor() {
        throw new Error("The Wake Docs web-worker resolution shim must not be instantiated.");
    }
}
