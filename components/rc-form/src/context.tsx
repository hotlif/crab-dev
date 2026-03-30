import { createContext } from "react";
import EventBus from "./bus.js";
import type { ReactNode } from "react";


export interface FormContextType {
    eventBus?: EventBus
    requiredIndicatorRenderer?: (param: {
        label: ReactNode,
        required: boolean
    }) => ReactNode
}

const FormContext = createContext<FormContextType>({});

export default FormContext;