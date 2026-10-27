interface PixelImage {
    width: number;
    height: number;
    data: Uint8ClampedArray;
}
interface Edge {
    side: string;
    x: number;
    y: number;
    width: number;
    height: number;
    dx: number;
    dy: number;
}
export function inspectFocusBand(image: PixelImage, edge: Edge, expected: readonly number[], surface: readonly number[] | null, subject: string): {
    actualContrast: { measured: number; readable: number; minimum: number; backgrounds: Record<string, number>; scope: string };
    distantSceneDiagnostic: { offset: number; minimumContrast: number; scope: string };
};
