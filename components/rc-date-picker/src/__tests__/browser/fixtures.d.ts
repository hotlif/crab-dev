declare module '*/.cache/browser-css.json' {
    const css: string;
    export default css;
}

declare module '*/esm/index.mjs' {
    export const DatePicker: typeof import('../../datePicker/datePicker.js')['default'];
    export default DatePicker;
    export const DateTimePicker: typeof import('../../dateTimePicker/dateTimePicker.js')['default'];
    export const TimePicker: typeof import('../../timePicker/timePicker.js')['default'];
}

declare module '*/.cache/viewport-demo.mjs' {
    const ActualDateDemo: typeof import('../../../docs/demos/datePicker.demo.js')['default'];
    export default ActualDateDemo;
}
