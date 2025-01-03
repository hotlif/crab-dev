import { css } from "@linaria/core";

import {
    display,
    height,
    boxShadow,
    fontSize,
    margin,
    width,
    flexDirection,
    flexGrow,
} from "@crab/styleify";

const Header = () => {
    return (
        <div
            className={css`
                ${display("flex")}
                ${height("14")}
                ${boxShadow("sm")}
            `}
        >
            <h1
                className={css`
                    ${fontSize("lg")}
                    ${margin("ml-6")}
                `}
            >
                Carb Dev
            </h1>
        </div>
    )
}

const Sidebar = () => {
    return (
        <aside
            className={css`
                ${display("flex")}
                ${height("full")}
                ${width("64")}
            `}
        >
        </aside>
    )
}

const Main = () => {
    return (
        <main
            className={css`
                ${flexGrow(1)}    
            `}
        >
        </main>
    )
}

const BasicLayout = () => {
    return (
        <div
            className={css`
                ${display("flex")}
                ${height("full")}
                ${flexDirection("col")}
            `}
        >
            <Header />
            <div
                className={css`
                    ${display("flex")}
                    ${flexDirection("row")}
                    ${flexGrow(1)}
                `}
            >
                <Sidebar />
                <Main />
            </div>
        </div>
    )
}

export default BasicLayout;
