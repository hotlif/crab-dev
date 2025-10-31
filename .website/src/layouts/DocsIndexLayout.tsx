import { flex, flexDirection, flexAlignItems, fontSize, margin, padding, width } from "@crab-dev/styleify";
import { css, cx } from "@linaria/core";
import { useNavigate, useOutlet } from "react-router";
import RcButton from "@crab-dev/rc-button";
import mdxs from "@@@/mdx"

import { getConfig } from "../util/global";


const config = getConfig();

const DocsIndexLayout = () => {
    const navigate = useNavigate();
    const outlet = useOutlet();

    return (
        <main>
            <div
                className={css`
                ${flex()}
                ${flexDirection("column")}
                ${padding(20, "top")}
                ${padding(20, "bottom")}
                justify-content: center;
            `}
            >
                <div
                    className={css`
                        ${flex()}    
                        ${flexAlignItems("center")}
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
                    ${flex()}
                    ${margin(8, "top")}
                    gap: 1rem;
                    justify-content: center;
                `}
                >
                    <RcButton
                        size="large"
                        appearance="primary"
                        onClick={(e) => {
                            const md = mdxs.filter(element => element.metadata.nav?.id === "components");
                            const path = md?.[0].metadata?.path;
                            navigate(path);
                        }}
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
                    className={cx(css`
                        ${width("66%")}
                        margin: 0px auto;
                        ${padding(10, "top")}
                    `)}
                >
                    {outlet}
                </div>
            </div>
        </main>
    )
}

export default DocsIndexLayout;
