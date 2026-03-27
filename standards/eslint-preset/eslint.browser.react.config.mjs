import globals from "globals";
import pluginJs from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import pluginReact from "eslint-plugin-react";
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
            "eslint.config.js",
            "jest.config.mjs"
        ]
    },
    {
        files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
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
            globals: globals.browser,
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
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    pluginReact.configs.flat.recommended,
    {
        plugins: {
            import: pluginImport, 
        },
        settings: {
            react: {
                version: "19.0",
            }
        },
        rules: {
            "no-unused-vars": "off",
            "import/extensions": [
                "error", 
                "ignorePackages", // 忽略 npm 第三方包（例如 import React from 'react' 不需要加后缀）
                {
                    js: "always",
                    jsx: "always",
                    ts: "always",
                    tsx: "always"
                }
            ],
            "react/react-in-jsx-scope": "off",
            "react/jsx-uses-react": "off",
        }
    }
];
