import { createContext } from "react";
import EventBus from "./bus.js";
import type { ReactNode } from "react";
import type { NamePath } from './types.js';


export interface FormContextType {
    eventBus?: EventBus
    getFieldValue?: (name: NamePath) => unknown
    requiredIndicatorRenderer?: (param: {
        label: ReactNode,
        required: boolean
    }) => ReactNode
}

const FormContext = createContext<FormContextType>({});

export default FormContext;
