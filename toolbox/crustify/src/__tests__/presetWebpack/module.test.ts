import { describe, it, expect } from "@jest/globals";
import presetModule from "../../presetWebpack/module.js";

type RuleItem = {
    test?: RegExp;
    type?: string;
    parser?: { dataUrlCondition?: { maxSize?: number } };
    use?: unknown[];
    exclude?: RegExp;
};

const asRuleItems = (rules: unknown[]): RuleItem[] =>
    rules.filter((r): r is RuleItem => typeof r === 'object' && r !== null);

describe("presetModule — static asset rules", () => {
    it("should include image asset/resource rule covering png/jpg/gif/webp/avif", async () => {
        const config = await presetModule({ isProduction: false });
        const rules = asRuleItems(config.module?.rules ?? []);
        const rule = rules.find(r => r.type === 'asset/resource' && r.test?.source.includes('png'));
        expect(rule).toBeDefined();
        expect(rule?.test?.test('photo.jpg')).toBe(true);
        expect(rule?.test?.test('image.gif')).toBe(true);
        expect(rule?.test?.test('picture.webp')).toBe(true);
        expect(rule?.test?.test('photo.avif')).toBe(true);
    });

    it("should include SVG asset rule with 4 KiB dataUrlCondition", async () => {
        const config = await presetModule({ isProduction: false });
        const rules = asRuleItems(config.module?.rules ?? []);
        const rule = rules.find(r => r.type === 'asset' && r.test?.source.includes('svg'));
        expect(rule).toBeDefined();
        expect(rule?.parser?.dataUrlCondition?.maxSize).toBe(4 * 1024);
    });

    it("should include font asset/resource rule covering woff/woff2/eot/ttf/otf", async () => {
        const config = await presetModule({ isProduction: false });
        const rules = asRuleItems(config.module?.rules ?? []);
        const rule = rules.find(r => r.type === 'asset/resource' && r.test?.source.includes('woff'));
        expect(rule).toBeDefined();
        expect(rule?.test?.test('font.woff2')).toBe(true);
        expect(rule?.test?.test('font.eot')).toBe(true);
        expect(rule?.test?.test('font.ttf')).toBe(true);
        expect(rule?.test?.test('font.otf')).toBe(true);
    });
});

describe("presetModule — CSS rules", () => {
    it("should use style-loader in development mode", async () => {
        const config = await presetModule({ isProduction: false });
        const rules = asRuleItems(config.module?.rules ?? []);
        const cssRule = rules.find(r => r.test?.test('x.css'));
        const loaders = (cssRule?.use ?? []).map(u => (typeof u === 'string' ? u : ''));
        expect(loaders.some(l => l.includes('style-loader'))).toBe(true);
    });

    it("should not use style-loader in production mode", async () => {
        const config = await presetModule({ isProduction: true });
        const rules = asRuleItems(config.module?.rules ?? []);
        const cssRule = rules.find(r => r.test?.test('x.css'));
        const loaders = (cssRule?.use ?? []).map(u => (typeof u === 'string' ? u : ''));
        expect(loaders.some(l => l.includes('style-loader'))).toBe(false);
    });
});

describe("presetModule — TSX / MDX rules", () => {
    it("should include TSX rule with babel-loader and wyw-in-js loader", async () => {
        const config = await presetModule({ isProduction: false });
        const rules = asRuleItems(config.module?.rules ?? []);
        const tsxRule = rules.find(r => r.test?.test('component.tsx') && r.exclude != null);
        expect(tsxRule).toBeDefined();
        const loaderNames = (tsxRule?.use ?? []).map(u =>
            typeof u === 'string' ? u : (u as { loader?: string })?.loader ?? ''
        );
        expect(loaderNames.some(l => l.includes('babel-loader'))).toBe(true);
        expect(loaderNames.some(l => l.includes('wyw-in-js'))).toBe(true);
    });

    it("should include MDX rule", async () => {
        const config = await presetModule({ isProduction: false });
        const rules = asRuleItems(config.module?.rules ?? []);
        const mdxRule = rules.find(r => r.test?.test('page.mdx'));
        expect(mdxRule).toBeDefined();
    });
});
