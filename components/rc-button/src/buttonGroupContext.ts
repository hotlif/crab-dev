import { createContext } from 'react';
import type { ButtonProps } from './types.js';

interface ButtonGroupContextValue {
    size?: ButtonProps['size'];
    appearance?: ButtonProps['appearance'];
}

const ButtonGroupContext = createContext<ButtonGroupContextValue>({});
export default ButtonGroupContext;
