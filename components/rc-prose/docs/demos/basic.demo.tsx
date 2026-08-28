export const meta = {
    title: "基础用法",
    description: "默认 `size=base`，包含标题、段落、链接、粗体等基础排版元素",
};

import Prose from '../../src/index.js';

const BasicDemo = () => {
    return (
        <Prose as="article">
            <h1>Prose 排版组件</h1>
            <p className="lead">
                零运行时 Markdown 排版容器，基于 Crab CSS 编译为静态 CSS，不引入额外 JS 开销。
            </p>

            <h2>基本元素</h2>
            <p>
                正文段落。支持 <strong>粗体</strong>、<em>斜体</em>，以及
                <a href="#">链接</a>，悬停时颜色自动切换。
            </p>

            <h3>引用</h3>
            <blockquote>
                <p>好的排版应当是隐形的。 —— Beatrice Warde</p>
            </blockquote>

            <h3>列表</h3>
            <ul>
                <li>无序列表项 1</li>
                <li>无序列表项 2</li>
                <li>无序列表项 3</li>
            </ul>
            <ol>
                <li>有序列表项 1</li>
                <li>有序列表项 2</li>
                <li>有序列表项 3</li>
            </ol>

            <hr />

            <h3>代码</h3>
            <p>
                行内代码：<code>const x = 1</code>，代码块如下：
            </p>
            <pre>
                <code>{`import Prose from '@crab-dev/rc-prose';

function App() {
    return (
        <Prose as="article">
            {content}
        </Prose>
    );
}`}</code>
            </pre>
        </Prose>
    );
};

export default BasicDemo;
