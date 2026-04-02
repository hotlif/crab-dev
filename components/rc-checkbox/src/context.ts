import { createContext, useContext } from 'react';
import type { CheckboxGroupContextValue } from './types.js';

export const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);

export const useCheckboxGroup = () => useContext(CheckboxGroupContext);
