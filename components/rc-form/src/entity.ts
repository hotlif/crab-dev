export enum FieldType {
    Object = "Object",
    Array = "Array",
    Decimal = "Decimal",
    BigInt = "BigInt",
    String = "String",
    Boolean = "Boolean",
    Date = "Date",
    Time = "Time",
    DateTime = "DateTime"
}

export interface Field {
    // 字段名称
    name: string
    // 字段描述
    label: string
    // 字段类型
    type: FieldType | string
}

export interface Entity {
    fields: Field[]
}