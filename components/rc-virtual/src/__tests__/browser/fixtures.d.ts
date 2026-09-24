// The browser-test command generates this fixture from the shared docs CSS.
// Keep typechecking independent of whether browser tests have run locally.
declare module "*/.fixtures/docs-motion.json" {
    const css: string;
    export default css;
}
