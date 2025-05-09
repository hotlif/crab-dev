import { css, cx } from "@linaria/core";
import { useOutlet, useMatches } from "react-router";
import {
    display,
    height,
    boxShadow,
    alignItems,
    boxSizing,
    flexShrink,
    cursor,
    width,
    fontSize,
    padding
} from "@crab/styleify";

const BasicLayout = () => {
    const outlet = useOutlet();
    const matches = useMatches()
    const currentRouter = matches.pop();

    const renderMainContent = () => {
        if (currentRouter.pathname === "/") {
            return (
                <main
                    className={css`
                    `}
                >
                    {outlet}
                </main>
            )
        }
    }
    return (
        <div
            className={css`
            `}
        >
            <header
                className={cx(css`
                    ${display("flex")}
                    ${height("14")}
                    ${boxShadow("sm")}
                    ${alignItems("center")}
                    ${boxSizing("border")}
                    ${flexShrink(0)}
                `)}
            >
                <div
                    className={css`
                        ${display("flex")}
                        ${cursor("pointer")}
                        ${alignItems("center")} 
                        ${width("64")}
                        ${boxSizing("border")}
                        ${padding("pl-5")} 
                    `}
                >
                    <img
                        width="auto"
                        height={22}
                        src="<%=logo %>"
                        alt="Logo"
                    />

                    <div
                        className={css`
                            ${display("inline-block")}
                            ${fontSize("lg")}
                            ${padding("pl-4")}
                        `}
                    >
                        <%=title %>
                    </div>
                </div>
            </header>
            {renderMainContent()}
        </div>
    )
}

export default BasicLayout;
