import { css } from '@crab-dev/css';
import Pagination from '@crab-dev/rc-pagination';
import { useConfig } from '@crab-dev/rc-config-provider';
import token from '@crab-dev/rc-token-semantic';
import { useId, useState } from 'react';

export const meta = { title: '分页导航状态矩阵', description: '真实页码、页大小、快速跳转和空数据，三档尺寸与密度独立。' };
const frame = css`display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['group-gap']}; background: ${token.color.background.surface}; color: ${token.color.text.primary}; min-width: 0;`;
export default function VisualMatrixDemo() {
    const { locale } = useConfig();
    const [state, setState] = useState('default');
    const [value, setValue] = useState(6);
    const [pageSize, setPageSize] = useState(10);
    const id = useId();
    const english = locale === 'en-US';
    return <section className={frame} aria-label="Pagination visual matrix" data-visual-scene data-state={state}>
        <div><label htmlFor={id}>验收状态</label>{' '}<select id={id} value={state} onChange={event => setState(event.currentTarget.value)}><option>default</option><option>disabled</option><option>empty</option></select></div>
        <Pagination aria-label="分页验收" total={state === 'empty' ? 0 : 240} value={value} onValueChange={setValue} pageSize={pageSize} onPageSizeChange={setPageSize} disabled={state === 'disabled'} showQuickJumper showSizeChanger showTotal pageLabel={page => `Page ${page}`} prevLabel="Previous page" nextLabel="Next page" />
        <output aria-live="polite">{english ? 'Current page' : '当前页'}: {value}; {english ? 'Rows per page' : '每页条数'}: {pageSize}</output>
    </section>;
}
