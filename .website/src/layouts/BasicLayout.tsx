import { alignItems, display, flexDirection, fontSize, fontWeight, height, margin, padding, width } from "@crab/styleify"
import { css, cx } from "@linaria/core"
import { useMatches, useOutlet, useRouteLoaderData } from "react-router";
import RcButton from "@crab/rc-button";
import markdownStyle from "../styles/markdown";

const BasicLayout = () => {
    const matches = useMatches()
    const currentRouter = matches.pop();
    const outlet = useOutlet();

    const {
        metadata,
    } = useRouteLoaderData(currentRouter!.id);
    const renderContent = () => {
        
        if (currentRouter?.pathname === "/") {
            return (
                <>
                    <div
                        className={css`
                            ${display("flex")}
                            ${flexDirection("col")}
                            ${padding("pt-20")}
                            ${padding("pb-10")}
                            justify-content: center;
                        `}
                    >
                        <h1
                            className={css`
                                ${fontSize("4xl")}
                                text-align: center;    
                            `}
                        >
                            {metadata.title}
                        </h1>
                        <p
                            className={css`
                                text-align: center;
                                ${fontSize("xl")}
                                color: rgb(64 71 86);
                                margin: 0px;
                            `}
                        >
                            {metadata.description}
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

                    <div
                        className={cx(markdownStyle)}
                    >
                        <div
                            className={css`
                                ${width("4/6")}
                                margin: 0px auto;
                                ${padding("pt-10")}
                            `}
                        >
                            {outlet}
                        </div>
                    </div>
                </>
            )
        } else {
            return (
                <>
                </>
            )
        }
    }

    return (
        <>
            <header
                className={css`
                    ${display("flex")}
                    ${height("14")}
                    ${alignItems("center")}
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02);
                `}
            >
                <div
                    className={css`
                        ${margin("ml-6")}
                    `}
                >
                    <h1
                        className={css`
                            ${fontSize("xl")}
                            ${fontWeight("bold")}
                            user-select: none;
                        `}
                    >
                        Crab Dev
                    </h1>
                </div>
            </header>
            <main>
                {renderContent()}
            </main>
        </>
    )
}

export default BasicLayout;
