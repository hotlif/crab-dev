import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import ColorPicker, { type OKLCHValue } from "@crab-dev/rc-color-picker";
import Button from "@crab-dev/rc-button";
import "@crab-dev/rc-color-picker/css/index.css";
import "@crab-dev/rc-button/css/index.css";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
export default function Example() {
    const [value, setValue] = useState<OKLCHValue>({
        lightness: 0.65,
        chroma: 0.16,
        hue: 250,
    });
    return (
        <div className={layout}>
            <ColorPicker value={value} onValueChange={setValue} />
            <output>
                L {value.lightness.toFixed(2)} · C {value.chroma.toFixed(2)} · H{" "}
                {value.hue.toFixed(0)}
            </output>
            <Button
                onClick={() =>
                    setValue({
                        lightness: 0.65,
                        chroma: 0.16,
                        hue: 250,
                    })
                }
            >
                恢复蓝色
            </Button>
        </div>
    );
}
