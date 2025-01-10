
const AlignItemsValue = {
    'start': 'align-items: flex-start;',
    'end': 'align-items: flex-end;',
    'center': 'align-items: center;',
    'baseline': 'align-items: baseline;',
    'tretch': 'align-items: stretch;',
};

export const alignItems = (key: keyof typeof AlignItemsValue) => {
    return AlignItemsValue[key];
}

