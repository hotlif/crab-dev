type BorderRadiusSizeType = 'none' | 'sm' | 'default' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';

const BorderRadiusSize: Record<BorderRadiusSizeType, string> = {
    none: '0px',
    sm: '0.125rem', // 2px
    default: '0.25rem', // 4px
    md: '0.375rem', // 6px
    lg: '0.5rem', // 8px
    xl: '0.75rem', // 12px
    '2xl': '1rem', // 16px
    '3xl': '1.5rem', // 24px
    full: '9999px',
};

const directions = ['s', 'e', 't', 'r', 'b', 'l', 'ss', 'se', 'ee', 'es', 'tl', 'tr', 'br', 'bl'];

export const borderRadius = (input: `${typeof directions[number]}-${BorderRadiusSizeType}`) => {
        const [direction, value] = input.split('-');
        const borderRadiusValue = BorderRadiusSize[value as BorderRadiusSizeType];
    
        if (!borderRadiusValue || !directions.includes(direction as any)) {
            return '';
        }

        switch (direction) {
            case 's':
                return `border-start-start-radius: ${borderRadiusValue}; border-end-start-radius: ${borderRadiusValue};`;
            case 'e':
                return `border-start-end-radius: ${borderRadiusValue}; border-end-end-radius: ${borderRadiusValue};`;
            case 't':
                return `border-top-left-radius: ${borderRadiusValue}; border-top-right-radius: ${borderRadiusValue};`;
            case 'r':
                return `border-top-right-radius: ${borderRadiusValue}; border-top-right-radius: ${borderRadiusValue};`;
            case 'b':
                return `border-bottom-right-radius: ${borderRadiusValue};border-bottom-left-radius: ${borderRadiusValue};`;
            case 'l':
                return `border-top-left-radius: ${borderRadiusValue};border-bottom-left-radius: ${borderRadiusValue};`;
            case 'ss':
                return `border-start-start-radius: ${borderRadiusValue};`;
            case 'se':
                return `border-start-end-radius: ${borderRadiusValue};`;
            case 'ee':
                return `border-end-end-radius: ${borderRadiusValue};`;
            case 'es':
                return `border-end-start-radius: ${borderRadiusValue};`;
            case 'tl':
                return `border-top-left-radius: ${borderRadiusValue};`;
            case 'tr':
                return `border-top-right-radius: ${borderRadiusValue};`;
            case 'br':
                return `border-bottom-right-radius: ${borderRadiusValue};`;
            case 'bl':
                return `border-bottom-left-radius: ${borderRadiusValue};`;
            default:
                return '';
        }
}
