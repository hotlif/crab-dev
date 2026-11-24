import { css } from '@crab-dev/css';
import { useId } from 'react';
import Prose, { ProseScrollRegion } from '../../src/index.js';

export const meta = {
    title: '宽表与代码局部滚动',
    description: '在窄容器中按 Tab 聚焦表格或代码，使用方向键查看剩余内容。',
};

const tableWidth = css`min-inline-size: 36rem;`;
const articleWidth = css`max-inline-size: 36rem;`;
const record = 'const recordId = "NORTH-INTAKE-PUMP-P104-INSPECTION-2026-11-24";';

export default function ScrollRegionDemo() {
    const id = useId();
    return <Prose as="article" className={articleWidth}>
        <h3 id={`${id}-readings`}>采样检查表</h3>
        <ProseScrollRegion aria-labelledby={`${id}-readings`}>
            <table className={tableWidth}>
                <caption>北区泵站当班采样数据</caption>
                <thead>
                    <tr><th scope="col">设备</th><th scope="col">位置</th><th scope="col">入口压差</th><th scope="col">复核状态</th></tr>
                </thead>
                <tbody>
                    <tr><th scope="row">输水泵 P-104</th><td>北区进水口</td><td>0.62 MPa</td><td>需要下一班复测</td></tr>
                    <tr><th scope="row">回流管 F-026</th><td>回水机房</td><td>0.34 MPa</td><td>已复核</td></tr>
                </tbody>
            </table>
        </ProseScrollRegion>
        <h3 id={`${id}-code`}>巡检记录标识</h3>
        <ProseScrollRegion aria-labelledby={`${id}-code`}>
            <pre><code>{record}</code></pre>
        </ProseScrollRegion>
        <p>复测后，把读数和巡检记录一并交接给下一班。</p>
    </Prose>;
}
