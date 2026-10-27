/** Only authored component inputs participate in aggregate regeneration. */
export function isComponentDocsSource(filename) {
    const normalized = String(filename).replaceAll("\\", "/");
    return /^rc-[^/]+\/(?:package\.json|token\.toml|docs\/index\.mdx|docs\/demos\/[^/]+\.demo\.tsx|public\/docgen\.json|src\/(?!token\.ts$)(?!.*\/(?:__tests__|__fixtures__)\/).*\.(?:ts|tsx))$/.test(normalized)
        && !/^rc-[^/]+\/src\/(?:__tests__|__fixtures__)\//.test(normalized);
}
