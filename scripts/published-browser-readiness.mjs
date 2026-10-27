/** Own-process DevTools startup only; no page, media or fixture acceptance. */
export function browserErrorDetails(error, depth = 0) {
    if (!error || typeof error !== 'object') return { message: String(error) };
    const details = { name: error.name, message: error.message };
    for (const key of ['code', 'errno', 'syscall', 'address', 'port']) if (error[key] !== undefined) details[key] = error[key];
    if (error.cause !== undefined && depth < 3) details.cause = browserErrorDetails(error.cause, depth + 1);
    return details;
}

export async function waitForOwnDevTools({ readPort, processState, processExited, trace, fetchImpl = globalThis.fetch, timeoutMs = 10000, pollMs = 40 }) {
    const started = performance.now(), controller = new AbortController();
    Object.assign(trace, { startedAt: new Date().toISOString(), timeoutMs, portReads: [], requests: [], status: 'waiting' });
    let finish = false, rejectStop;
    const stopped = new Promise((_, reject) => { rejectStop = reject; });
    const stop = error => { if (!finish) { controller.abort(error); rejectStop(error); } };
    const timer = setTimeout(() => stop(Error('Timed out: own Chrome DevTools readiness')), timeoutMs);
    const exitError = state => Error('Own Chrome exited before DevTools readiness: ' + JSON.stringify(state));
    processExited.then(state => stop(exitError(state)));
    const alive = () => {
        const state = processState();
        if (state.launchError || state.exitCode !== null || state.signalCode !== null) throw exitError(state);
        if (controller.signal.aborted) throw controller.signal.reason;
    };
    const withinBudget = operation => Promise.race([Promise.resolve().then(operation), stopped]);
    try {
        while (true) {
            alive();
            let port;
            const portRead = { elapsedMs: performance.now() - started };
            try { port = await withinBudget(readPort); portRead.port = Number.isFinite(port) ? port : null; }
            catch (error) { if (controller.signal.aborted) throw controller.signal.reason; portRead.error = browserErrorDetails(error); }
            trace.portReads.push(portRead);
            alive();
            if (Number.isInteger(port) && port > 0 && port <= 65535) {
                const endpoint = `http://127.0.0.1:${port}/json/list`, request = { endpoint, elapsedMs: performance.now() - started, status: null };
                trace.requests.push(request);
                try {
                    const response = await withinBudget(() => fetchImpl(endpoint, { signal: controller.signal }));
                    request.status = response.status;
                    if (!response.ok) {
                        await withinBudget(() => response.body?.cancel());
                        throw Error('DevTools HTTP status ' + response.status);
                    }
                    const targets = await withinBudget(() => response.json());
                    if (!Array.isArray(targets)) throw Error('DevTools target response is not an array');
                    alive();
                    request.ready = true; trace.status = 'ready';
                    return { port, targets, endpoint };
                } catch (error) {
                    request.error = browserErrorDetails(error);
                    if (controller.signal.aborted) throw controller.signal.reason;
                    alive();
                } finally { request.finishedElapsedMs = performance.now() - started; }
            }
            await withinBudget(() => new Promise(resolve => setTimeout(resolve, pollMs)));
        }
    } catch (error) {
        trace.status = 'failed'; trace.error = browserErrorDetails(error); throw error;
    } finally {
        finish = true; clearTimeout(timer); controller.abort();
        trace.finishedAt = new Date().toISOString(); trace.elapsedMs = performance.now() - started; trace.processState = processState();
    }
}
