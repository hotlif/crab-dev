import { cloneElement, useState, useEffect, useEffectEvent, useId, useRef } from "react";
import type { ReactElement, HTMLAttributes, ReactNode } from "react";
import { cx } from "@crab-dev/css";
import { CircleAlert, TriangleAlert, CircleCheck } from "lucide-react";
import { SpinIndicator } from '@crab-dev/rc-spin';
import { useLocale } from '@crab-dev/rc-config-provider';
import { fieldAdapters } from './field-adapters.js';
import type { FieldAdapter, FieldBinding } from './field-adapters.js';
import { RuleType, ValidateState } from "./types.js";
import type { FormItemEditor, NamePath, Rule, FieldValidationResult } from "./types.js";
import useFormContext from "./hooks/useFormContext.js";
import { MessageEnum } from "./bus.js";
import { getRecordValue, equalsNamePath } from "./util.js";
import { rowStyle, labelStyle, requiredStyle, editorWrapStyle, controlEditorWrapStyle, statusSlotStyle, errorColorStyle, warningColorStyle, successColorStyle, validatingStyle, validationMessageStyle } from "./item.styles.js";
const EMPTY_RULES: Rule[] = [];

// Preserve the origin of library-owned feedback. Locale changes format these
// descriptors without invoking validators or guessing from a caller's message.
type ValidationMessage =
    | { kind: 'required' }
    | { kind: 'invalid' }
    | { kind: 'custom'; text: string };

function validatorMessage(error: unknown): ValidationMessage {
    const text = error instanceof Error ? error.message : error == null ? '' : String(error);
    return text.trim() ? { kind: 'custom', text } : { kind: 'invalid' };
}

interface FormItemBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {

    /** Default: value/onValueChange. Native DOM and custom editors use explicit adapters. */
    adapter?: FieldBinding | FieldAdapter;
    disabled?: boolean;
    readOnly?: boolean;

    /**
     * 是否隐藏字段
     */
    hidden?: boolean

    /**
     * 字段名称
     */
    name: NamePath

    /**
     * 是否必填
     */
    required?: boolean

    /**
     * 校验规则
     */
    rules?: Rule[]

    /**
     * 编辑器
     */
    children?: ReactElement<FormItemEditor> | ((field: FormItemEditor) => ReactNode)
}

export type FormItemProps = FormItemBaseProps & (
    | {
        /** 由 Item 显示外部标签，兼容横排布局与任意编辑器。 */
        labelPlacement?: 'external';
        /** 默认关联一个原生可标记控件，保留其自身标签与点击语义。 */
        labelTarget?: 'control';
        label?: ReactNode;
        supportingText?: never;
    }
    | {
        /** 组语义必须显式选择外部布局，不依赖宿主或编辑器类型推断。 */
        labelPlacement: 'external';
        labelTarget: 'group';
        label: ReactNode;
        supportingText?: never;
    }
    | {
        /** 将标签、说明与内部布局交给字段组件；Item 提供跨整行的编辑器空间。 */
        labelPlacement: 'control';
        labelTarget?: never;
        label: string;
        /** 字段下方的辅助说明，校验消息会临时替换它。 */
        supportingText?: string;
    }
);

function FormItemComponent({
    className,
    hidden,
    label,
    labelPlacement = 'external',
    labelTarget = 'control',
    supportingText,
    name,
    required,
    disabled,
    readOnly,
    adapter: adapterProp = 'value',
    rules = EMPTY_RULES,
    children,
    ...restProps
}: FormItemProps) {
    const adapter = typeof adapterProp === 'string' ? fieldAdapters[adapterProp] : adapterProp;
    const { messages } = useLocale();
    const id = useId();
    const labelId = `${id}-label`;
    const messageId = `${id}-message`;
    const {
        eventBus,
        getFieldValue,
        requiredIndicatorRenderer
    } = useFormContext();

    // 实际上存储的值
    const [value, setValue] = useState<unknown>(() => getFieldValue?.(name));
    // 可变实例状态：同一事件中的 setFieldValue 和 validateFields 共享最新值。
    const valueRef = useRef<unknown>(value);
    const fieldKey = JSON.stringify(typeof name === 'string' ? [name] : name);
    useEffect(() => {
        const next = getFieldValue?.(JSON.parse(fieldKey) as string[]);
        valueRef.current = next;
        setValue(next);
    }, [getFieldValue, fieldKey]);
    // 校验状态
    const [validateState, setValidateState] = useState<ValidateState>(ValidateState.DEFAULT);
    // Store semantic feedback, not the language used when validation began.
    const [validationMessages, setValidationMessages] = useState<ValidationMessage[]>([]);
    const formatValidationMessage = (message: ValidationMessage) => {
        if (message.kind === 'required') return messages.form.required(typeof label === 'string' ? label : undefined);
        if (message.kind === 'invalid') return messages.form.invalid;
        return message.text;
    };
    const validateMessage = validationMessages.map(formatValidationMessage).join('\n');
    // The effect-owned validation listener can finish after a locale update.
    // Public errors remain string snapshots, formatted in the completion locale.
    const validationResult = useEffectEvent((fieldName: NamePath, errors: ValidationMessage[], warnings: ValidationMessage[]): FieldValidationResult => ({
        name: fieldName,
        errors: errors.map(formatValidationMessage),
        warnings: warnings.map(formatValidationMessage),
    }));
    // 可变实例状态：忽略编辑、重置或卸载前发起的异步校验结果。
    const validationVersion = useRef(0);
    useEffect(() => () => { validationVersion.current += 1; }, []);

    const isInvalid = validateState === ValidateState.ERROR || validateState === ValidateState.WARNING;
    // 精简状态映射，透传给编辑器驱动其边框等即时反馈
    const editorStatus: "error" | "warning" | undefined =
        validateState === ValidateState.ERROR ? "error"
            : validateState === ValidateState.WARNING ? "warning"
                : undefined;
    const controlLabel = labelPlacement === 'control' && typeof label === 'string' ? label : undefined;
    const editorClassName = labelPlacement === 'control' ? controlEditorWrapStyle : editorWrapStyle;

    const renderRequiredElement = () => {
        if (required) {
            return (
                <span aria-hidden className={requiredStyle}>*</span>
            );
        }
        return null;
    };

    // 渲染 label
    const renderLabelElement = () => {
        if (labelPlacement === 'control' || label == null) {
            return null;
        }
        const renderedLabel = requiredIndicatorRenderer ? requiredIndicatorRenderer({
            label,
            required: required === true
        }) : (
            <>
                <span>{label}</span>
                {renderRequiredElement()}
            </>
        );
        if (labelTarget === 'group') {
            // A group is named as a whole; its visible caption must not label
            // just the first native option or pretend a div is labelable.
            return <span id={labelId} className={labelStyle}>{renderedLabel}</span>;
        }
        return (
            <label id={labelId} htmlFor={typeof children === 'function' ? id : children?.props.id ?? id} className={labelStyle}>
                {renderedLabel}
            </label>
        );
    };

    // 错误和警告说明持续显示在字段下方，末尾图标仅提供额外的非颜色提示。
    const renderStatusElement = () => {
        // control 模式由编辑器显示错误/警告，不重复渲染外部状态槽。
        if (labelPlacement === 'control') return null;
        if (validateState === ValidateState.VALIDATING) {
            return (
                <span className={cx.call(undefined, statusSlotStyle, validatingStyle)} aria-hidden>
                    <SpinIndicator />
                </span>
            );
        }
        if (validateState === ValidateState.SUCCESS) {
            return (
                <span className={cx.call(undefined, statusSlotStyle, successColorStyle)} aria-hidden>
                    <CircleCheck />
                </span>
            );
        }
        if (isInvalid) {
            const Icon = validateState === ValidateState.ERROR ? CircleAlert : TriangleAlert;
            const colorStyle = validateState === ValidateState.ERROR ? errorColorStyle : warningColorStyle;
            return (
                <span className={cx.call(undefined, statusSlotStyle, colorStyle)} aria-hidden>
                    <Icon />
                </span>
            );
        }
        // DEFAULT：空占位，槽位固定尺寸保证布局稳定
        return <span className={statusSlotStyle} aria-hidden />;
    };

    // 渲染编辑器
    const renderEditorElement = () => {
        if (children == null) {
            return null;
        }
        const props = typeof children === 'function' ? {} : children.props;
        const changeValue = (newValue: unknown) => {
            validationVersion.current += 1;
            valueRef.current = newValue;
            setValue(newValue);
            setValidateState(ValidateState.DEFAULT);
            setValidationMessages([]);
            eventBus?.dispatch({ type: MessageEnum.ON_ITEM_VALUE_CHANGE, payload: [{ name, value: newValue }] });
        };
        const hasExplicitName = props['aria-label'] !== undefined || props['aria-labelledby'] !== undefined;
        const groupLabelledBy = labelPlacement === 'external' && labelTarget === 'group' && label != null && !hasExplicitName
            ? labelId
            : undefined;
        const field: FormItemEditor = {
            id: props.id ?? id,
            'aria-label': props['aria-label'],
            'aria-labelledby': props['aria-labelledby'] ?? groupLabelledBy,
            name: typeof name === 'string' ? name : name.join('.'),
            disabled: disabled ?? props.disabled,
            readOnly: readOnly ?? props.readOnly,
            required: required ?? props.required,
            value,
            validateState,
            status: editorStatus,
            'aria-invalid': validateState === ValidateState.ERROR || undefined,
            'aria-describedby': [props['aria-describedby'], isInvalid && labelPlacement !== 'control' ? messageId : undefined].filter(Boolean).join(' ') || undefined,
            onValueChange: changeValue,
            ...(labelPlacement === 'control' ? {
                label: props.label ?? controlLabel,
                required: required ?? props.required,
                errorText: validateState === ValidateState.ERROR ? validateMessage : props.errorText,
                supportingText: validateState === ValidateState.WARNING ? validateMessage : props.supportingText ?? supportingText,
                'aria-busy': validateState === ValidateState.VALIDATING || undefined,
            } : {}),
        };
        if (typeof children === 'function') return <div className={editorClassName}>{children(field)}</div>;
        const childProps = props as Record<string, unknown>;
        const handleChange = (...args: unknown[]) => {
            const next = adapter.getValue(...args);
            changeValue(next);
            const handler = childProps[adapter.changeProp];
            if (typeof handler === 'function') handler(...args);
        };
        const editorProps = {
            ...field,
            ...adapter.getValueProps(value),
            [adapter.changeProp]: handleChange,
        };
        if (adapter.valueProp !== 'value') delete editorProps.value;
        if (adapter.changeProp !== 'onValueChange') delete editorProps.onValueChange;
        // Validation bookkeeping belongs to render-prop consumers, not DOM props
        // forwarded by a real editor such as LineEdit.
        delete editorProps.validateState;
        if (adapter.native) {
            delete editorProps.status;
        }
        return (
            <div className={editorClassName}>
                {cloneElement(children, editorProps)}
            </div>
        );
    };

    useEffect(() => {
        const onSendToChangeItemValue = (param: {
            name: NamePath,
            value: unknown
        }) => {
            if (equalsNamePath(param.name, name)) {
                validationVersion.current += 1;
                valueRef.current = param.value;
                setValue(param.value);
            }
        }

        const subscriber = {
            id,
            type: MessageEnum.SEND_TO_CHAGE_ITEM_VALUE,
            ring: onSendToChangeItemValue
        }
        eventBus?.subscribe(subscriber);
        const onTriggerItemVerification = async (fields?: readonly NamePath[], snapshot?: object): Promise<FieldValidationResult | undefined> => {
            if (fields != null && !fields.some(field => equalsNamePath(field, name))) {
                return;
            }
            const version = ++validationVersion.current;
            const errors: ValidationMessage[] = [];
            const warnings: ValidationMessage[] = [];
            const currentValue = snapshot ? getRecordValue(snapshot, name) : valueRef.current;
            setValidateState(ValidateState.VALIDATING);
            if (required === true && (currentValue == null || currentValue === "" || (Array.isArray(currentValue) && currentValue.length === 0))) {
                errors.push({ kind: 'required' });
            }
            for (let i = 0; i < rules.length; i += 1) {
                const rule = rules[i];
                if (rule.type == RuleType.ERROR || rule.type == RuleType.WARNING) {
                    try {
                        await rule.validator(currentValue)
                    } catch (error) {
                        const message = validatorMessage(error);
                        if (rule.type == RuleType.ERROR) {
                            errors.push(message);
                        } else {
                            warnings.push(message);
                        }
                    }
                }
            }
            if (validationVersion.current === version) {
                setValidationMessages([...errors, ...warnings]);
                setValidateState(errors.length ? ValidateState.ERROR : warnings.length ? ValidateState.WARNING : ValidateState.SUCCESS);
            }
            return validationResult(name, errors, warnings);
        }
        const verificationSubscriber = {
            id,
            type: MessageEnum.TRIGGER_ITEM_VERIFICATION,
            ring: onTriggerItemVerification
        }
        eventBus?.subscribe(verificationSubscriber);

        const onParentReady = () => {
            onSendToChangeItemValue({
                name,
                value
            })
        }
        const parentReadySubscriber = {
            id,
            type: MessageEnum.ON_PARENT_READY,
            ring: onParentReady
        }
        eventBus?.subscribe(parentReadySubscriber)

        const onChangeValues = (values: Record<string, unknown>) => {
            validationVersion.current += 1;
            const newValue = getRecordValue(values, name);
            valueRef.current = newValue;
            setValue(newValue);
        }

        const changeValuesSubscriber = {
            id,
            type: MessageEnum.SEND_TO_CHAGE_VALUES,
            ring: onChangeValues
        }
        eventBus?.subscribe(changeValuesSubscriber)

        const resetSubscriber = {
            id,
            type: MessageEnum.RESET_VALIDATION,
            ring: (names?: readonly NamePath[]) => {
                if (names && !names.some(field => equalsNamePath(field, name))) return;
                validationVersion.current += 1;
                setValidateState(ValidateState.DEFAULT);
                setValidationMessages([]);
            },
        };
        eventBus?.subscribe(resetSubscriber);

        return () => {
            eventBus?.unSubscribe(resetSubscriber);
            eventBus?.unSubscribe(subscriber);
            eventBus?.unSubscribe(verificationSubscriber);
            eventBus?.unSubscribe(parentReadySubscriber);
            eventBus?.unSubscribe(changeValuesSubscriber)
        }
    }, [eventBus, id, name, required, rules, value])

    if (hidden) {
        return null;
    }
    return (
        <div
            data-form-item
            data-label-placement={labelPlacement}
            className={cx.call(undefined, rowStyle, className)}
            {...restProps}
        >
            {renderLabelElement()}
            {renderEditorElement()}
            {renderStatusElement()}
            {labelPlacement !== 'control' && isInvalid && <span
                id={messageId}
                data-form-message=""
                className={cx(validationMessageStyle, validateState === ValidateState.ERROR ? errorColorStyle : warningColorStyle)}
                role="alert"
            >
                {validateMessage}
            </span>}
        </div>
    )
}

export type FormItem = FormItemProps;

export default FormItemComponent;
