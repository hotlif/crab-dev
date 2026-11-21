/**
 * These demos exercise their own navigation, page reload or workbench-relative
 * runtime resources, so the link opens the workbench as a separate page.
 * @param {string} id
 */
export function isStandaloneDemo(id) {
    return id.startsWith("rc-pdf-editor/")
        || id === "rc-realm/docs/demos/network-web-component.demo.tsx"
        || id === "rc-router/docs/demos/basic.demo.tsx"
        || id === "rc-table-pro/docs/demos/state-persistence.demo.tsx";
}
