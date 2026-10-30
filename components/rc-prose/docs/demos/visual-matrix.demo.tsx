import { useState } from 'react';
import { css, cx } from '@crab-dev/css';
import token from '@crab-dev/rc-token-semantic';
import Prose, { type ProseSize } from '@crab-dev/rc-prose';

export const meta = {
    title: '排版验收矩阵',
    description: '真实文章字阶、逆色表面、长链接、代码滚动、表格和退出作用域的嵌入区域。',
};
const frame = css`
    width: 100%;
    max-width: 800px;
    min-width: 0;
    padding: ${token.space['card-padding']};
    box-sizing: border-box;
    background: ${token.color.surface.content};
`;
const inverse = css`
    background: ${token.color.background.inverse};
`;
const embedded = css`
    color: ${token.color.text.primary};
    background: ${token.color.surface.content};
    border: 1px solid ${token.color.border.default};
    padding: ${token.space['component-gap']};
`;
export default function VisualMatrixDemo() {
    const [size, setSize] = useState<ProseSize>('base');
    const [mode, setMode] = useState('default');
    return (
        <>
            <label>
                文章尺寸{' '}
                <select
                    aria-label="文章尺寸"
                    value={size}
                    onChange={(event) => setSize(event.target.value as ProseSize)}
                >
                    {(['sm', 'base', 'lg', 'xl'] as const).map((value) => (
                        <option key={value}>{value}</option>
                    ))}
                </select>
            </label>
            <label>
                验收状态{' '}
                <select aria-label="验收状态" value={mode} onChange={(event) => setMode(event.target.value)}>
                    <option value="default">普通</option>
                    <option value="inverse">逆色</option>
                </select>
            </label>
            <section aria-label="Prose visual matrix" className={cx(frame, mode === 'inverse' && inverse)}>
                <Prose as="article" size={size} invert={mode === 'inverse'}>
                    <h2>维护性优先 / Maintainable interfaces</h2>
                    <p className="lead">清晰的内容层级和稳定的阅读节奏。</p>
                    <p>
                        正文包含 <strong>重点</strong>、<em>补充说明</em>、<code>inlineCode</code>、<kbd>Enter</kbd>{' '}
                        以及 <a href="#prose-end">可访问的参考链接 / Reference</a>。
                    </p>
                    <blockquote>
                        <p>界面配置变化保持内容结构与用户输入。</p>
                    </blockquote>
                    <ul>
                        <li>首项 First item</li>
                        <li>次项 Second item</li>
                    </ul>
                    <p>
                        <a href="#prose-end">
                            https://example.com/documentation/long-continuous-reference-for-typography-and-overflow
                        </a>
                    </p>
                    <pre>
                        <code>
                            {'const message = "保持代码的 LTR 阅读方向、括号与标点，并将长行滚动限制在代码块自身。";'}
                        </code>
                    </pre>
                    <table>
                        <thead>
                            <tr>
                                <th>项目 Item</th>
                                <th>状态 Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>排版 Typography</td>
                                <td>待复审 Pending review</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className={cx('not-prose', embedded)}>
                        独立嵌入区域 / Embedded content <code>unformatted</code>
                    </div>
                    <p id="prose-end">内容结束 / End</p>
                </Prose>
            </section>
        </>
    );
}
