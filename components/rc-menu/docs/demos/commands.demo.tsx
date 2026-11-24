import { css } from '@crab-dev/css';
import Button from '@crab-dev/rc-button';
import { useState } from 'react';
import { CommandMenu } from '../../src/index.js';

export const meta = {
    title: '设备命令与二级菜单',
    description: '打开设备操作，用方向键进入导出命令。归档命令因权限不足不可执行。',
};

const demo = css`display: grid; gap: 0.5rem; justify-items: start; inline-size: min(100%, 22rem);`;

export default function CommandMenuDemo() {
    const [output, setOutput] = useState('准备操作');
    return <div className={demo}>
        <CommandMenu label="设备操作" groups={[
            { label: '巡检', items: [
                { id: 'details', label: '查看状态', onSelect: () => setOutput('设备运行正常') },
                { id: 'export', label: '导出记录', items: [
                    { id: 'csv', label: '下载 CSV', onSelect: () => setOutput('已生成 CSV') },
                    { id: 'pdf', label: '下载 PDF', onSelect: () => setOutput('已生成 PDF') },
                ] },
            ] },
            { label: '管理', items: [
                { id: 'archive', label: '归档设备', disabled: true, onSelect: () => setOutput('已归档') },
            ] },
        ]} />
        <Button appearance="text" onClick={() => setOutput('准备操作')}>重置结果</Button>
        <output>{output}</output>
    </div>;
}
