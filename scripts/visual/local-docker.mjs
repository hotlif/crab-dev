/** Bound CPU requests to the local daemon, including smaller CI runners. */
export function localDockerResources(availableCpus) {
    if (!Number.isInteger(availableCpus) || availableCpus < 1) throw Error('Docker must report a positive CPU count.');
    const cpus = Math.min(6, availableCpus);
    return { cpus, nativeBuildThreads: Math.min(2, cpus) };
}

/** Local-only means the Docker endpoint must also remain on this computer. */
export function assertLocalDockerEndpoint(endpoint) {
    if (typeof endpoint === "string" && (/^npipe:\/\//i.test(endpoint) || /^unix:\/\//i.test(endpoint))) return;
    try {
        const url = new URL(endpoint);
        if (["tcp:", "http:", "https:"].includes(url.protocol) && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) return;
    } catch { /* Produce one actionable diagnostic for malformed endpoints. */ }
    throw Error(`Local visual runs require a local Docker endpoint; received ${endpoint}`);
}
