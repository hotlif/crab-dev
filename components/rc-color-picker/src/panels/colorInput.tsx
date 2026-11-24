import { useLocale } from '@crab-dev/rc-config-provider';
import RcLineEdit from "@crab-dev/rc-line-edit";
import RcSelect from "@crab-dev/rc-select";
import Button from "@crab-dev/rc-button";
import { useEventCallback } from "@crab-dev/rc-hooks";
import { css } from "@crab-dev/css";
import { type FC, type Ref, useEffect, useImperativeHandle, useRef, useState } from "react";
import token from "../token.js";
import type { ColorFormat, OKLCHValue } from "../types.js";
import { formatColor, parseColor } from "../utils/color.js";

const FORMATS: ColorFormat[] = ["hex", "rgb", "hsl", "oklch"];
const FORMAT_OPTIONS = FORMATS.map((f) => ({ label: f.toUpperCase(), value: f }));
const FORMAT_EXAMPLES: Record<ColorFormat, string> = {
    hex: '#2460a0', rgb: 'rgb(36, 96, 160)', hsl: 'hsl(211, 63%, 38%)', oklch: 'oklch(0.64 0.08 240)',
};

export interface ColorInputProps {
    value: OKLCHValue;
    format: ColorFormat;
    showEyeDropper?: boolean;
    onFormatChange: (format: ColorFormat) => void;
    onValueChange: (value: OKLCHValue) => void;
    editorRef?: Ref<ColorInputEditor>;
}

/** 面板动作可确认或撤回文本草稿。 */
export interface ColorInputEditor {
    confirm(): OKLCHValue | null;
    reset(): void;
}

const wrapStyle = css`
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    align-items: center;
    gap: ${token.input.gap};
    &:has([data-color-eye-dropper]) {
        grid-template-columns: minmax(0, 1fr) auto;
    }
    @media (pointer: coarse) {
        gap: ${token.input.touch.gap};
    }
`;

const selectStyle = css`
    grid-column: 1 / -1;
    width: ${token.input.format.width};
    max-width: 100%;
`;

const inputStyle = css`
    grid-column: 1;
    min-width: min(100%, ${token.input.value['min-width']});
`;

const ColorInput: FC<ColorInputProps> = ({
    value,
    format,
    showEyeDropper = true,
    onFormatChange,
    onValueChange,
    editorRef,
}) => {
    const { locale, messages } = useLocale();
    // 本地编辑草稿:输入期间不即时 parse,失焦 / Enter 才提交;draft 为 null 时跟随外部 value
    const [draft, setDraft] = useState<string | null>(null);
    const [invalid, setInvalid] = useState(false);
    const [supportsEyeDropper, setSupportsEyeDropper] = useState(false);
    const [picking, setPicking] = useState(false);
    const text = draft ?? formatColor(value, format);
    const fieldRef = useRef<HTMLInputElement>(null);
    const resetDraft = () => {
        setDraft(null);
        setInvalid(false);
    };
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
        resetDraft();
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

    const confirmDraft = (focusOnInvalid = false): OKLCHValue | null => {
        const raw = fieldRef.current?.value ?? text;
        if (draft === null && raw === text) return value;
        const parsed = parseColor(raw, format);
        if (!parsed) {
            setDraft(raw);
            setInvalid(true);
            if (focusOnInvalid) fieldRef.current?.focus();
            return null;
        }
        const next = { ...parsed, alpha: parsed.alpha ?? value.alpha };
        resetDraft();
        onValueChange(next);
        return next;
    };
    useImperativeHandle(editorRef, () => ({
        confirm: () => confirmDraft(true),
        reset: resetDraft,
    }));

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
                    if (next && next !== format) {
                        resetDraft();
                        onFormatChange(next as ColorFormat);
                    }
                }}
            />
            <RcLineEdit
                aria-label={messages.colorPicker.value}
                ref={fieldRef}
                className={inputStyle}
                size="small"
                spellCheck={false}
                value={text}
                supportingText={`${locale === 'en-US' ? 'Example' : '例如'} ${FORMAT_EXAMPLES[format]}`}
                errorText={invalid ? (locale === 'en-US'
                    ? `Enter a valid ${format.toUpperCase()} color.`
                    : `请输入有效的 ${format.toUpperCase()} 颜色值。`) : undefined}
                onValueChange={next => {
                    setDraft(next);
                    if (invalid && parseColor(next, format)) setInvalid(false);
                }}
                onBlur={(event) => {
                    const view = event.currentTarget.ownerDocument.defaultView;
                    // The screen picker is another way to finish this draft;
                    // moving to its button must not discard unfinished text.
                    if (view && event.relatedTarget instanceof view.HTMLElement && event.relatedTarget.closest('[data-color-eye-dropper]')) return;
                    confirmDraft();
                }}
                onKeyDown={(e) => {
                    if (e.defaultPrevented || e.nativeEvent.isComposing || e.nativeEvent.keyCode === 229) return;
                    if (e.key === "Enter") {
                        e.preventDefault();
                        confirmDraft();
                    }
                    if (e.key === "Escape" && draft !== null) resetDraft();
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
