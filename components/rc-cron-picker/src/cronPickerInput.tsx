import { useDropdownContext } from '@crab-dev/rc-dropdown-container';
import LineEdit from '@crab-dev/rc-line-edit';
import { css } from '@crab-dev/css';
import { useEffect, useRef, useState, type FC, type KeyboardEvent, type Ref } from 'react';

import { parseCron } from './cron.js';
import token from './token.js';

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

export interface CronPickerInputProps {
    ref?: Ref<HTMLInputElement>;
    /** 当前(已归一化的)合法表达式 */
    expression: string;
    /** 外部传入的 value 本身即非法 */
    invalid: boolean;
    disabled: boolean;
    size: 'large' | 'middle' | 'small';
    status?: 'error' | 'warning';
    placeholder: string;
    ariaLabel: string;
    overlayId: string;
    /** 提交一段手输文本;返回是否为合法表达式 */
    onCommit: (text: string) => boolean;
    onOpenChange?: (open: boolean) => void;
}

const CronPickerInput: FC<CronPickerInputProps> = ({
    ref,
    expression,
    invalid,
    disabled,
    size,
    status,
    placeholder,
    ariaLabel,
    overlayId,
    onCommit,
    onOpenChange,
}) => {
    const { state, refs, dispatch } = useDropdownContext<HTMLDivElement>();
    const open = state.open;

    // 手输草稿:null 表示未在编辑,显示归一化表达式;编辑中即时校验并以 error 边框反馈
    const [draft, setDraft] = useState<string | null>(null);
    const displayed = draft ?? expression;
    const draftInvalid = draft !== null && parseCron(draft) === null;

    // 例外 2(latest-ref):open 变化时转发最新回调,又不让回调身份触发 effect 重跑
    const onOpenChangeRef = useRef(onOpenChange);
    onOpenChangeRef.current = onOpenChange;

    // 开合可能由本组件触发,也可能由 RcDropdownContainer 的外部点击关闭触发,
    // 统一在此转发,避免在各触发点重复调用(与 rc-select 同一处理)
    const isFirstOpenRender = useRef(true);

    useEffect(() => {
        if (isFirstOpenRender.current) {
            isFirstOpenRender.current = false;
            return;
        }

        onOpenChangeRef.current?.(open);
    }, [open]);

    const openPanel = () => {
        if (!disabled && !open) {
            dispatch({ type: 'setOpen', payload: true });
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            // 合法才提交;非法保持编辑态,让 error 边框持续提示待修正(§5 严出)
            if (draft !== null && onCommit(draft)) {
                setDraft(null);
            }
        } else if (e.key === 'Escape') {
            // 放弃草稿回退旧值;面板关闭由 RcDropdownContainer 的 useDismiss 统一处理
            setDraft(null);
        } else if (e.key === 'ArrowDown' && !open) {
            e.preventDefault();
            openPanel();
        }
    };

    const handleBlur = () => {
        if (draft === null) {
            return;
        }

        // 失焦结算:合法提交,非法丢弃回退 —— 控件对外永远只保留合法表达式
        onCommit(draft);
        setDraft(null);
    };

    return (
        <LineEdit
            ref={ref}
            containerRef={refs.setReference}
            size={size}
            disabled={disabled}
            placeholder={placeholder}
            status={draftInvalid || invalid ? 'error' : status}
            value={displayed}
            spellCheck={false}
            autoComplete="off"
            suffix={
                <span className={suffixStyle} onClick={openPanel}>
                    <ClockIcon />
                </span>
            }
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onClick={openPanel}
            onFocus={openPanel}
            aria-label={ariaLabel}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls={open ? overlayId : undefined}
            aria-invalid={draftInvalid || invalid ? true : undefined}
        />
    );
};

export default CronPickerInput;
