import { Browser } from "@crab-dev/standards-eslint-preset";
import globals from "globals";

export default [
    ...Browser.react,
    {
        files: ["scripts/**/*.mjs"],
        languageOptions: {
            globals: globals.node,
        },
    },
    {
        ignores: [".tmp/**", ".wake/**", "docs-dist/**"],
    },
];
