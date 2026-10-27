import assert from "node:assert/strict";
import { captureControlSnapshot } from "./control-inventory-snapshot.mjs";

const selector = "button";
const expression = '({controls:Array.from(document.querySelectorAll("button")).map((el,index)=>({index,connected:el.isConnected,visible:true,focusable:true,ariaHidden:false}))})';
const control = { index: 0, connected: true, visible: true, focusable: true, ariaHidden: false };
function fixture({ identity = [true], measurements = [true], wrongBackend = false } = {}) {
    let attempt = 0;
    const released = [];
    const requestedBackends = [];
    return {
        released, requestedBackends,
        evaluate: async () => undefined,
        async call(method, options) {
            if (method === "Runtime.evaluate") {
                attempt++;
                assert.ok(options.expression.includes("this.elements.map"));
                return { result: { objectId: "snapshot-" + attempt } };
            }
            if (method === "Runtime.releaseObject") { released.push(options.objectId); return {}; }
            if (method === "Runtime.releaseObjectGroup") { released.push("group"); return {}; }
            if (method === "DOM.describeNode") { assert.equal(options.objectId, "element-" + attempt); return { node: { backendNodeId: 91 } }; }
            if (method === "Accessibility.getPartialAXTree") { requestedBackends.push(options.backendNodeId); return { nodes: [{ backendDOMNodeId: wrongBackend ? 92 : 91, ignored: false, name: { value: "Zoom" }, role: { value: "spinbutton" } }] }; }
            if (method === "Runtime.callFunctionOn") {
                if (options.functionDeclaration.includes("this.isConnected")) return { result: { value: true } };
                if (options.functionDeclaration.includes("current.length")) return { result: { value: identity[attempt - 1] ?? identity.at(-1) } };
                if (options.functionDeclaration.includes("this.elements[index]")) return { result: { objectId: "element-" + attempt } };
                const changed = !options.functionDeclaration.includes("this.metrics") && !(measurements[attempt - 1] ?? measurements.at(-1));
                return { result: { value: { controls: [{ ...control, ...(changed ? { focusable: false } : {}) }] } } };
            }
            throw new Error("Unexpected method " + method);
        },
    };
}
const stable = fixture();
const result = await captureControlSnapshot(stable, selector, expression);
assert.equal(result.controls[0].backendNodeId, 91);
assert.equal(result.controls[0].accessibleName, "Zoom");
assert.equal(result.sampling.attempts, 1);
assert.deepEqual(result.sampling.changes, []);
assert.deepEqual(stable.requestedBackends, [91]);
assert.deepEqual(stable.released, ["element-1", "group"]);

const inserted = await captureControlSnapshot(fixture({ identity: [false, true] }), selector, expression);
assert.equal(inserted.sampling.attempts, 2);
assert.equal(inserted.sampling.changes[0].collectionMatches, false);
const changed = await captureControlSnapshot(fixture({ measurements: [false, true] }), selector, expression);
assert.equal(changed.sampling.attempts, 2);
assert.equal(changed.sampling.changes[0].measurementsMatch, false);
await assert.rejects(captureControlSnapshot(fixture({ identity: [false] }), selector, expression), /within 3 attempts/);
await assert.rejects(captureControlSnapshot(fixture({ wrongBackend: true }), selector, expression), /retained control backend node/);
await assert.rejects(captureControlSnapshot(fixture(), selector, "({controls:[]})"), /metric collection was not found/);
const failing = fixture();
const ordinaryCall = failing.call;
failing.call = async (method, options) => {
    if (method === "Runtime.evaluate") throw new Error("capture failed");
    return ordinaryCall(method, options);
};
await assert.rejects(captureControlSnapshot(failing, selector, expression), /capture failed/);
assert.deepEqual(failing.released, ["group"], "failed capture must release its object group");
console.log("7 control snapshot contract scenarios passed: identity, insertion, metric change, retry bound, wrong backend, missing metric collection and failure cleanup.");
