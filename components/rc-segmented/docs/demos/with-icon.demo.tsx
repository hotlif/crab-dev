export const meta = {
    title: "带图标",
    description: "选项可搭配 icon; 纯图标选项须提供 aria-label 保证可访问性。",
};

import Segmented from '../../src/index.js';

const ListIcon = () => (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
        <path
            d="M2 4h12M2 8h12M2 12h12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
        />
    </svg>
);

const GridIcon = () => (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
        <path
            d="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z"
            fill="currentColor"
        />
    </svg>
);

const WithIconDemo = () => {
    return (
        <Segmented
            options={[
                { label: '列表', value: 'list', icon: <ListIcon /> },
                { label: '网格', value: 'grid', icon: <GridIcon /> },
            ]}
        />
    );
};

export default WithIconDemo;
