import { css } from '@crab-dev/css';
import token from '@crab-dev/rc-token-semantic';
import Prose, { type ProseSize } from '@crab-dev/rc-prose';

export const meta = {
    title: '正色与逆色内容',
    description: '四档文章字阶分别展示普通与 invert 排版。逆色容器使用当前主题的 inverse 背景，随明暗模式改变；内容覆盖中文、长链接、代码、表格和键盘提示。',
};

const stackStyle = css`display: grid; gap: ${token.space['group-gap']}; min-width: 0;`;
const surfaceStyle = css`padding: ${token.space['card-padding']}; background: ${token.color.surface.content}; min-width: 0;`;
const inverseStyle = css`padding: ${token.space['card-padding']}; background: ${token.color.background.inverse}; min-width: 0;`;
const sizes: ProseSize[] = ['sm', 'base', 'lg', 'xl'];

export default function VisualStatesDemo() {
    return <div className={stackStyle}>
        {sizes.map(size => [false, true].map(invert => <section
            key={`${size}-${invert}`}
            className={invert ? inverseStyle : surfaceStyle}
            aria-label={`${size} ${invert ? 'inverse' : 'default'}`}
        >
            <Prose size={size} invert={invert} as="article">
                <h2>{size} · {invert ? '逆色排版' : '普通排版'}</h2>
                <p className="lead">中文与 English 内容保持清晰的阅读层级。</p>
                <p>正文包含 <strong>重要信息</strong>、<em>补充说明</em>、<code>inlineCode</code> 和 <kbd>Enter</kbd>。使用键盘访问下方长链接，核对换行与焦点。</p>
                <p><a href="#prose-visual-end">https://example.com/documentation/long-continuous-reference-for-typography-and-overflow</a></p>
                <blockquote><p>引用需要保留边界、层级和足够的文字对比度。</p></blockquote>
                <pre><code>{'const description = "一行较长的代码用于检查独立横向滚动，避免挤出文章容器的边界。";'}</code></pre>
                <table><thead><tr><th>内容</th><th>说明</th></tr></thead><tbody><tr><td>长文本</td><td>当前主题的正文、表头、描边与背景应保持协调。</td></tr></tbody></table>
            </Prose>
        </section>))}
        <p id="prose-visual-end">内容结束</p>
    </div>;
}
