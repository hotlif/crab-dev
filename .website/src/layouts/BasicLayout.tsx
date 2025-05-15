import { alignItems, boxShadow, display, fontSize, fontWeight, height, margin } from "@crab/styleify"
import { css } from "@linaria/core"


const BasicLayout = () => {
    return (
        <header
            className={css`
                ${display("flex")}
                ${height("14")}
                ${boxShadow("sm")}
                ${alignItems("center")}
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
    )
}

export default BasicLayout;
