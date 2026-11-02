
export const meta = {
    title: "滑块基础用法",
    description: "将受控滑块与原生数字输入同步，演示 onValueChange 与原生 onChange 事件的适配。",
};

import { useId, useState } from "react";
import Slider from "@crab-dev/rc-slider";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";

const rootStyle = css`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    inline-size: calc(${token.size['136']} + ${token.size['136']});
    max-inline-size: 100%;
    gap: ${token.space['stack-gap']};
`;

const nativeFieldStyle = css`
    display: flex;
    flex-direction: column;
    gap: ${token.space['inline-gap']};
    margin-block-start: ${token.space['component-gap']};
`;

const nativeEditorStyle = css`
    box-sizing: border-box;
    inline-size: 100%;
    min-inline-size: 0;
    min-block-size: ${token.size['32']};
    padding: ${token.space['control-padding-y']} ${token.space['control-padding-x']};
    border: 1px solid ${token.color.border.default};
    border-radius: ${token.shape.control};
    color: ${token.color.text.primary};
    background: ${token.color.surface.content};
    font: inherit;
    &:focus-visible { outline: 2px solid ${token.color.focus.ring}; outline-offset: 2px; }
    @media (pointer: coarse) { min-block-size: ${token.size['touch-target']}; }
`;

const BaseDemo = () => {
    const [value, setValue] = useState(20);
    const sliderLabelId = useId();
    const numberId = useId();
    return (
        <div className={rootStyle}>
            <span id={sliderLabelId}>滑块角度</span>
            <Slider
                aria-labelledby={sliderLabelId}
                min={0}
                max={360}
                step={1}
                value={value}
                onValueChange={setValue}
            />

            <div className={nativeFieldStyle}>
                <label htmlFor={numberId}>角度数值</label>
                <input
                    className={nativeEditorStyle}
                    id={numberId}
                    type="number"
                    min={0}
                    max={360}
                    step={1}
                    value={value}
                    onChange={event => {
                        const next = event.currentTarget.valueAsNumber;
                        if (Number.isFinite(next)) setValue(Math.min(360, Math.max(0, next)));
                    }}
                />
            </div>
        </div>
    );
};

export default BaseDemo;
