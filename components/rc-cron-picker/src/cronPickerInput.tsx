import { useDropdownContext } from '@crab-dev/rc-dropdown-container';
import LineEdit from '@crab-dev/rc-line-edit';
import { css } from '@crab-dev/css';
import { useEffect, useState, type FC, type FocusEvent, type KeyboardEvent, type Ref } from 'react';

import { parseCron } from './cron.js';
import token from './token.js';
import { useCronLocale } from './locale.js';
import type { CronPickerChangeDetails, CronPickerFieldProps } from './types.js';

// Anchor the whole field, including visible validation/supporting text.
// LineEdit.containerRef intentionally points only to its inner control box.
const referenceStyle = css`
    display: grid;
    min-width: 0;
`;

const suffixStyle = css`
    display: inline-flex;
    align-items: center;
    color: ${token.describe.color};
    cursor: pointer;
    padding: 5px;
    margin: -5px;
`;

/* 可打开面板的意符(§2):时钟图标提示这不只是一个文本框 */
const ClockIcon = () => (
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
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
    </svg>
);

export interface CronPickerInputProps extends CronPickerFieldProps {
    ref?: Ref<HTMLInputElement>;
    /** 当前(已归一化的)合法表达式 */
    expression: string;
    /** 外部传入的 value 本身即非法 */
    invalid: boolean;
    disabled: boolean;
    size: 'large' | 'medium' | 'small';
    status?: 'error' | 'warning';
    placeholder: string;
    ariaLabel?: string;
    overlayId: string;
    /** 提交一段手输文本;返回是否为合法表达式 */
    onCommit: (text: string, event?: CronPickerChangeDetails['event']) => boolean;
}

const CronPickerInput: FC<CronPickerInputProps> = ({
    ref,
    expression,
    invalid,
    disabled,
    size,
    status,
    placeholder,
    label,
    supportingText,
    errorText,
    appearance,
    ariaLabel,
    overlayId,
    onCommit,
    onChange,
    onInput,
    onFocus,
    onBlur,
    id,
    name,
    required,
    readOnly,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    'aria-busy': ariaBusy,
}) => {
    const { state, refs, dispatch } = useDropdownContext<HTMLDivElement>();
    const open = state.open;
    const messages = useCronLocale();

    // 手输草稿:null 表示未在编辑,显示归一化表达式;编辑中即时校验并以 error 边框反馈
    const [draft, setDraft] = useState<string | null>(null);
    useEffect(() => { if (!open) setDraft(null); }, [open]);
    const displayed = draft ?? expression;
    const draftInvalid = draft !== null && parseCron(draft) === null;

    const openPanel = () => {
        if (!disabled && !open) {
            dispatch({ type: 'setOpen', payload: true });
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (disabled) return;
        if (e.key === 'Enter') {
            // 合法才提交;非法保持编辑态,让 error 边框持续提示待修正(§5 严出)
            if (draft !== null && onCommit(draft, e)) {
                setDraft(null);
            }
        } else if (e.key === 'Escape') {
            // 丢弃未提交草稿；关闭请求由共享弹层栈处理，保证一次通知。
            setDraft(null);
        } else if (e.key === 'ArrowDown' && !open) {
            e.preventDefault();
            openPanel();
        }
    };

    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
        if (draft === null) {
            return;
        }

        // 失焦结算:合法提交,非法丢弃回退 —— 控件对外永远只保留合法表达式
        onCommit(draft, event);
        setDraft(null);
    };

    return (
        <div ref={refs.setReference} className={referenceStyle}>
            <LineEdit
                label={label}
                supportingText={supportingText ?? messages.format}
                errorText={draftInvalid || invalid ? messages.invalid : errorText}
                appearance={appearance}
                id={id}
                name={name}
                required={required}
                readOnly={readOnly}
                aria-labelledby={ariaLabelledBy}
                aria-describedby={ariaDescribedBy}
                aria-busy={ariaBusy}
                ref={ref}
                size={size}
                disabled={disabled}
                placeholder={placeholder}
                status={draftInvalid || invalid ? 'error' : status}
                value={displayed}
                dir="ltr"
                spellCheck={false}
                autoComplete="off"
                suffix={
                    <span className={suffixStyle} onClick={openPanel}>
                        <ClockIcon />
                    </span>
                }
                onValueChange={(next) => { if (!disabled && !readOnly) setDraft(next); }}
                onChange={onChange}
                onInput={onInput}
                onKeyDown={handleKeyDown}
                onBlur={(event) => { handleBlur(event); onBlur?.(event); }}
                onClick={openPanel}
                onFocus={onFocus}
                aria-label={ariaLabel}
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-controls={open ? overlayId : undefined}
                aria-invalid={draftInvalid || invalid ? true : ariaInvalid}
            />
        </div>
    );
};

export default CronPickerInput;
