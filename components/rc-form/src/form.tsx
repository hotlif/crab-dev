import { css, cx } from "@crab-dev/css";
import { useEffect, useId, useRef, useState, useTransition } from "react";
import type { FormHTMLAttributes, ReactNode } from "react";
import token from "./token.js";
import { FormValidationError } from "./types.js";
import type { NamePath, FormInstance, WrapperInstance, FieldChange, FieldValidationResult, FieldPath, FieldValue, FormSubmitResult } from "./types.js";
import FormContext from "./context.js";
import EventBus, { MessageEnum } from "./bus.js";
import { setRecordValue, getRecordValue } from "./util.js";

export interface FormProps<T extends object> extends Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit" | "onSubmitCapture" | "defaultValue"> {
    form?: FormInstance<T>;
    /** 仅在挂载时读取；后续更新使用 form.reinitialize。 */
    defaultValue?: T;
    requiredIndicatorRenderer?: (param: { label: ReactNode; required: boolean }) => ReactNode;
    onSubmitSuccess?: (record: T) => void | Promise<void>;
    /** 第一参数保留原数据协议，第二参数提供结构化错误。 */
    onSubmitFailed?: (record: T, error: FormValidationError<T>) => void | Promise<void>;
    onFieldValueChange?: (changed: FieldChange<T>, allValues: T) => void | Promise<void>;
}

function cloneRecord<T extends object>(value: T): T {
    const seen = new WeakMap<object, unknown>();
    const clone = (entry: unknown): unknown => {
        if (entry == null || typeof entry !== 'object') return entry;
        if (seen.has(entry)) return seen.get(entry);
        if (entry instanceof Date) return new Date(entry.getTime());
        if (Array.isArray(entry)) {
            const result: unknown[] = [];
            seen.set(entry, result);
            entry.forEach(item => result.push(clone(item)));
            return result;
        }
        const prototype: unknown = Object.getPrototypeOf(entry);
        // Temporal 等不可变业务值保留原型和身份，不被 structuredClone/JSON 转成空对象。
        if (prototype !== Object.prototype && prototype !== null) return entry;
        const result: Record<string, unknown> = {};
        seen.set(entry, result);
        for (const [key, item] of Object.entries(entry)) {
            Object.defineProperty(result, key, { value: clone(item), enumerable: true, writable: true, configurable: true });
        }
        return result;
    };
    return clone(value) as T;
}

function Form<T extends object>({
    className, form, defaultValue = {} as T, requiredIndicatorRenderer,
    onSubmitSuccess, onSubmitFailed, onFieldValueChange, children, ...restProps
}: FormProps<T>) {
    const id = useId();
    const [eventBus] = useState(() => new EventBus());
    const [initialValues] = useState(() => cloneRecord(defaultValue));
    // 可变实例状态：字段存储、显式初始化基准和正在执行的提交。
    const defaultsRef = useRef(initialValues);
    const [initialRecord] = useState(() => cloneRecord(initialValues));
    const formRecordRef = useRef(initialRecord);
    const [readField] = useState(() => (name: NamePath) => getRecordValue(formRecordRef.current, name));
    const submitRef = useRef<Promise<FormSubmitResult<T>> | null>(null);
    const [, startTransition] = useTransition();

    const validateFields = async (fields?: readonly FieldPath<T>[]) => {
        const results: FieldValidationResult[] = [];
        const values = cloneRecord(formRecordRef.current);
        for (const subscriber of [...eventBus.getSubscribers()]) {
            if (subscriber.type === MessageEnum.TRIGGER_ITEM_VERIFICATION) {
                const result: FieldValidationResult | undefined = await subscriber.ring(fields, values);
                if (result) results.push(result);
            }
        }
        if (results.some(result => result.errors.length > 0)) {
            throw new FormValidationError(values, results);
        }
        return values;
    };

    const submit = (): Promise<FormSubmitResult<T>> => {
        if (submitRef.current) return submitRef.current;
        const run = async (): Promise<FormSubmitResult<T>> => {
            let values: T;
            try {
                values = await validateFields();
            } catch (error) {
                if (!(error instanceof FormValidationError)) throw error;
                const validation = error as FormValidationError<T>;
                await onSubmitFailed?.(validation.values, validation);
                return { status: 'invalid', values: validation.values, error: validation };
            }
            await onSubmitSuccess?.(values);
            return { status: 'success', values };
        };
        const pending = run().finally(() => { submitRef.current = null; });
        submitRef.current = pending;
        return pending;
    };

    useEffect(() => {
        const subscriber = {
            id,
            type: MessageEnum.ON_ITEM_VALUE_CHANGE,
            ring: (changed: { name: NamePath; value: unknown }) => {
                setRecordValue(formRecordRef.current, changed.name, changed.value);
                const values = cloneRecord(formRecordRef.current);
                startTransition(async () => { await onFieldValueChange?.(changed as FieldChange<T>, values); });
            },
        };
        eventBus.subscribe(subscriber);
        return () => { eventBus.unSubscribe(subscriber); };
    }, [eventBus, id, onFieldValueChange]);

    useEffect(() => {
        const wrapper = form as WrapperInstance<T> | undefined;
        const setFieldValue = (name: NamePath, value: unknown) => {
            const next = value != null && typeof value === 'object' ? cloneRecord(value) : value;
            setRecordValue(formRecordRef.current, name, next);
            eventBus.dispatch({ type: MessageEnum.SEND_TO_CHAGE_ITEM_VALUE, payload: [{ name, value: next }] });
        };
        const setFieldsValue = (values: T) => {
            formRecordRef.current = cloneRecord(values);
            eventBus.dispatch({ type: MessageEnum.SEND_TO_CHAGE_VALUES, payload: [formRecordRef.current] });
        };
        const resetFields = async (names?: readonly FieldPath<T>[]) => {
            if (names == null) setFieldsValue(defaultsRef.current);
            else names.forEach(name => setFieldValue(name, getRecordValue(defaultsRef.current, name)));
            eventBus.dispatch({ type: MessageEnum.RESET_VALIDATION, payload: [names] });
        };
        wrapper?.__INTERNAL__.setInstance({
            submit,
            getFieldValue: <const P extends FieldPath<T>>(name: P) => getRecordValue(formRecordRef.current, name) as FieldValue<T, P> | undefined,
            getFieldsValue: () => cloneRecord(formRecordRef.current),
            setFieldValue,
            setFieldsValue,
            reinitialize: (values) => {
                defaultsRef.current = cloneRecord(values);
                setFieldsValue(values);
                eventBus.dispatch({ type: MessageEnum.RESET_VALIDATION });
            },
            validateFields,
            resetFields,
        });
        return () => wrapper?.__INTERNAL__.setInstance(null);
    });

    return (
        <FormContext
            value={{
                eventBus: eventBus,
                getFieldValue: readField,
                requiredIndicatorRenderer
            }}
        >
            <form

                {...restProps}
                className={cx(
                    css`
                        display: grid;
                        /* 标签列 auto（自动撑到最长标签）/ 编辑器列 1fr / 状态图标列 auto */
                        grid-template-columns: auto minmax(0, 1fr) auto;
                        align-items: center;
                        /* 行轨道恒为内容高度：align-content 默认 normal 在 grid 中等同 stretch，
                           当表单被放入更高的容器（如全屏 flex 布局）时会把富余高度摊到各行、
                           撑大行距，故显式 start 锁定，行距只由 row-gap 决定。 */
                        align-content: start;
                        column-gap: ${token.item.gap};
                        row-gap: ${token.row.gap};
                        margin-block-end: unset;

                        /* 非字段子节点（按钮组等）跨整行，不参与标签列对齐 */
                        & > :not([data-form-item]) {
                            grid-column: 1 / -1;
                        }
                    `,
                    className
                )}
                onSubmit={(e) => {
                    e.preventDefault();
                    startTransition(async () => { await submit(); });
                }}
            >
                {children}
            </form>
        </FormContext>
    )
}

export default Form;
