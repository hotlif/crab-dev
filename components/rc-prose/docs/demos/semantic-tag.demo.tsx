export const meta = {
    title: "语义标签",
    description: "通过 `as` 属性指定根元素标签：`div`（默认）、`article`、`section`、`main`",
};

import { css } from '@crab-dev/css';
import Prose from '../../src/index.js';

const wrapperStyle = css`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const labelStyle = css`
    margin-bottom: 0.25rem;
    font-size: 0.75rem;
    font-family: monospace;
    opacity: 0.5;
`;

const tags = ['div', 'article', 'section', 'main'] as const;

const SemanticTagDemo = () => {
    return (
        <div className={wrapperStyle}>
            {tags.map((tag) => (
                <div key={tag}>
                    <div className={labelStyle}>&lt;{tag}&gt;</div>
                    <Prose as={tag}>
                        <p>
                            使用 <code>as=&quot;{tag}&quot;</code> 渲染为语义化的{' '}
                            <code>&lt;{tag}&gt;</code> 元素。
                        </p>
                    </Prose>
                </div>
            ))}
        </div>
    );
};

export default SemanticTagDemo;
