export const meta = {
    title: "卡片形态",
    description: "type='card' 提供更清晰的容器边界，适用于表单或配置区。",
};

import Tabs from '../../src/index.js';

const CardDemo = () => {
    return (
        <Tabs
            type="card"
            items={[
                { key: 'profile', label: '个人信息', children: <p>在此填写个人资料。</p> },
                { key: 'security', label: '安全设置', children: <p>在此管理密码与多因素认证。</p> },
                { key: 'billing', label: '账单', children: <p>在此查看账单与发票。</p> },
            ]}
        />
    );
};

export default CardDemo;
