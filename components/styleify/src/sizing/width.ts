const WidthValue = {
    '0': 'width: 0px;',
    'px': 'width: 1px;',
    '0.5': 'width: 0.125rem;', // 2px
    '1': 'width: 0.25rem;', // 4px
    '1.5': 'width: 0.375rem;', // 6px
    '2': 'width: 0.5rem;', // 8px
    '2.5': 'width: 0.625rem;', // 10px
    '3': 'width: 0.75rem;', // 12px
    '3.5': 'width: 0.875rem;', // 14px
    '4': 'width: 1rem;', // 16px
    '5': 'width: 1.25rem;', // 20px
    '6': 'width: 1.5rem;', // 24px
    '7': 'width: 1.75rem;', // 28px
    '8': 'width: 2rem;', // 32px
    '9': 'width: 2.25rem;', // 36px
    '10': 'width: 2.5rem;', // 40px
    '11': 'width: 2.75rem;', // 44px
    '12': 'width: 3rem;', // 48px
    '14': 'width: 3.5rem;', // 56px
    '16': 'width: 4rem;', // 64px
    '20': 'width: 5rem;', // 80px
    '24': 'width: 6rem;', // 96px
    '28': 'width: 7rem;', // 112px
    '32': 'width: 8rem;', // 128px
    '36': 'width: 9rem;', // 144px
    '40': 'width: 10rem;', // 160px
    '44': 'width: 11rem;', // 176px
    '48': 'width: 12rem;', // 192px
    '52': 'width: 13rem;', // 208px
    '56': 'width: 14rem;', // 224px
    '60': 'width: 15rem;', // 240px
    '64': 'width: 16rem;', // 256px
    '72': 'width: 18rem;', // 288px
    '80': 'width: 20rem;', // 320px
    '96': 'width: 24rem;', // 384px
    'auto': 'width: auto;',
    '1/2': 'width: 50%;',
    '1/3': 'width: 33.333333%;',
    '2/3': 'width: 66.666667%;',
    '1/4': 'width: 25%;',
    '2/4': 'width: 50%;',
    '3/4': 'width: 75%;',
    '1/5': 'width: 20%;',
    '2/5': 'width: 40%;',
    '3/5': 'width: 60%;',
    '4/5': 'width: 80%;',
    '1/6': 'width: 16.666667%;',
    '2/6': 'width: 33.333333%;',
    '3/6': 'width: 50%;',
    '4/6': 'width: 66.666667%;',
    '5/6': 'width: 83.333333%;',
    '1/12': 'width: 8.333333%;',
    '2/12': 'width: 16.666667%;',
    '3/12': 'width: 25%;',
    '4/12': 'width: 33.333333%;',
    '5/12': 'width: 41.666667%;',
    '6/12': 'width: 50%;',
    '7/12': 'width: 58.333333%;',
    '8/12': 'width: 66.666667%;',
    '9/12': 'width: 75%;',
    '10/12': 'width: 83.333333%;',
    '11/12': 'width: 91.666667%;',
    'full': 'width: 100%;',
    'screen': 'width: 100vw;',
    'svw': 'width: 100svw;',
    'lvw': 'width: 100lvw;',
    'dvw': 'width: 100dvw;',
    'min': 'width: min-content;',
    'max': 'width: max-content;',
    'fit': 'width: fit-content;',
};

export const width = (key: keyof typeof WidthValue) => {
    return WidthValue[key];
}
