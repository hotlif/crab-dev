/**
 * title = "简单的按钮"
 * description = "通过设置按钮的 `appearance` 来改变按钮的不同外观"
 */

import Button from "@crab/rc-button";

const SimpleButton = () => {
    return (
        <>
            <Button
                appearance="primary"
                style={{
                    marginRight: "1rem",
                    marginBottom: "1rem"
                }}
            >
                Primary Button
            </Button>
            <Button
                appearance="dashed"
                style={{
                    marginRight: "1rem",
                    marginBottom: "1rem"
                }}
            >
                dashed Button
            </Button>
            <Button
                appearance="link"
                style={{
                    marginRight: "1rem",
                    marginBottom: "1rem"
                }}
            >
                Link Button
            </Button>
            <Button
                appearance="subtle"
                style={{
                    marginRight: "1rem",
                    marginBottom: "1rem"
                }}
            >
                Subtle Button
            </Button>
            <Button
                appearance="text"
            >
                Text Button
            </Button>
        </>
    )
}

export default SimpleButton;
