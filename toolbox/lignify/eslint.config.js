import { Browser, Node } from "@crab-dev/standards-eslint-preset";
import globals from "globals";

export default [
    ...Node,
    {
        files: ["template/**/*.{ts,tsx}"],
        languageOptions: {
            globals: globals.browser,
        },
    },
];
