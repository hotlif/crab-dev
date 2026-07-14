import { css, cx } from "@linaria/core";
import { Link } from "react-router";
import toolboxManifest from "../_generated/toolboxManifest.js";
import { ArrowRightIcon } from "../components/icons.js";

const wrapStyle = css`
    max-width: 960px;
    margin: 0 auto;
    padding: 52px 24px 72px;

    @media (max-width: 720px) {
        padding: 36px 16px 56px;
    }
`;

const headerStyle = css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 34px;
`;

const eyebrowStyle = css`
    display: inline-flex;
    align-items: center;
    padding: 5px 10px;
    border-radius: var(--radius-pill);
    border: 1px solid var(--border);
    background: linear-gradient(90deg, var(--tone-cyan-soft), var(--background) 55%, var(--tone-rose-soft));
    color: var(--muted-foreground);
    font-size: 11px;
    font-family: var(--font-mono);
    letter-spacing: 0.02em;
`;

const titleStyle = css`
    font-size: clamp(30px, 4vw, 42px);
    line-height: 1.1;
    letter-spacing: -0.03em;
    font-weight: 700;
    color: var(--text-primary);
`;

const leadStyle = css`
    font-size: 15px;
    color: var(--muted-foreground);
    line-height: 1.65;
    max-width: 60ch;
`;

const listStyle = css`
    display: flex;
    flex-direction: column;
    gap: 12px;
    list-style: none;
    margin: 0;
    padding: 0;
`;

/**
 * 一站 = 序号轴 + 卡片。轴上的竖线由本站圆点向下延伸至下一站, 末站不画 —— 链止于消费端。
 */
const stepStyle = css`
    /* tone 定义在这一层, 序号圆点与卡片是兄弟节点, 都要继承它。 */
    --stop-accent: var(--tone-cyan);
    position: relative;
    display: grid;
    grid-template-columns: 40px minmax(0, 1fr);
    gap: 16px;

    &.toneAmber {
        --stop-accent: var(--tone-amber);
    }

    &.toneRose {
        --stop-accent: var(--tone-rose);
    }

    &:not(:last-child)::before {
        content: "";
        position: absolute;
        inset-block: 46px -12px;
        inset-inline-start: 19px;
        inline-size: 2px;
        border-radius: var(--radius-pill);
        background: linear-gradient(180deg, var(--border-default), var(--border));
    }

    @media (max-width: 720px) {
        grid-template-columns: 30px minmax(0, 1fr);
        gap: 12px;

        &:not(:last-child)::before {
            inset-inline-start: 14px;
            inset-block: 38px -12px;
        }
    }
`;

const markStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    inline-size: 40px;
    block-size: 40px;
    border-radius: var(--radius-pill);
    border: 1px solid var(--border);
    background: var(--card);
    color: var(--foreground);
    font-family: var(--font-mono);
    font-size: 13px;
    font-weight: 600;
    flex-shrink: 0;
    box-shadow: 0 0 0 4px color-mix(in oklab, var(--stop-accent) 12%, transparent);

    @media (max-width: 720px) {
        inline-size: 30px;
        block-size: 30px;
        font-size: 11px;
        box-shadow: 0 0 0 3px color-mix(in oklab, var(--stop-accent) 12%, transparent);
    }
`;

const cardStyle = css`
    position: relative;
    display: block;
    overflow: hidden;
    padding: 16px 18px;
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    background: var(--card);
    color: var(--text-primary);
    text-decoration: none;
    transition: border-color var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast);

    /* 左侧强调条 —— 竖向流水线里, 它替代首页 workflow 卡片的顶部横条。 */
    &::before {
        content: "";
        position: absolute;
        inset-block: 0;
        inset-inline-start: 0;
        inline-size: 3px;
        background: linear-gradient(180deg, color-mix(in oklab, var(--stop-accent) 78%, transparent), transparent);
    }

    &:hover {
        border-color: var(--border-default);
        transform: translateY(-2px);
        box-shadow: var(--shadow-sm);
    }

    &:focus-visible {
        outline: none;
        border-color: var(--ring);
        box-shadow: 0 0 0 3px var(--focus-ring-soft);
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;

        &:hover {
            transform: none;
        }
    }
`;

const topRowStyle = css`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;

    > .stage {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.04em;
        color: color-mix(in oklab, var(--stop-accent) 62%, var(--foreground));
    }

    > .version {
        margin-left: auto;
        font-family: var(--font-mono);
        font-size: 10.5px;
        color: var(--muted-foreground);
        border: 1px solid var(--border);
        border-radius: var(--radius-pill);
        padding: 1px 8px;
        background: var(--muted);
    }
`;

const titleRowStyle = css`
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 9px;
    margin-bottom: 6px;

    > .name {
        font-size: 17px;
        font-weight: 650;
        letter-spacing: -0.01em;
        color: var(--text-primary);
    }

    > .role {
        font-family: var(--font-mono);
        font-size: 11px;
        color: var(--muted-foreground);
        border: 1px solid var(--border);
        border-radius: var(--radius-pill);
        padding: 1px 7px;
        background: var(--background);
    }
`;

const summaryStyle = css`
    display: block;
    font-size: 13.5px;
    line-height: 1.65;
    color: var(--muted-foreground);
    margin-bottom: 12px;
`;

const footRowStyle = css`
    display: flex;
    align-items: center;
    gap: 10px;
    padding-top: 11px;
    border-top: 1px solid var(--border-subtle);

    > .pkg {
        font-family: var(--font-mono);
        font-size: 11px;
        color: var(--text-tertiary);
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    > .output {
        margin-left: auto;
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: var(--muted-foreground);
        white-space: nowrap;
    }

    > .output > .dot {
        inline-size: 5px;
        block-size: 5px;
        border-radius: var(--radius-pill);
        background: var(--stop-accent);
        flex-shrink: 0;
    }

    > .arrow {
        flex-shrink: 0;
        display: inline-flex;
        color: var(--text-tertiary);
        transition: transform var(--transition-fast), color var(--transition-fast);
    }

    ${cardStyle}:hover & > .arrow {
        color: var(--foreground);
        transform: translateX(2px);
    }

    @media (prefers-reduced-motion: reduce) {
        > .arrow {
            transition: none;
        }

        ${cardStyle}:hover & > .arrow {
            transform: none;
        }
    }

    /* 窄屏优先保住包名与箭头, 产出留给详情页。 */
    @media (max-width: 560px) {
        > .output {
            display: none;
        }
    }
`;

const commandsStyle = css`
    margin-top: 48px;
    padding-top: 30px;
    border-top: 1px solid var(--border-subtle);
`;

const commandsHeadingStyle = css`
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin-bottom: 16px;

    > h2 {
        font-size: 16px;
        font-weight: 700;
        letter-spacing: -0.01em;
        color: var(--text-primary);
    }

    > span {
        font-size: 12.5px;
        color: var(--text-tertiary);
    }
`;

const commandListStyle = css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
    gap: 8px;

    @media (max-width: 720px) {
        grid-template-columns: 1fr;
    }
`;

const commandRowStyle = css`
    display: flex;
    align-items: baseline;
    gap: 12px;
    padding: 11px 14px;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--card);
    transition: border-color var(--transition-fast), background-color var(--transition-fast);

    &:hover {
        border-color: var(--border-default);
        background: color-mix(in oklab, var(--accent) 60%, var(--card));
    }

    > code {
        font-family: var(--font-mono);
        font-size: 12.5px;
        color: var(--text-primary);
        white-space: nowrap;
    }

    > .desc {
        font-size: 12.5px;
        color: var(--muted-foreground);
        line-height: 1.5;
        min-width: 0;
    }

    > .by {
        margin-left: auto;
        flex-shrink: 0;
        font-family: var(--font-mono);
        font-size: 11px;
        color: var(--text-tertiary);
    }
`;

/** 仓库工作流命令 —— 属于仓库约定而非某个包的元数据, 故不走 manifest。 */
const COMMANDS: Array<{ cmd: string; desc: string; by: string }> = [
    { cmd: "yarn start", desc: "起文档站与组件预览", by: "lignify" },
    { cmd: "yarn build:library", desc: "全仓库拓扑构建", by: "packify" },
    { cmd: "yarn generate:token", desc: "token.toml → token.ts", by: "packify" },
    { cmd: "yarn test", desc: "以 ESM 模式跑 Jest", by: "packify" },
];

/** 三个色相循环着给每一站上色; 仅作装饰 —— 阶段语义由文字承载, 不依赖颜色。 */
const TONE_CLASSES = ["", "toneAmber", "toneRose"] as const;

const getVersionLabel = (version: string): string => {
    const raw = version.trim();
    return raw.startsWith("v") ? raw : `v${raw}`;
};

const ToolchainView = () => {
    return (
        <div className={wrapStyle}>
            <header className={headerStyle}>
                <span className={eyebrowStyle}>toolbox · {toolboxManifest.length} packages</span>
                <h1 className={titleStyle}>工具链</h1>
                <p className={leadStyle}>
                    组件库自身的开发、文档、构建与分发, 由这 {toolboxManifest.length} 个内部工具承担。
                    它们串成一条流水线: 从本地起服务写组件, 到打出四种产物, 再到消费方 import 时样式自动跟随。
                </p>
            </header>

            <ol className={listStyle}>
                {toolboxManifest.map((tool, index) => (
                    <li
                        key={tool.slug}
                        className={cx(stepStyle, TONE_CLASSES[index % TONE_CLASSES.length])}
                    >
                        <span aria-hidden className={markStyle}>
                            {String(index + 1).padStart(2, "0")}
                        </span>

                        <Link to={`/toolchain/${tool.slug}`} className={cardStyle}>
                            <span className={topRowStyle}>
                                <span className="stage">{tool.stage}</span>
                                <span className="version">{getVersionLabel(tool.version)}</span>
                            </span>

                            <span className={titleRowStyle}>
                                <span className="name">{tool.title}</span>
                                <span className="role">{tool.role}</span>
                            </span>

                            <span className={summaryStyle}>{tool.summary}</span>

                            <span className={footRowStyle}>
                                <span className="pkg">{tool.pkg}</span>
                                <span className="output">
                                    <span aria-hidden className="dot" />
                                    {tool.output}
                                </span>
                                <span aria-hidden className="arrow">
                                    <ArrowRightIcon width={16} height={16} />
                                </span>
                            </span>
                        </Link>
                    </li>
                ))}
            </ol>

            <section className={commandsStyle}>
                <div className={commandsHeadingStyle}>
                    <h2>常用命令</h2>
                    <span>在仓库根目录执行, 由上面这条链承担</span>
                </div>
                <div className={commandListStyle}>
                    {COMMANDS.map(item => (
                        <div key={item.cmd} className={commandRowStyle}>
                            <code>{item.cmd}</code>
                            <span className="desc">{item.desc}</span>
                            <span className="by">{item.by}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ToolchainView;
