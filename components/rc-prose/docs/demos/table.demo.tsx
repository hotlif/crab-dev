export const meta = {
    title: "表格与定义列表",
    description: "展示表格与定义列表的排版效果",
};

import Prose from '../../src/index.js';

const TableDemo = () => {
    return (
        <Prose>
            <h3>表格</h3>
            <table>
                <thead>
                    <tr>
                        <th>变体</th>
                        <th>字号</th>
                        <th>行高</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>sm</td>
                        <td>0.875rem</td>
                        <td>1.714</td>
                    </tr>
                    <tr>
                        <td>base</td>
                        <td>1rem</td>
                        <td>1.75</td>
                    </tr>
                    <tr>
                        <td>lg</td>
                        <td>1.125rem</td>
                        <td>1.778</td>
                    </tr>
                    <tr>
                        <td>xl</td>
                        <td>1.25rem</td>
                        <td>1.8</td>
                    </tr>
                </tbody>
            </table>

            <h3>定义列表</h3>
            <dl>
                <dt>Prose</dt>
                <dd>Markdown 排版容器组件，提供完整的富文本排版样式。</dd>

                <dt>Crab CSS</dt>
                <dd>零运行时 CSS-in-JS 方案，编译时提取静态 CSS。</dd>

                <dt>Design Token</dt>
                <dd>三层架构（全局 → 语义 → 组件），支持主题覆写。</dd>
            </dl>
        </Prose>
    );
};

export default TableDemo;
