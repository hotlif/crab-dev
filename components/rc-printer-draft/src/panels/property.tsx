import { css } from "@linaria/core";
import { useEffect, useState, type FC, type HTMLAttributes } from "react";
import RcForm, { Item as RcFormItem, useForm, FormItemEditor, type FormInstance } from "@crab-dev/rc-form"
import RcLineEdit, { LineEditProps } from "@crab-dev/rc-line-edit";
import type { ResourceWidget, Widget } from "../types";


const Editor: FC<FormItemEditor & LineEditProps> = ({
    validateState,
    value,
    onChange
}) => {
    return (
        <RcLineEdit
            style={{ width: '100%' }}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
        />
    )
}

interface PropertyFormProps {
    form: FormInstance<Record<string, any>>,
    property?: ResourceWidget["property"],
    fieldName: 'props' | 'customProps' 
    widget?: Widget,
    onWidgetChange?: (widget: Widget) => void
}

const PropertyForm: FC<PropertyFormProps> = ({
    form,
    fieldName,
    property = [],
    widget,
    onWidgetChange
}) => {
    return (
        <RcForm
            form={form}
            onFieldValueChange={async ({
                name,
                value
            }) => {
                let newValue = value;
                if (widget && widget[fieldName]) {
                    const resourceWidgetProperty = property.find(element => element.name === name);
                    if (resourceWidgetProperty?.type === "number") {
                        newValue = isNaN(Number.parseInt(value as string)) ? 0 : Number.parseInt(value as string);
                    } else if (resourceWidgetProperty?.type === "string") {
                        newValue = value
                    }
                    (widget[fieldName] as any)[name] = newValue;
                    onWidgetChange?.(widget)
                }
            }}
        >
            {property.map(element => {
                return (
                    <RcFormItem
                        name={element.name}
                        key={element.name}
                        label={(
                            <div
                                className={css`
                                    width: 45px;
                                `}
                            >
                                {element.title}
                            </div>
                        )}
                    >
                        <Editor />
                    </RcFormItem>
                )
            })}
        </RcForm>
    )
}

interface PropertyPanelProps extends HTMLAttributes<HTMLDivElement> {
    resourceWidget?: ResourceWidget,
    widget?: Widget,
    onWidgetChange?: (widget: Widget) => void
}

const PropertyPanel: FC<PropertyPanelProps> = ({
    resourceWidget,
    widget,
    onWidgetChange
}) => {
    const [propsForm] = useForm();
    const [customPropsForm] = useForm();
    useEffect(() => {
        propsForm.setFieldsValue({
            ...(widget?.props ?? {}),
        })
        customPropsForm.setFieldsValue({
            ...(widget?.customProps ?? {}),
        })
    }, [widget, propsForm, customPropsForm])

    return (
        <div
            className={css`
                display: flex;
                flex-direction: column;
                overflow: auto;
                height: 100%;
            `}
        >
            <div
                className={css`
                    padding: 8px 12px;
                    border-bottom: 1px solid #d9d9d9;
                `}
            >
                属性设置
            </div>
            <div
                className={css`
                    padding: 8px 12px;
                `}
            >
                <PropertyForm
                    form={propsForm}
                    fieldName="props"
                    property={resourceWidget?.property}
                    widget={widget}
                    onWidgetChange={onWidgetChange}
                />
                <PropertyForm
                    form={customPropsForm}
                    fieldName="customProps"
                    property={resourceWidget?.customProperty}
                    widget={widget}
                    onWidgetChange={onWidgetChange}
                />
            </div>
        </div>
    )
}

export default PropertyPanel;