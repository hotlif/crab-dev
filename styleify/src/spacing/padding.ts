import { SizeValue , type SizeValueType } from "./_size";

const directions = ['p', 'px', 'py', 'ps', 'pe', 'pt', 'pr', 'pb', 'pl'] as const;

export const padding = (input: `${typeof directions[number]}-${SizeValueType}`): string => {
    const [direction, value] = input.split('-');
    const paddingValue = SizeValue[value as SizeValueType];

    if (!paddingValue || !directions.includes(direction as any)) {
        return '';
    }

    switch (direction) {
        case 'p':
            return `padding: ${paddingValue};`;
        case 'px':
            return `padding-left: ${paddingValue}; padding-right: ${paddingValue};`;
        case 'py':
            return `padding-top: ${paddingValue}; padding-bottom: ${paddingValue};`;
        case 'ps':
            return `padding-inline-start: ${paddingValue};`;
        case 'pe':
            return `padding-inline-end: ${paddingValue};`;
        case 'pt':
            return `padding-top: ${paddingValue};`;
        case 'pr':
            return `padding-right: ${paddingValue};`;
        case 'pb':
            return `padding-bottom: ${paddingValue};`;
        case 'pl':
            return `padding-left: ${paddingValue};`;
        default:
            return '';
    }
};
