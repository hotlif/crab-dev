import { useFieldA11y } from "@crab-dev/rc-hooks/internal";
import { useControllableValue, type ControlledValueProps } from '@crab-dev/rc-hooks';
import { useComponentSize, useLocale } from '@crab-dev/rc-config-provider';
import { css, cx } from "@crab-dev/css";
import Button from "@crab-dev/rc-button";
import { X } from "lucide-react";
import { type Ref, type ChangeEvent, type MouseEvent, type TextareaHTMLAttributes } from "react";
import token, { vars } from "./token.js";
import { containerBaseStyle, errorStyle, warningStyle, borderlessStyle, textareaBaseStyle, borderlessTextareaStyle, autoSizeStyle, clearSpaceStyle, clearButtonStyle, countStyle, fieldStyle, legendRequiredStyle, outlineStyle, appearanceStyle, supportingStyle } from "./textEdit.styles.js";
interface BaseTextEditProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "ref" | "value" | "defaultValue"> {
    /** 字段外观，默认 outlined；bordered=false 时由宿主提供外观。 */
    appearance?: "outlined" | "filled";
    /** 可见标签；Material 使用浮动标签，shadcn 使用上方标签。 */
    label?: string;
    /** 文本域下方的辅助说明，自动加入 aria-describedby。 */
    supportingText?: string;
    /** 错误说明；提供时自动启用 error 状态并替换辅助说明。 */
    errorText?: string;
    /**
     * textarea 元素的 ref
     */
    ref?: Ref<HTMLTextAreaElement>;

    /**
     * 容器 div 的 ref
     */
    containerRef?: Ref<HTMLDivElement>;

    /**
     * 控件几何档位，默认为 medium；不缩放正文，内容高度由 rows / autoSize 决定。
     * Apple / shadcn 调整内边距和最小高度；MD3 三档保持标准字段几何，
     * 仅内部清除动作分档。bordered=false 时几何和排版由宿主提供。
     */
    size?: "large" | "medium" | "small";

    /**
     * 验证状态，影响边框颜色以提供即时反馈
     */
    status?: "error" | "warning";

    /**
     * 是否显示外层边框/背景/阴影，默认为 true。
     * 设为 false 时容器变为无样式（透明、无边框），
     * 用于嵌入到已有边框的宿主容器中（例如作为表单项内部的备注框）
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

    /**
     * 高度随内容自动增长（CSS field-sizing: content，浏览器不支持时按 rows 回退）；
     * 开启后禁用手动拖拽调整尺寸，避免两种高度控制方式互相冲突
     */
    autoSize?: boolean;

    /**
     * 手动拖拽调整尺寸的方向，默认为 vertical；autoSize 开启时忽略
     */
    resize?: "none" | "vertical" | "both";
}

export interface TextEditChangeDetails {
    reason: 'input' | 'clear';
    event?: ChangeEvent<HTMLTextAreaElement> | MouseEvent<HTMLButtonElement>;
}

export type TextEditProps = BaseTextEditProps & ControlledValueProps<string, TextEditChangeDetails>;

// 按尺寸预生成容器内边距，避免在渲染中创建动态类
const sizeContainerStyles = {
    large: css`
        ${vars['field.control.min-height']}: ${token.size.large['min-height']};
        ${vars['field.control.padding-inline']}: ${token.size.large['padding-inline']};
        ${vars['field.input.multiline.padding-block']}: ${token.size.large['padding-block']};
        ${vars['field.input.multiline.filled.padding-top']}: ${token.size.large.filled['padding-top']};
        ${vars['field.input.multiline.filled.padding']}: ${token.size.large.filled.padding};
        ${vars['clear.inset-block-start']}: ${token.size.large['padding-block']};
        ${vars['clear.inset-inline-end']}: ${token.size.large['padding-inline']};
        min-height: ${token.field.control['min-height']};
        padding: ${token.size.large.padding};
        ${vars['clear.width']}: ${token.size.large.action.width};
        ${vars['clear.height']}: ${token.size.large.action.width};
    `,
    medium: css`
        ${vars['field.control.min-height']}: ${token.size.medium['min-height']};
        ${vars['field.control.padding-inline']}: ${token.size.medium['padding-inline']};
        ${vars['field.input.multiline.padding-block']}: ${token.size.medium['padding-block']};
        ${vars['field.input.multiline.filled.padding-top']}: ${token.size.medium.filled['padding-top']};
        ${vars['field.input.multiline.filled.padding']}: ${token.size.medium.filled.padding};
        ${vars['clear.inset-block-start']}: ${token.size.medium['padding-block']};
        ${vars['clear.inset-inline-end']}: ${token.size.medium['padding-inline']};
        min-height: ${token.field.control['min-height']};
        padding: ${token.size.medium.padding};
        ${vars['clear.width']}: ${token.size.medium.action.width};
        ${vars['clear.height']}: ${token.size.medium.action.width};
    `,
    small: css`
        ${vars['field.control.min-height']}: ${token.size.small['min-height']};
        ${vars['field.control.padding-inline']}: ${token.size.small['padding-inline']};
        ${vars['field.input.multiline.padding-block']}: ${token.size.small['padding-block']};
        ${vars['field.input.multiline.filled.padding-top']}: ${token.size.small.filled['padding-top']};
        ${vars['field.input.multiline.filled.padding']}: ${token.size.small.filled.padding};
        ${vars['clear.inset-block-start']}: ${token.size.small['padding-block']};
        ${vars['clear.inset-inline-end']}: ${token.size.small['padding-inline']};
        min-height: ${token.field.control['min-height']};
        padding: ${token.size.small.padding};
        ${vars['clear.width']}: ${token.size.small.action.width};
        ${vars['clear.height']}: ${token.size.small.action.width};
    `,
} as const;

// 按尺寸预生成字体样式，共享给 textarea 和操作区
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

// resize 方向拆为静态类，运行时用 cx() 选用（Crab CSS 零运行时约束）
const resizeStyles = {
    none: css`
        resize: none;
    `,
    vertical: css`
        resize: vertical;
    `,
    both: css`
        resize: both;
    `,
} as const;

function TextEdit({
    ref,
    id,
    size: sizeProp,
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
    autoSize,
    resize = "vertical",
    bordered = true,
    appearance = "outlined",
    label,
    supportingText,
    errorText,
    placeholder,
    ...rest
}: TextEditProps) {
    const size = useComponentSize(sizeProp);
    const { messages } = useLocale();
    const [displayValue, setValue] = useControllableValue<string, [TextEditChangeDetails]>({ value, defaultValue: defaultValue ?? '', onValueChange });

    const hasValue = typeof displayValue === "string" && displayValue.length > 0;
    const showClearButton = allowClear && hasValue && !disabled && !readOnly;
    const enhancedField = Boolean(label || supportingText || errorText || showCount);
    const { inputId, description, descriptionId, countId, fieldStatus, describedBy } = useFieldA11y({
        id, supportingText, errorText, status, describedBy: rest["aria-describedby"],
        hasCount: Boolean(showCount && typeof displayValue === "string"),
    });
    const count = showCount && typeof displayValue === "string" ? (
        <span id={countId} className={countStyle}>
            {displayValue.length}{maxLength != null ? `/${maxLength}` : ""}
        </span>
    ) : null;

    const control = (
        <div
            ref={containerRef}
            data-control=""
            aria-disabled={disabled || undefined}
            data-appearance={bordered ? appearance : undefined}
            data-labeled={Boolean(label && bordered)}
            data-status={fieldStatus}
            style={style}
            className={cx(
                containerBaseStyle,
                bordered ? sizeContainerStyles[size] : borderlessStyle,
                bordered && !disabled && fieldStatus === "error" && errorStyle,
                bordered && !disabled && fieldStatus === "warning" && warningStyle,
                bordered && appearanceStyle,
                className
            )}
        >
            <textarea
                ref={ref}
                id={inputId}
                value={displayValue}
                onChange={(event) => {
                    setValue(event.currentTarget.value, { reason: 'input', event });
                    onChange?.(event);
                }}
                maxLength={maxLength}
                placeholder={placeholder ?? (label ? " " : undefined)}
                disabled={disabled}
                readOnly={readOnly}
                className={cx(
                    textareaBaseStyle,
                    bordered ? sizeTextStyles[size] : borderlessTextareaStyle,
                    autoSize ? autoSizeStyle : resizeStyles[resize],
                    allowClear && clearSpaceStyle
                )}
                {...rest}
                aria-invalid={rest['aria-invalid'] ?? (fieldStatus === "error" || undefined)}
                aria-describedby={describedBy}
            />
            {label && bordered && appearance === "outlined" && (
                <fieldset aria-hidden="true" className={outlineStyle}>
                    <legend>{label}{rest.required && <span className={legendRequiredStyle}>*</span>}</legend>
                </fieldset>
            )}
            {showClearButton && (
                <Button
                    type="button"
                    appearance="text"
                    size="xs"
                    aria-label={messages.common.clear}
                    aria-controls={inputId}
                    icon={<X aria-hidden="true" />}
                    className={clearButtonStyle}
                    onClick={(e) => {
                        e.stopPropagation();
                        // 清除后按钮可能消失，焦点留在可继续输入的文本域。
                        const input = e.currentTarget.parentElement?.querySelector('textarea');
                        if (input) {
                            input.focus();
                            setValue('', { reason: 'clear', event: e });
                        }
                        onClear?.();
                    }}
                />
            )}
        </div>
    );

    return enhancedField ? (
        <div
            data-field-root=""
            className={fieldStyle}
            data-bordered={bordered}
            data-labeled={Boolean(label)}
            data-appearance={appearance}
            data-status={fieldStatus}
            aria-disabled={disabled || undefined}
        >
            {label && <label htmlFor={inputId}><span data-field-label-text="">{label}</span>{rest.required && <span data-required-marker="" aria-hidden="true">*</span>}</label>}
            {control}
            {(description || count) && (
                <div className={supportingStyle} data-support="" data-status={disabled ? undefined : fieldStatus}>
                    <span id={description ? descriptionId : undefined} role={errorText ? "alert" : undefined}>{description}</span>
                    {count}
                </div>
            )}
        </div>
    ) : control;
}

export default TextEdit;
