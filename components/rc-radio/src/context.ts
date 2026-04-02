import { createContext, useContext } from 'react';
import type { RadioGroupContextValue } from './types.js';

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export const useRadioGroup = () => useContext(RadioGroupContext);
