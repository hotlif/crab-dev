import { css, cx } from "@linaria/core";
import {
    type FC,
    type Ref,
    useRef,
    useEffect,
    useCallback,
    createContext,
    RefObject,
    HTMLAttributes,
    ReactElement
} from "react";
import { Editor, type ItemInstance } from "./item";
import { Entity } from "./entity";
import useEntityCreateItems from "./hooks/useEntityCreateItems";


interface FormContextValue {
    items: RefObject<Set<ItemInstance<any>>>
    entity: Entity
    labelClassName?: string
    editorClassName?: string
    itemClassName?: string
}

export const FormContext = createContext<FormContextValue | undefined>(undefined);

export interface FormInstance {
    setFieldValue: (fieldName: string, value: unknown) => void
    setFieldsValue: (data: any) => void
}

interface FormProps extends Omit<HTMLAttributes<HTMLDivElement>, ""> {

    /**
     * 表单信息
     */
    form?: Ref<FormInstance>,

    /**
     * 生成的实体信息
     */
    entity: Entity,

    /**
     * 所有的编辑器, 都可以在此地方进行加载， 用于快速初始化实体信息
     */
    editors: Record<string, ReactElement<Editor<any>>>

    /**
     * 标签页的样式
     */
    labelClassName?: string

    /**
     * 编辑器的样式
     */
    editorClassName?: string

    /**
     * 表单元素容器的样式
     */
    itemClassName?: string
}


const findItemByName = (data: Set<ItemInstance<any>>, name: string) => {
    const entries = data.values();
    while (true) {
        const result = entries.next();
        if (result.done) break;
        if (result.value.getName() === name) {
            return result.value;
        }
    }
    return null;
}

const Form: FC<FormProps> = ({
    className,
    form,
    entity,
    editors,
    children,
    labelClassName,
    editorClassName,
    itemClassName,
    ...restProps
}) => {
    const formRef = useRef<HTMLDivElement>(null);
    const itemsRef = useRef<Set<ItemInstance<any>>>(new Set<ItemInstance<any>>());

    const getFormInstance = useCallback<() => FormInstance>(() => ({
        setFieldValue: (fieldName, value) => {
            const item = findItemByName(itemsRef.current, fieldName);
            item?.setValue(value);
        },
        setFieldsValue: (data) => {
            const keys = Object.keys(data);
            keys.forEach(element => {
                const item = findItemByName(itemsRef.current, element);
                item?.setValue(data?.[element])
            })
        }
    }), [
        formRef.current
    ]);

    useEffect(() => {
        if (!form) return;
        const instance = getFormInstance();
        if (typeof form === "function" ) {
            form(instance);
            return () => { form(null) };
        }
        form.current = instance;
        return () => { form.current = null };
    }, [form, getFormInstance]);


    const [itemsElement] = useEntityCreateItems(entity, editors);

    return (
        <FormContext.Provider
            value={{
                items: itemsRef,
                entity,
                labelClassName,
                editorClassName,
                itemClassName
            }}
        >
            <div
                className={cx(css`
                    display: grid;
                    grid-template-columns: 1fr;
                `, className)}
                ref={formRef}
                {...restProps}
            >
                {itemsElement}
                {children}
            </div>
        </FormContext.Provider>
    )
}

export default Form;