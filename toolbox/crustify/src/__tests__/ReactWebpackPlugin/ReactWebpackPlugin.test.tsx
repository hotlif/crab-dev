
import { describe, it, expect, jest } from "@jest/globals";

import { type Compiler } from "webpack";
import { createElement } from "react";
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const MockComponent = () => createElement('html', null,
    createElement('head', null),
    createElement('body', null)
);

jest.unstable_mockModule("unconfig", () => ({
    loadConfig: jest.fn<(...args: unknown[]) => Promise<unknown>>().mockResolvedValue({
        config: MockComponent
    }),
}));

const { default: ReactWebpackPlugin, generateHtml } = await import('../../plugins/ReactWebpackPlugin.js');

describe('ReactWebpackPlugin', () => {
    it('should generate HTML with script and link tags', async () => {
        const template = () => <html><head></head><body></body></html>;
        const entrys = ['main.js', 'styles.css'];
        const html = await generateHtml(template, entrys);
        expect(html).toContain('<script defer src="/main.js"></script>');
        expect(html).toContain('<link rel="stylesheet" href="/styles.css"></link>');
        expect(html).toContain('</head>');
    });

    it('should generate HTML with correct meta tags and content', async () => {
        const template = () => (
            <html lang="zh-CN">
                <head>
                    <meta charSet="UTF-8"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Styleify - 原子化 CSS 框架</title>
                </head>
                <body>
                    <div id="root"></div>
                </body>
            </html>
        );
        const entrys = ['main.js', 'styles.css'];
        const html = await generateHtml(template, entrys);
        expect(html).toContain('<script defer src="/main.js"></script>');
        expect(html).toContain('<link rel="stylesheet" href="/styles.css"></link>');
        expect(html).toContain('<title>Styleify - 原子化 CSS 框架</title>');
        expect(html).toContain('<html lang="zh-CN">');
        expect(html).toContain('<meta name="viewport" content="width=device-width, initial-scale=1.0"/>');
        expect(html).toContain('<meta charSet="UTF-8"/>');
        expect(html).toContain('<div id="root"></div>');
    });

    it('should handle entries with unknown extensions', async () => {
        const template = () => <html><head></head><body></body></html>;
        const entrys = ['main.js', 'image.png'];
        const html = await generateHtml(template, entrys);
        expect(html).toContain('<script defer src="/main.js"></script>');
        expect(html).not.toContain('image.png');
    });

    it('should apply modifyBootstrapPath from mods', () => {
        const mods = [{
            modifyBootstrapPath: () => "/custom/path"
        }];
        const plugin = new ReactWebpackPlugin({
            cwd: __dirname,
            mods
        });
        expect((plugin as unknown as { bootstrapPath: string }).bootstrapPath).toBe("/custom/path");
    });

    it('should keep original path if modifyBootstrapPath returns non-string', () => {
        const mods = [{
            modifyBootstrapPath: () => undefined as unknown as string
        }];
        const plugin = new ReactWebpackPlugin({
            cwd: __dirname,
            mods
        });
        expect((plugin as unknown as { bootstrapPath: string }).bootstrapPath).toBe(__dirname);
    });

    it('should register hooks and generate index.html via apply', async () => {
        const plugin = new ReactWebpackPlugin({
            cwd: __dirname,
        });

        const fileDeps = new Set<string>();
        let processAssetsCallback: ((assets: Record<string, unknown>) => Promise<void>) | null = null;

        const mockCompiler = {
            hooks: {
                afterCompile: {
                    tap: (_name: string, callback: (compilation: { fileDependencies: Set<string> }) => void) => {
                        callback({ fileDependencies: fileDeps });
                    }
                },
                thisCompilation: {
                    tap: (_name: string, callback: (compilation: { hooks: { processAssets: { tapPromise: (opts: unknown, cb: (assets: Record<string, unknown>) => Promise<void>) => void } } }) => void) => {
                        callback({
                            hooks: {
                                processAssets: {
                                    tapPromise: (_opts: unknown, cb: (assets: Record<string, unknown>) => Promise<void>) => {
                                        processAssetsCallback = cb;
                                    }
                                }
                            }
                        });
                    }
                }
            }
        };

        plugin.apply(mockCompiler as unknown as Compiler);

        // afterCompile should add bootstrap.tsx to file dependencies
        expect(fileDeps.size).toBe(1);
        const dep = [...fileDeps][0];
        expect(dep).toContain("bootstrap.tsx");

        // Trigger processAssets with mock assets
        expect(processAssetsCallback).not.toBeNull();
        const assets: Record<string, unknown> = {
            "main.bundle.js": {},
            "styles.css": {},
            "image.png": {},
        };

        await processAssetsCallback!(assets);

        expect(assets["index.html"]).toBeDefined();
        const html = (assets["index.html"] as { source: () => string }).source();
        expect(html).toContain('<html');
        expect(html).toContain('<script defer src="/main.bundle.js"></script>');
        expect(html).toContain('<link rel="stylesheet" href="/styles.css"></link>');
    });
});
