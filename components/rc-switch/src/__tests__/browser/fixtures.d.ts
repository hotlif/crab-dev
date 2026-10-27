// The fixture consumes real public ESM; typechecking need not build it first.
declare module '*/esm/index.mjs' {
    const Switch: typeof import('../../switch.js')['default'];
    export default Switch;
}
