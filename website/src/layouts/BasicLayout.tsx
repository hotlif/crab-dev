import { css } from "@linaria/core";
import {
    display,
    height,
    boxShadow,
    fontSize,
    margin
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
                    ${fontSize("xl")}
                    ${margin("ml-4")}
                `}
            >
                Carb Dev
            </h1>
        </div>
    )
}

const BasicLayout = () => {
    return (
        <>
            <Header />
        </>
    )
}

export default BasicLayout;
