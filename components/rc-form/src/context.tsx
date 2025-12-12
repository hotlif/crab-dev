import { createContext } from "react";
import EventBus from "./bus";


export interface FormContextType {
    eventBus?: EventBus
}

const FormContext = createContext<FormContextType>({});

export default FormContext;