import RcDropdownContainer from '@crab-dev/rc-dropdown-container';
import { useControllableValue } from '@crab-dev/rc-hooks';
import { useId } from 'react';
import type { FC } from 'react';

import {
    createDefaultCronValue,
    DEFAULT_CRON_EXPRESSION,
    formatCron,
    parseCron,
} from './cron.js';
import type { CronFieldKind, CronFieldValue } from './cron.js';
import CronPickerInput from './cronPickerInput.js';
import CronPickerOverlay from './cronPickerOverlay.js';
import type { CronPickerProps } from './types.js';

const CronPicker: FC<CronPickerProps> = ({
    ref,
    value,
    defaultValue,
    onChange,
    size = 'middle',
    disabled = false,
    status,
    placeholder = DEFAULT_CRON_EXPRESSION,
    previewCount = 5,
    onOpenChange,
    className,
    'aria-label': ariaLabel = 'Cron 表达式',
}) => {
    const overlayId = useId();
    const [expression, setExpression] = useControllableValue<string>({
        value,
        defaultValue: defaultValue ?? DEFAULT_CRON_EXPRESSION,
        onChange,
    });

    // 受控传入非法表达式时,面板按默认值展示,输入框以 error 态提示(§4 反馈)
    const parsed = parseCron(expression);
    const cronValue = parsed ?? createDefaultCronValue();

    const handleFieldChange = (kind: CronFieldKind, next: CronFieldValue) => {
        setExpression(formatCron({ ...cronValue, [kind]: next }));
    };

    const handleCommit = (text: string): boolean => {
        const nextParsed = parseCron(text);

        if (nextParsed === null) {
            return false;
        }

        // 手输经解析后重新格式化,统一归一(英文名转数字、周日 7 转 0、复合形态展开)
        setExpression(formatCron(nextParsed));

        return true;
    };

    return (
        <RcDropdownContainer
            className={className}
            overlay={
                <CronPickerOverlay
                    overlayId={overlayId}
                    cronValue={cronValue}
                    previewCount={previewCount}
                    onFieldChange={handleFieldChange}
                />
            }
        >
            <CronPickerInput
                ref={ref}
                expression={expression}
                invalid={parsed === null}
                disabled={disabled}
                size={size}
                status={status}
                placeholder={placeholder}
                ariaLabel={ariaLabel}
                overlayId={overlayId}
                onCommit={handleCommit}
                onOpenChange={onOpenChange}
            />
        </RcDropdownContainer>
    );
};

export default CronPicker;
