import { css, cx } from '@crab-dev/css';
import token from '@crab-dev/rc-token-semantic';
import Prose from '@crab-dev/rc-prose';

export const meta = {
    title: '嵌入独立内容',
    description: 'not-prose 排除区域自身及后代的直接排版规则；字体和颜色仍会正常继承，独立区域可定义自己的外观。',
};

const noteStyle = css`
    padding: ${token.space['card-padding']};
    border: 1px solid ${token.color.border.default};
    border-radius: ${token.shape.card};
    background: ${token.color.workspace.sidebar};
    color: ${token.color.text.secondary};
    font-size: ${token.typography.body.small['font-size']};
    line-height: ${token.typography.body.small['line-height']};

    & h3 { margin: 0 0 ${token.space['component-gap']}; font: inherit; font-weight: ${token.font.weight.strong}; }
    & p { margin: 0; }
`;

export default function ScopedContentDemo() {
    return <Prose as="article">
        <h2>项目说明</h2>
        <p>正文、<a href="#scoped-content-end">相关链接</a>和 <kbd>Enter</kbd> 提示使用文章排版。</p>
        <aside className={cx('not-prose', noteStyle)} aria-label="独立提示">
            <h3>提示内容</h3>
            <p>这个区域保留自身的字号、间距和表面，后面的文章继续使用 Prose。</p>
        </aside>
        <p id="scoped-content-end">文章内容继续。代码块中的字体不会被行内代码尺寸再次缩小。</p>
        <pre><code>{'const ready = true;'}</code></pre>
    </Prose>;
}
