import { Browser } from "@crab-dev/standards-eslint-preset";
import globals from "globals";

export default [
    ...Browser.react,
    {
        files: [".crustify.ts"],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
    {
        ignores: [".tmp/**", "dist/**", "src/_generated/**"],
    },
];
