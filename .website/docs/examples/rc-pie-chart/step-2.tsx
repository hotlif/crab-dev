import { useState } from 'react';
import PieChart from '@crab-dev/rc-pie-chart';

export default function Example() {
    const [selection, setSelection] = useState('');
    return (
        <div>
            <PieChart
                aria-label="周六烘焙坊售出的面包"
                width="auto"
                height={240}
                innerRadiusRatio={0.55}
                data={[
                    { name: '法棍', value: 60 },
                    { name: '可颂', value: 36 },
                    { name: '吐司', value: 24 },
                ]}
                formatValue={value => `${value} 个`}
                onSliceClick={({ name, value }) => setSelection(`${name}售出 ${value} 个。`)}
            />
            <p role="status">{selection || '选择一种面包查看销量。'}</p>
        </div>
    );
}
