
import { describe, it, expect } from "@jest/globals";
import { type Configuration } from "webpack"; 

import MiniExtractPlugin from "mini-css-extract-plugin";
import TerserWebpackPlugin from "terser-webpack-plugin";
import { join } from 'path';
import { createRequire } from "module";
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
    
import ReactWebpackPlugin, { generateHtml } from '../../ReactWebpackPlugin';
import { compile, babelLoader } from "../util";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
});
