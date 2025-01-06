import { SizeValue , type SizeValueType } from "./_size";

const directions = ['m', 'mx', 'my', 'ms', 'me', 'mt', 'mr', 'mb', 'ml'] as const;

export const margin = (input: `${typeof directions[number]}-${SizeValueType}`): string => {
    const [direction, value] = input.split('-');
    const marginValue = SizeValue[value as SizeValueType];

    if (!marginValue || !directions.includes(direction as any)) {
        return '';
    }
    switch (direction) {
        case 'm':
            return `margin: ${marginValue};`;
        case 'mx':
            return `margin-left: ${marginValue}; margin-right: ${marginValue};`;
        case 'my':
            return `margin-top: ${marginValue}; margin-bottom: ${marginValue};`;
        case 'ms':
            return `margin-inline-start: ${marginValue};`;
        case 'me':
            return `margin-inline-end: ${marginValue};`;
        case 'mt':
            return `margin-top: ${marginValue};`;
        case 'mr':
            return `margin-right: ${marginValue};`;
        case 'mb':
            return `margin-bottom: ${marginValue};`;
        case 'ml':
            return `margin-left: ${marginValue};`;
        default:
            return '';
    }
};
