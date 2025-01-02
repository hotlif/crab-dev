
import { describe, it, expect } from "@jest/globals";
import Webpack, { type Configuration, type Stats } from "webpack"; 
import MemoryFS from 'memory-fs';
import MiniExtractPlugin from "mini-css-extract-plugin";
import TerserWebpackPlugin from "terser-webpack-plugin";
import { join } from 'path';
import ReactWebpackPlugin, { generateHtml } from '../ReactWebpackPlugin';

const compile = (config: Configuration) => {
    const compiler = Webpack(config);
    const memoryFs = new MemoryFS();
    compiler.outputFileSystem = memoryFs as any;
    return new Promise<{ error: Error | null, stats?: Stats, fs: MemoryFS }>((resolve, reject) => {
        compiler.run((err, stats) => {
            if (err || stats?.hasErrors()) {
                console.error(stats?.toString())
            }
            resolve({ stats, fs: memoryFs, error: err });
        });
    });
}

describe('ReactWebpackPlugin', () => {
    it('should generate HTML with script and link tags', async () => {
        const template = () => <html><head></head><body></body></html>;
        const entrys = ['main.js', 'styles.css'];
        const html = await generateHtml(template, entrys);
        expect(html).toContain('<script src="/main.js"></script>');
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
        expect(html).toContain('<script src="/main.js"></script>');
        expect(html).toContain('<link rel="stylesheet" href="/styles.css"></link>');
        expect(html).toContain('<title>Styleify - 原子化 CSS 框架</title>');
        expect(html).toContain('<html lang="zh-CN">');
        expect(html).toContain('<meta name="viewport" content="width=device-width, initial-scale=1.0"/>');
        expect(html).toContain('<meta charSet="UTF-8"/>');
        expect(html).toContain('<div id="root"></div>');
    });

    it('should generate HTML with Webpack configuration', async () => {
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
    
        const config: Configuration = {
            mode: "production",
            entry: join(__dirname, 'index.js'),
            output: {
                path: '/dist',
                filename: 'bundle.js'
            },
            module: {
                rules: [{
                    test: /\.css$/i,
                    use: [
                        MiniExtractPlugin.loader,
                        require.resolve("css-loader"),
                    ],
                }]
            },
            optimization: {
                minimize: true,
                minimizer: [
                    new TerserWebpackPlugin({
                        terserOptions: {
                            format: {
                                comments: false
                            }
                        },
                        extractComments: false
                    }),
                ]
            },
            plugins: [
                new ReactWebpackPlugin({
                    template
                }),
                new MiniExtractPlugin()
            ]
        };
        const { error, fs } = await compile(config);
        expect(error).toBeNull();
        expect(fs.existsSync('/dist')).toBe(true);
        expect(fs.existsSync('/dist/bundle.js')).toBe(true);
        expect(fs.existsSync('/dist/index.html')).toBe(true);
        const html = fs.readFileSync('/dist/index.html', 'utf-8');
        const js = fs.readFileSync('/dist/bundle.js', 'utf-8');
        expect(js).toContain('console.log("Hello World")');
        expect(html).toContain('<title>Styleify - 原子化 CSS 框架</title>');
        expect(html).toContain('<html lang="zh-CN">');
        expect(html).toContain('<meta name="viewport" content="width=device-width, initial-scale=1.0"/>');
        expect(html).toContain('<meta charSet="UTF-8"/>');
        expect(html).toContain('<div id="root"></div>');
        expect(html).toContain('<script src="/bundle.js"></script>');
        expect(html).toMatchSnapshot();
    });
});
