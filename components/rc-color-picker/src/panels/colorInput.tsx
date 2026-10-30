import { useLocale } from '@crab-dev/rc-config-provider';
import RcLineEdit from "@crab-dev/rc-line-edit";
import RcSelect from "@crab-dev/rc-select";
import Button from "@crab-dev/rc-button";
import { useEventCallback } from "@crab-dev/rc-hooks";
import { css } from "@crab-dev/css";
import { type FC, useEffect, useRef, useState } from "react";
import token from "../token.js";
import type { ColorFormat, OKLCHValue } from "../types.js";
import { formatColor, parseColor } from "../utils/color.js";

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
    width: ${token.input.format.width};
`;

const inputStyle = css`
    flex: 1;
    min-width: 0;
`;

const ColorInput: FC<ColorInputProps> = ({
    value,
    format,
    showEyeDropper = true,
    onFormatChange,
    onValueChange,
}) => {
    const { messages } = useLocale();
    // 本地编辑草稿:输入期间不即时 parse,失焦 / Enter 才提交;draft 为 null 时跟随外部 value
    const [draft, setDraft] = useState<string | null>(null);
    const [supportsEyeDropper, setSupportsEyeDropper] = useState(false);
    const [picking, setPicking] = useState(false);
    const text = draft ?? formatColor(value, format);
    // 可变实例状态 ref(例外白名单第 1 类):持有取色会话句柄以便卸载时中止,不驱动渲染
    const pickAbortRef = useRef<AbortController | null>(null);

    // 组件卸载时中止仍在等待用户操作的取色会话,避免卸载后 resolve 触发状态更新
    useEffect(() => () => {
        pickAbortRef.current?.abort();
        pickAbortRef.current = null;
    }, []);

    // Native selection can finish after configuration or value changes. The
    // shared callback hook reads the latest committed value and change handler.
    const applyPickedColor = useEventCallback((raw: string) => {
        const parsed = parseColor(raw, "hex");
        if (!parsed) return;
        setDraft(null);
        onValueChange({ ...parsed, alpha: parsed.alpha ?? value.alpha });
    });

    const pickColor = async (button: HTMLButtonElement) => {
        const view = button.ownerDocument.defaultView;
        const EyeDropper = view?.EyeDropper;
        if (!view || !EyeDropper || pickAbortRef.current) return;
        const abort = new view.AbortController();
        pickAbortRef.current = abort;
        setPicking(true);
        try {
            // Keep open() in the actual user activation, before awaiting work.
            const result = await new EyeDropper().open({ signal: abort.signal });
            if (!abort.signal.aborted) applyPickedColor(result.sRGBHex);
        } catch {
            // Cancelling the native surface or rejecting permission never commits
            // a fallback color. The current value and editable draft are retained.
        } finally {
            if (pickAbortRef.current === abort) {
                pickAbortRef.current = null;
                setPicking(false);
            }
        }
    };

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
        <div className={wrapStyle} onMouseDown={stopMouseDown} ref={node => {
            if (node) setSupportsEyeDropper(typeof node.ownerDocument.defaultView?.EyeDropper === "function");
        }}>
            <RcSelect
                aria-label={messages.colorPicker.format}
                className={selectStyle}
                size="small"
                options={FORMAT_OPTIONS}
                value={format}
                onValueChange={(next) => {
                    if (next) onFormatChange(next as ColorFormat);
                }}
            />
            <RcLineEdit
                aria-label={messages.colorPicker.value}
                className={inputStyle}
                size="small"
                spellCheck={false}
                value={text}
                onValueChange={next => setDraft(next)}
                onBlur={(event) => {
                    const view = event.currentTarget.ownerDocument.defaultView;
                    // The screen picker is another way to finish this draft;
                    // moving to its button must not discard unfinished text.
                    if (view && event.relatedTarget instanceof view.HTMLElement && event.relatedTarget.closest('[data-color-eye-dropper]')) return;
                    commit(event.target.value);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        commit((e.target as HTMLInputElement).value);
                    }
                }}
            />
            {showEyeDropper && supportsEyeDropper && <Button
                type="button"
                size="xs"
                appearance="outlined"
                data-color-eye-dropper=""
                aria-label={messages.colorPicker.eyeDropper}
                loading={picking}
                onClick={event => { void pickColor(event.currentTarget); }}
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true" focusable="false"><path d="m14 5 5 5m-7-3L4 15v5h5l8-8m-5-5 3-3a3 3 0 0 1 4 4l-3 3" /></svg>}
            />}
        </div>
    );
};

export default ColorInput;
