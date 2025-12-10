export interface ValidationResult {
    result: boolean
    description?: string
}

export type Validation =  {
    warning: (data: Record<string, any>, fieldName: string) => Promise<ValidationResult>,
    failure: (data: Record<string, any>, fieldName: string) => Promise<ValidationResult>,
}


const Validations: Record<string, Validation> = {
    'required': {
        warning: async (data, fieldName) => {
            const value = data?.[fieldName];
            if (typeof value === "number" && value === 0) {
                return {
                    result: true,
                    description: "当前值为 [0], 请检查数据是否正确。"
                }
            }
            return {
                result: false,
            }
        },
        failure: async (data, fieldName) => {
            const value = data?.[fieldName];
            if (value === "" || value == null) {
                return {
                    result: true,
                    description: "此项不能为空"
                };
            }
            return {
                result: false
            };
        },
    }
}


export default Validations;