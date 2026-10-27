declare module '*/.cache/browser-css.json' {
    const css: string;
    export default css;
}

// The required suite builds the published entry before execution. Typechecking
// uses the source signatures so a clean checkout needs no generated fixture.
declare module '*/esm/index.mjs' {
    const Form: typeof import('../../form.js')['default'];
    const Item: typeof import('../../item.js')['default'];
    const useForm: typeof import('../../hooks/useForm.js')['default'];
    export { Item, useForm };
    export default Form;
}
