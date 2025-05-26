/**
 * title = "简单的按钮"
 * description = "通过设置按钮的 `appearance` 来改变按钮的不同外观"
 */

import RcButton from "@crab/rc-button";

const SimpleButton = () => {
    return (
        <>
            <RcButton
                appearance="primary"
                style={{
                    marginRight: "1rem",
                    marginBottom: "1rem"
                }}
            >
                Primary Button
            </RcButton>
            <RcButton
                appearance="dashed"
                style={{
                    marginRight: "1rem",
                    marginBottom: "1rem"
                }}
            >
                dashed Button
            </RcButton>
            <RcButton
                appearance="link"
                style={{
                    marginRight: "1rem",
                    marginBottom: "1rem"
                }}
            >
                Link Button
            </RcButton>
            <RcButton
                appearance="subtle"
                style={{
                    marginRight: "1rem",
                    marginBottom: "1rem"
                }}
            >
                Subtle Button
            </RcButton>
            <RcButton
                appearance="text"
            >
                Text Button
            </RcButton>
        </>
    )
}

export default SimpleButton;
