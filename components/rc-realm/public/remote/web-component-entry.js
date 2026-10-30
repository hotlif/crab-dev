// A real classic-script Module Federation entry, registered only by this request.
globalThis.crabRealmNetworkDemo = {
    init() {},
    async get(moduleId) {
        if (moduleId !== './WebComponent') throw new Error(`Unknown remote module: ${moduleId}`);
        const { createLifecycle } = await import('./web-component.mjs');
        return () => ({ default: createLifecycle() });
    },
};
