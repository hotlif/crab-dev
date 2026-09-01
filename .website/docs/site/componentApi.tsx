import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";

export interface ComponentApiPropRecord {
    readonly name: string;
    readonly required: boolean;
    readonly description: string;
    readonly typeText: string;
    readonly defaultValue: string | null;
    readonly deprecated: boolean;
}

export interface ComponentApiRecord {
    readonly component: string;
    readonly symbol: string;
    readonly props: readonly ComponentApiPropRecord[];
}

interface ComponentApiProps {
    readonly api: ComponentApiRecord | null;
}

const tableRegionStyle = css`
    max-width: 100%;
    overflow-x: auto;
    border: 1px solid ${token.color.border.default};
    border-radius: ${token.radius.lg};
`;

const tableStyle = css`
    width: 100%;
    min-width: 760px;
    border-collapse: collapse;
    color: ${token.color.text.primary};
    font-size: ${token.font.size.body};

    th,
    td {
        padding: ${token.space['stack-gap']} ${token.space['section-gap']};
        border-bottom: 1px solid ${token.color.border.default};
        text-align: left;
        vertical-align: top;
    }

    th {
        background-color: ${token.color.background['hover-subtle']};
        font-weight: ${token.font.weight.heading};
        white-space: nowrap;
    }

    tbody tr:last-child td {
        border-bottom: 0;
    }

    code {
        color: ${token.color.text.primary};
        font-size: ${token.font.size.caption};
        overflow-wrap: anywhere;
    }
`;

const requiredStyle = css`
    color: ${token.color.feedback.error};
    font-weight: ${token.font.weight.label};
`;

const optionalStyle = css`
    color: ${token.color.text.tertiary};
`;

const deprecatedStyle = css`
    color: ${token.color.text.tertiary};
    text-decoration: line-through;
`;

export default function ComponentApi({ api }: ComponentApiProps) {
    if (!api || api.props.length === 0) return null;

    return (
        <div
            className={tableRegionStyle}
            role="region"
            aria-label={`${api.component} 属性 API`}
            tabIndex={0}
        >
            <table className={tableStyle}>
                <thead>
                    <tr>
                        <th scope="col">属性</th>
                        <th scope="col">类型</th>
                        <th scope="col">默认值</th>
                        <th scope="col">必填</th>
                        <th scope="col">说明</th>
                    </tr>
                </thead>
                <tbody>
                    {api.props.map((prop) => (
                        <tr key={prop.name}>
                            <td>
                                <code className={prop.deprecated ? deprecatedStyle : undefined}>
                                    {prop.name}
                                </code>
                            </td>
                            <td><code>{prop.typeText}</code></td>
                            <td><code>{prop.defaultValue ?? "—"}</code></td>
                            <td className={prop.required ? requiredStyle : optionalStyle}>
                                {prop.required ? "是" : "否"}
                            </td>
                            <td>{prop.description || "—"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
