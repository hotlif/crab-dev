import { alignItems, display, flexDirection, fontSize, margin, padding, width } from "@crab/styleify";
import { css, cx } from "@linaria/core";
import { useOutlet } from "react-router";
import RcButton from "@crab/rc-button";
import { getConfig } from "../util/global";
import markdownStyle from "../styles/Markdown";

const config = getConfig();

const DocsIndexLayout = () => {
    const outlet = useOutlet();

    return (
        <main>
            <div
                className={css`
                ${display("flex")}
                ${flexDirection("col")}
                ${padding("pt-20")}
                ${padding("pb-10")}
                justify-content: center;
            `}
            >
                <div
                    className={css`
                        ${display("flex")}    
                        ${alignItems("center")}
                        justify-content: center;
                    `}
                >
                    <img
                        className={css`
                            width: 5rem;
                            height: 5rem;
                            margin-right: 0.5rem;
                            user-select: none;
                        `}
                        src="/images/crab.png"
                    />
                    <h1
                        className={css`
                            ${fontSize("4xl")}
                            text-align: center;
                        `}
                    >

                        {config.title}
                    </h1>

                </div>

                <p
                    className={css`
                    text-align: center;
                    ${fontSize("xl")}
                    color: rgb(64 71 86);
                    margin: 0px;
                `}
                >
                    {config.description}
                </p>
                <div
                    className={css`
                    ${display("flex")}
                    ${margin("mt-8")}
                    gap: 1rem;
                    justify-content: center;
                `}
                >
                    <RcButton
                        size="large"
                        appearance="primary"
                    >
                        开始使用
                    </RcButton>

                    <RcButton
                        size="large"
                    >
                        设计语言
                    </RcButton>
                </div>
            </div>

            <div>
                <div
                    className={cx(markdownStyle, css`
                        ${width("4/6")}
                        margin: 0px auto;
                        ${padding("pt-10")}
                    `)}
                >
                    {outlet}
                </div>
            </div>
        </main>
    )
}

export default DocsIndexLayout;
