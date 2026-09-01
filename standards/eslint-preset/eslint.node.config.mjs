import globals from "globals";
import pluginJs from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import pluginImport from "eslint-plugin-import";

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        ignores: [
            "**/.cache/",
            "**/.tmp/",
            "**/cjs/",
            "**/coverage/",
            "**/css/",
            "**/declarations/",
            "**/esm/",
            "eslint.config.js"
        ]
    },
    {
        files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    },
    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                warnOnUnsupportedTypeScriptVersion: false,
            },
            globals: globals.node,
        },
        plugins: {
            "@typescript-eslint": tsPlugin,
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,
            "indent": ["error", 4, { "SwitchCase": 1 }],
            "@typescript-eslint/no-unused-vars": "warn",
        }
    },
    { languageOptions: { globals: globals.node } },
    pluginJs.configs.recommended,
    {
        plugins: {
            import: pluginImport, 
        },
        rules: {
            "no-unused-vars": "off",
            "import/extensions": [
                "error", 
                "ignorePackages",
                {
                    js: "always",
                    ts: "always",
                    tsx: "always",
                }
            ],
        }
    }
];
