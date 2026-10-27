export const meta = {
    title: "表格与定义列表",
    description: "展示表格与定义列表的排版效果",
};

import Prose from '@crab-dev/rc-prose';

const TableDemo = () => {
    return (
        <Prose>
            <h3>表格</h3>
            <table>
                <thead>
                    <tr>
                        <th>项目</th>
                        <th>负责人</th>
                        <th>进度</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>产品说明</td>
                        <td>陈晓</td>
                        <td>已完成</td>
                    </tr>
                    <tr>
                        <td>交互评审</td>
                        <td>林宁</td>
                        <td>进行中</td>
                    </tr>
                    <tr>
                        <td>数据整理</td>
                        <td>李明</td>
                        <td>待开始</td>
                    </tr>
                    <tr>
                        <td>发布记录</td>
                        <td>周晨</td>
                        <td>待评审</td>
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
