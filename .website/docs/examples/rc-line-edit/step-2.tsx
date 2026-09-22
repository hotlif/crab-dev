import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import LineEdit from "@crab-dev/rc-line-edit";

const layout = css`
    display: grid;
    width: 100%;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: ${token.space['group-gap']};
    & section { display: grid; align-content: start; gap: ${token.space['section-gap']}; min-width: 0; }
    & h3 { margin: 0; font-size: ${token.typography.title.large['font-size']}; font-weight: ${token.typography.title.large.emphasized['font-weight']}; }
    & p { margin: 0; color: ${token.color.text.secondary}; font-size: ${token.typography.body.medium['font-size']}; line-height: ${token.typography.body.medium['line-height']}; }
    @media (max-width: 600px) { grid-template-columns: minmax(0, 1fr); }
`;

export default function Example() {
    return <div className={layout}>
        <section aria-label="填充外观">
            <h3>Filled · 填充</h3>
            <p>用表面色建立输入区域，适合成组表单。</p>
            <LineEdit label="团队名称" appearance="filled" placeholder="例如：产品设计组" supportingText="聚焦试试：标签上移，底线强调。" />
        </section>
        <section aria-label="描边外观">
            <h3>Outlined · 描边</h3>
            <p>用轮廓明确边界，适合需要轻盈背景的页面。</p>
            <LineEdit label="显示名称" appearance="outlined" placeholder="例如：林小蟹" supportingText="开始输入后，标签仍然可见。" />
        </section>
    </div>;
}
