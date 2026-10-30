import { useFieldA11y } from "@crab-dev/rc-hooks/internal";
import { useControllableValue, type ControlledValueProps } from '@crab-dev/rc-hooks';
import { useComponentSize, useLocale } from '@crab-dev/rc-config-provider';
import { css, cx } from "@crab-dev/css";
import Button from "@crab-dev/rc-button";
import { Eye, EyeOff, X } from "lucide-react";
import { useState, type InputHTMLAttributes, type ReactNode, type Ref, type ChangeEvent, type MouseEvent } from "react";
import token, { vars } from "./token.js";
import { containerBaseStyle, errorStyle, warningStyle, borderlessStyle, inputBaseStyle, borderlessInputStyle, iconBaseStyle, prefixStyle, suffixStyle, actionButtonStyle, countStyle, legendRequiredStyle, fieldStyle, labeledControlStyle, filledControlStyle, supportingStyle } from "./lineEdit.styles.js";
interface BaseLineEditProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix" | "size" | "value" | "defaultValue"> {
    /** 字段外观，默认 outlined；bordered=false 时由宿主提供外观。 */
    appearance?: "outlined" | "filled";
    /** 与输入框关联的可见标签；Material 浮动，Apple 与 shadcn 上置。 */
    label?: string;
    /** 输入框下方的辅助说明，自动加入 aria-describedby。 */
    supportingText?: string;
    /** 错误说明；提供时自动启用 error 状态并替换辅助说明。 */
    errorText?: string;
    /**
     * input 元素的 ref
     */
    ref?: Ref<HTMLInputElement>;

    /**
     * 容器 div 的 ref
     */
    containerRef?: Ref<HTMLDivElement>;

    /**
     * 设置单行文本输入框的大小，默认为 medium
     */
    size?: "large" | "medium" | "small";

    /**
     * 前缀图标
     */
    prefix?: ReactNode;

    /**
     * 后缀图标
     */
    suffix?: ReactNode;

    /**
     * 验证状态，影响边框颜色以提供即时反馈
     */
    status?: "error" | "warning";

    /**
     * 是否显示外层边框/背景/阴影，默认为 true。
     * 设为 false 时容器变为无样式（透明、无边框、高度随内容自适应），
     * 用于嵌入到已有边框的宿主容器中（例如作为另一个组件内部的搜索框）
     */
    bordered?: boolean;

    /**
     * 是否允许一键清除内容；触发 onValueChange，受控模式由父组件接受新值
     */
    allowClear?: boolean;

    /**
     * 点击清除按钮时的回调
     */
    onClear?: () => void;

    /**
     * 是否显示字符计数，配合 maxLength 使用
     */
    showCount?: boolean;
}


export interface LineEditChangeDetails {
    reason: 'input' | 'clear';
    event?: ChangeEvent<HTMLInputElement> | MouseEvent<HTMLButtonElement>;
}

export type LineEditProps = BaseLineEditProps & ControlledValueProps<string, LineEditChangeDetails>;

// 按尺寸预生成容器高度/内边距，避免在渲染中创建动态类
const sizeContainerStyles = {
    large: css`
        min-height: max(${token.size.large.height}, ${token.field.control['min-height']});
        ${vars['field.control.height']}: ${token.size.large.height};
        ${vars['action.min-width']}: ${token.size.large.action.width};
        ${vars['action.height']}: ${token.size.large.action.width};
        padding: ${token.size.large.padding};
    `,
    medium: css`
        min-height: max(${token.size.medium.height}, ${token.field.control['min-height']});
        ${vars['field.control.height']}: ${token.size.medium.height};
        ${vars['action.min-width']}: ${token.size.medium.action.width};
        ${vars['action.height']}: ${token.size.medium.action.width};
        padding: ${token.size.medium.padding};
    `,
    small: css`
        min-height: max(${token.size.small.height}, ${token.field.control['min-height']});
        ${vars['field.control.height']}: ${token.size.small.height};
        ${vars['action.min-width']}: ${token.size.small.action.width};
        ${vars['action.height']}: ${token.size.small.action.width};
        padding: ${token.size.small.padding};
    `,
} as const;

// 按尺寸预生成字体样式，共享给 input 和图标
const sizeTextStyles = {
    large: css`
        font-size: ${token.size.large['font-size']};
        line-height: ${token.size.large['line-height']};
    `,
    medium: css`
        font-size: ${token.size.medium['font-size']};
        line-height: ${token.size.medium['line-height']};
    `,
    small: css`
        font-size: ${token.size.small['font-size']};
        line-height: ${token.size.small['line-height']};
    `,
} as const;


function LineEdit({
    ref,
    id,
    size: sizeProp,
    prefix,
    suffix,
    type,
    value,
    defaultValue,
    onChange,
    onValueChange,
    containerRef,
    className,
    style,
    readOnly,
    disabled,
    maxLength,
    status,
    allowClear,
    onClear,
    showCount,
    bordered = true,
    appearance = "outlined",
    label,
    supportingText,
    errorText,
    placeholder,
    ...rest
}: LineEditProps) {
    const size = useComponentSize(sizeProp);
    const { messages } = useLocale();
    // 密码可见性：内部 UI 状态，与业务无关
    const [showPassword, setShowPassword] = useState(false);
    const [displayValue, setValue] = useControllableValue<string, [LineEditChangeDetails]>({ value, defaultValue: defaultValue ?? '', onValueChange });


    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;
    const hasValue = typeof displayValue === "string" && displayValue.length > 0;
    const showClearButton = allowClear && hasValue && !disabled && !readOnly;
    const enhancedField = Boolean(label || supportingText || errorText);
    const { inputId, description, descriptionId, countId, fieldStatus, describedBy } = useFieldA11y({
        id, supportingText, errorText, status, describedBy: rest["aria-describedby"],
        hasCount: Boolean(showCount && typeof displayValue === "string"),
    });
    const count = showCount && typeof displayValue === "string" ? (
        <span id={countId} className={countStyle} aria-label={messages.fields.characterCount(displayValue.length, maxLength)}>{displayValue.length}{maxLength != null ? `/${maxLength}` : ""}</span>
    ) : null;

    const control = (
        <div
            ref={containerRef}
            data-field-control=""
            aria-disabled={disabled || undefined}
            data-appearance={bordered ? appearance : undefined}
            data-labeled={Boolean(label && bordered)}
            data-prefix={Boolean(prefix)}
            data-suffix={Boolean(suffix || isPassword || showClearButton)}
            data-status={fieldStatus}
            style={style}
            className={cx(
                containerBaseStyle,
                bordered ? sizeContainerStyles[size] : borderlessStyle,
                bordered && fieldStatus === "error" && errorStyle,
                bordered && fieldStatus === "warning" && warningStyle,
                bordered && label && labeledControlStyle,
                bordered && appearance === "filled" && filledControlStyle,
                className
            )}
        >
            {label && bordered && appearance === "outlined" && <fieldset aria-hidden="true"><legend>{label}{rest.required && <span className={legendRequiredStyle}>*</span>}</legend></fieldset>}
            {prefix && (
                <div data-field-prefix="" className={cx(iconBaseStyle, prefixStyle, sizeTextStyles[size])}>
                    {prefix}
                </div>
            )}
            <input
                ref={ref}
                id={inputId}
                type={inputType}
                value={displayValue}
                onChange={(event) => {
                    setValue(event.currentTarget.value, { reason: 'input', event });
                    onChange?.(event);
                }}
                maxLength={maxLength}
                placeholder={placeholder ?? (label ? " " : undefined)}
                disabled={disabled}
                readOnly={readOnly}
                className={cx(inputBaseStyle, bordered ? sizeTextStyles[size] : borderlessInputStyle)}
                {...rest}
                aria-invalid={rest['aria-invalid'] ?? (fieldStatus === "error" || undefined)}
                aria-describedby={describedBy}
            />
            {showClearButton && (
                <Button
                    type="button"
                    appearance="text"
                    size="xs"
                    aria-label={messages.common.clear}
                    aria-controls={inputId}
                    icon={<X aria-hidden="true" />}
                    className={actionButtonStyle}
                    onClick={(e) => {
                        e.stopPropagation();
                        // 清除可能立即卸载按钮，先把焦点送回被操作的输入框。
                        const input = e.currentTarget.parentElement?.querySelector('input');
                        if (input) {
                            input.focus();
                            setValue('', { reason: 'clear', event: e });
                        }
                        onClear?.();
                    }}
                />
            )}
            {suffix && (
                <div data-field-suffix="" className={cx(iconBaseStyle, suffixStyle, sizeTextStyles[size])}>
                    {suffix}
                </div>
            )}
            {isPassword && (
                <Button
                    type="button"
                    appearance="text"
                    size="xs"
                    disabled={disabled}
                    aria-label={showPassword ? messages.fields.hidePassword : messages.fields.showPassword}
                    aria-controls={inputId}
                    icon={showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                    className={actionButtonStyle}
                    onClick={() => setShowPassword(prev => !prev)}
                />
            )}
            {!enhancedField && count}
        </div>
    );
    return enhancedField ? <div data-field-root="" className={fieldStyle} data-labeled={Boolean(label && bordered)} data-appearance={appearance} data-status={fieldStatus} data-disabled={disabled || undefined} data-prefix={Boolean(prefix)}>
        {label && <label htmlFor={inputId}><span data-field-label-text="">{label}</span>{rest.required && <span data-required-marker="" aria-hidden="true">*</span>}</label>}
        {control}
        {(description || count) && <div className={supportingStyle} data-field-support="" data-status={fieldStatus}>
            <span id={descriptionId} role={errorText ? "alert" : undefined} aria-live={errorText ? undefined : "polite"}>{description}</span>
            {count}
        </div>}
    </div> : control;
}

export default LineEdit;
