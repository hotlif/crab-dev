export const meta = {
    title: "尺寸变体",
    description: "通过 `size` 属性设置排版尺寸：`sm`、`base`（默认）、`lg`、`xl`",
};

import { css } from '@crab-dev/css';
import Prose from '../../src/index.js';

const wrapperStyle = css`
    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

const labelStyle = css`
    margin-bottom: 0.5rem;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    opacity: 0.5;
`;

const content = (
    <>
        <h2>标题</h2>
        <p>
            正文段落。支持 <strong>粗体</strong>、<a href="#">链接</a>，以及 <code>行内代码</code>。
        </p>
        <ul>
            <li>列表项 1</li>
            <li>列表项 2</li>
        </ul>
    </>
);

const sizes = ['sm', 'base', 'lg', 'xl'] as const;

const SizeDemo = () => {
    return (
        <div className={wrapperStyle}>
            {sizes.map((size) => (
                <section key={size}>
                    <div className={labelStyle}>size={size}</div>
                    <Prose size={size}>{content}</Prose>
                </section>
            ))}
        </div>
    );
};

export default SizeDemo;
