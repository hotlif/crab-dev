// Browser tab zoom only: no content script, style injection or device emulation.
globalThis.chrome.runtime.onInstalled.addListener(() => {});
