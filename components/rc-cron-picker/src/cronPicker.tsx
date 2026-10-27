import RcDropdownContainer from '@crab-dev/rc-dropdown-container';
import { useComponentSize } from '@crab-dev/rc-config-provider';
import { useControllableValue } from '@crab-dev/rc-hooks';
import { useId } from 'react';
import { useCronLocale } from './locale.js';

import {
    createDefaultCronValue,
    DEFAULT_CRON_EXPRESSION,
    formatCron,
    parseCron,
} from './cron.js';
import type { CronFieldKind, CronFieldValue } from './cron.js';
import CronPickerInput from './cronPickerInput.js';
import CronPickerOverlay from './cronPickerOverlay.js';
import type { CronPickerProps, CronPickerChangeDetails } from './types.js';

function CronPicker({
    ref,
    value,
    defaultValue,
    onValueChange,
    size: sizeProp,
    disabled = false,
    readOnly = false,
    status,
    placeholder = DEFAULT_CRON_EXPRESSION,
    previewCount = 5,
    open,
    defaultOpen,
    onOpenChange,
    onChange,
    onInput,
    onFocus,
    onBlur,
    className,
    label,
    supportingText,
    errorText,
    appearance,
    id,
    name,
    required,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    'aria-busy': ariaBusy,
    'aria-label': ariaLabel,
}: CronPickerProps) {
    const size = useComponentSize(sizeProp);
    const openProps = open === undefined ? { defaultOpen } : { open };
    const overlayId = useId();
    const triggerId = id ?? `${overlayId}-trigger`;
    const messages = useCronLocale();
    const [expression, setExpression] = useControllableValue<string, [CronPickerChangeDetails]>({
        value,
        defaultValue: defaultValue ?? DEFAULT_CRON_EXPRESSION,
        onValueChange,
    });

    // 受控传入非法表达式时,面板按默认值展示,输入框以 error 态提示(§4 反馈)
    const parsed = parseCron(expression);
    const cronValue = parsed ?? createDefaultCronValue();

    const handleFieldChange = (kind: CronFieldKind, next: CronFieldValue, event?: CronPickerChangeDetails['event']) => {
        if (disabled || readOnly) return;
        setExpression(formatCron({ ...cronValue, [kind]: next }), { reason: 'field', field: kind, ...(event ? { event } : {}) });
    };

    const handleCommit = (text: string, event?: CronPickerChangeDetails['event']): boolean => {
        if (disabled || readOnly) return false;
        const nextParsed = parseCron(text);

        if (nextParsed === null) {
            return false;
        }

        // 手输经解析后重新格式化,统一归一(英文名转数字、周日 7 转 0、复合形态展开)
        setExpression(formatCron(nextParsed), { reason: 'input', ...(event ? { event } : {}) });

        return true;
    };

    return (
        <RcDropdownContainer
            {...openProps}
            onOpenChange={onOpenChange}
            size={size}
            className={className}
            overlay={
                <CronPickerOverlay
                    overlayId={overlayId}
                    disabled={disabled || readOnly}
                    cronValue={cronValue}
                    previewCount={previewCount}
                    onFieldChange={handleFieldChange}
                />
            }
        >
            <CronPickerInput
                ref={ref}
                id={triggerId}
                name={name}
                required={required}
                readOnly={readOnly}
                aria-labelledby={ariaLabelledBy}
                aria-describedby={ariaDescribedBy}
                aria-invalid={ariaInvalid}
                aria-busy={ariaBusy}
                label={label}
                supportingText={supportingText}
                errorText={errorText}
                appearance={appearance}
                expression={expression}
                invalid={parsed === null}
                disabled={disabled}
                size={size}
                status={status}
                placeholder={placeholder}
                ariaLabel={ariaLabel ?? (label || id || ariaLabelledBy ? undefined : messages.label)}
                overlayId={overlayId}
                onCommit={handleCommit}
                onChange={onChange}
                onInput={onInput}
                onFocus={onFocus}
                onBlur={onBlur}
            />
        </RcDropdownContainer>
    );
};

export default CronPicker;
