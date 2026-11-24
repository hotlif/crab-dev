import { createContext } from 'react';
import type { ButtonGroupProps, ButtonProps } from './types.js';

interface ButtonGroupContextValue {
    size?: ButtonProps['size'];
    appearance?: ButtonProps['appearance'];
    danger?: boolean;
    variant?: ButtonGroupProps['variant'];
}

const ButtonGroupContext = createContext<ButtonGroupContextValue>({});
export default ButtonGroupContext;
