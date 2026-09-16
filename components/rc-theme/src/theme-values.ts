export { themeColorContract } from "@crab-dev/rc-token-semantic";

export const themeSelectors = {
    light: ':root, [data-theme="light"]',
    dark: '[data-theme="dark"]',
    forcedColors: "@media (forced-colors: active)",
} as const;
