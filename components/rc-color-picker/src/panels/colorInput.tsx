import RcButton from "@crab-dev/rc-button";
import RcLineEdit from "@crab-dev/rc-line-edit";
import RcSelect from "@crab-dev/rc-select";
import { css } from "@linaria/core";
import { type FC, useEffect, useRef, useState } from "react";
import token from "../token.js";
import type { ColorFormat, OKLCHValue } from "../types.js";
import { formatColor, hexToOklch, parseColor } from "../utils/color.js";

const FORMATS: ColorFormat[] = ["hex", "rgb", "hsl", "oklch"];
const FORMAT_OPTIONS = FORMATS.map((f) => ({ label: f.toUpperCase(), value: f }));

export interface ColorInputProps {
    value: OKLCHValue;
    format: ColorFormat;
    showEyeDropper?: boolean;
    onFormatChange: (format: ColorFormat) => void;
    onValueChange: (value: OKLCHValue) => void;
}

const wrapStyle = css`
    display: flex;
    align-items: stretch;
    gap: ${token.input.gap};
`;

const selectStyle = css`
    flex: 0 0 auto;
    width: 84px;
`;

const inputStyle = css`
    flex: 1;
    min-width: 0;
`;

const EyedropperIcon: FC = () => (
    <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="m2 22 1-1h3l9-9" />
        <path d="M3 21v-3l9-9" />
        <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z" />
    </svg>
);

const ColorInput: FC<ColorInputProps> = ({
    value,
    format,
    showEyeDropper = true,
    onFormatChange,
    onValueChange,
}) => {
    // 本地编辑草稿:输入期间不即时 parse,失焦 / Enter 才提交;draft 为 null 时跟随外部 value
    const [draft, setDraft] = useState<string | null>(null);
    const text = draft ?? formatColor(value, format);
    // 可变实例状态 ref(例外白名单第 1 类):持有取色会话句柄以便卸载时中止,不驱动渲染
    const pickAbortRef = useRef<AbortController | null>(null);

    // 组件卸载时中止仍在等待用户操作的取色会话,避免卸载后 resolve 触发状态更新
    useEffect(() => () => pickAbortRef.current?.abort(), []);

    const commit = (raw: string) => {
        const parsed = parseColor(raw, format);
        if (parsed) {
            onValueChange({ ...parsed, alpha: parsed.alpha ?? value.alpha });
        }
        setDraft(null);
    };

    // rc-dropdown-container 的浮层容器对 mousedown 无条件 preventDefault(保住触发器焦点),
    // 会同时阻止内部控件(含嵌套的 RcSelect 自身弹层)的点击聚焦与选词;在此拦截冒泡即可恢复原生行为。
    const stopMouseDown = (e: { stopPropagation: () => void }) => e.stopPropagation();

    return (
        <div className={wrapStyle} onMouseDown={stopMouseDown}>
            <RcSelect
                aria-label="颜色格式"
                className={selectStyle}
                size="small"
                options={FORMAT_OPTIONS}
                value={format}
                onChange={(next) => {
                    if (next) onFormatChange(next as ColorFormat);
                }}
            />
            <RcLineEdit
                aria-label="颜色值"
                className={inputStyle}
                size="small"
                spellCheck={false}
                value={text}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={(e) => commit(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        commit((e.target as HTMLInputElement).value);
                    }
                }}
            />
        </div>
    );
};

export default ColorInput;
