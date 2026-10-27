/** Public design-system identity; color mode, component size and density are independent. */
export const designSystemRegistry = {
    md3: {
        label: 'MD3 Expressive',
        fullName: 'Material Design 3 Expressive',
        source: 'https://m3.material.io/',
    },
    apple: {
        label: 'Apple',
        fullName: 'Apple',
        source: 'https://developer.apple.com/design/human-interface-guidelines/',
    },
    shadcn: {
        label: 'shadcn/ui',
        fullName: 'shadcn/ui',
        source: 'https://ui.shadcn.com/',
        reference: {
            variant: 'new-york-v4',
            revision: '3d98900e9b73c45f035f8109e9d41ba6a51685e7',
            reviewedAt: '2026-10-23',
        },
    },
} as const;

export type DesignSystem = keyof typeof designSystemRegistry;

export const defaultDesignSystem: DesignSystem = 'md3';
