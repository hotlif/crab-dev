/**
 * title = "禁用"
 * description = "设置 disabled 禁用整个选择器，或在选项中设置 disabled 禁用单个选项"
 */

import { css } from '@linaria/core';
import Select from '../../src/index.js';

const containerStyle = css`
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 320px;
`;

const DisabledDemo = () => {
    return (
        <div className={containerStyle}>
            <Select
                aria-label="disabled-all"
                disabled
                defaultValue="1"
                options={[
                    { label: '选项一', value: '1' },
                    { label: '选项二', value: '2' },
                ]}
                placeholder="整体禁用"
            />
            <Select
                aria-label="disabled-option"
                options={[
                    { label: '可选', value: '1' },
                    { label: '禁用选项', value: '2', disabled: true },
                    { label: '可选', value: '3' },
                ]}
                placeholder="部分选项禁用"
            />
        </div>
    );
};

export default DisabledDemo;
