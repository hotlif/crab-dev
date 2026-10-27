let snapshotSequence = 0;

/** Bind geometry and AX to the same DOM objects while asynchronous demos settle. */
export async function captureControlSnapshot(browser, selector, metricExpression, maxAttempts = 3) {
    const collection = `Array.from(document.querySelectorAll(${JSON.stringify(selector)}))`;
    if (!metricExpression.includes(collection)) throw new Error("Control metric collection was not found");
    const pinnedExpression = metricExpression.replace(collection, "this.elements");
    const changes = [];
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const objectGroup = "crab-control-snapshot-" + ++snapshotSequence;
        try {
            const snapshot = await browser.call("Runtime.evaluate", {
                expression: `(() => {const snapshot={elements:${collection}};snapshot.metrics=(function(){return (${pinnedExpression})}).call(snapshot);return snapshot;})()`,
                returnByValue: false,
                objectGroup,
            });
            if (snapshot.exceptionDetails || !snapshot.result.objectId) throw new Error("Control snapshot could not retain its DOM objects");
            const objectId = snapshot.result.objectId;
            const initial = await browser.call("Runtime.callFunctionOn", { objectId, functionDeclaration: "function(){return this.metrics}", returnByValue: true });
            const metrics = initial.result.value;
            const originalMeasurements = JSON.stringify(metrics.controls);
            for (const control of metrics.controls.filter(control => control.visible || control.focusable && control.ariaHidden)) {
                const retained = await browser.call("Runtime.callFunctionOn", { objectId, functionDeclaration: "function(index){return this.elements[index]}", arguments: [{ value: control.index }], returnByValue: false, objectGroup });
                const elementObjectId = retained.result.objectId;
                if (!elementObjectId) throw new Error("A retained control DOM object is missing");
                try {
                    const { node } = await browser.call("DOM.describeNode", { objectId: elementObjectId });
                    const tree = await browser.call("Accessibility.getPartialAXTree", { backendNodeId: node.backendNodeId, fetchRelatives: false });
                    const ax = tree.nodes.find(entry => entry.backendDOMNodeId === node.backendNodeId);
                    if (!ax) throw new Error("AX response does not identify the retained control backend node");
                    control.backendNodeId = node.backendNodeId;
                    control.accessibleName = ax.name?.value ?? "";
                    control.accessibleRole = ax.role?.value;
                    control.ignored = ax.ignored;
                    control.ignoredReasons = ax.ignoredReasons?.map(reason => reason.name);
                } catch (error) {
                    const attached = await browser.call("Runtime.callFunctionOn", { objectId: elementObjectId, functionDeclaration: "function(){return this.isConnected}", returnByValue: true });
                    if (attached.result.value) throw error;
                    // A removed retained node is an explicit invalidation, not a pass.
                    break;
                } finally {
                    await browser.call("Runtime.releaseObject", { objectId: elementObjectId });
                }
            }
            const after = await browser.call("Runtime.callFunctionOn", { objectId, functionDeclaration: `function(){return (${pinnedExpression})}`, returnByValue: true });
            const identity = await browser.call("Runtime.callFunctionOn", { objectId, functionDeclaration: "function(selector){const current=Array.from(document.querySelectorAll(selector));return current.length===this.elements.length&&current.every((element,index)=>element===this.elements[index]);}", arguments: [{ value: selector }], returnByValue: true });
            const measurementsMatch = originalMeasurements === JSON.stringify(after.result.value.controls);
            const connected = after.result.value.controls.every(control => control.connected);
            if (identity.result.value && measurementsMatch && connected) return { ...metrics, sampling: { attempts: attempt, changes } };
            changes.push({ attempt, collectionMatches: identity.result.value, measurementsMatch, connected });
        } finally {
            await browser.call("Runtime.releaseObjectGroup", { objectGroup });
        }
        // Let the current rendering frame finish, then capture a fresh complete set.
        await browser.evaluate("new Promise(resolve=>requestAnimationFrame(resolve))");
    }
    throw new Error("Control DOM/metric snapshot did not settle within " + maxAttempts + " attempts: " + JSON.stringify(changes));
}
