/** Browser-only assertions shared by published-package fixtures. */
export declare function screenshotPixels(base64: string): Promise<ImageData>;
export declare function colorChannels(color: string): number[];
export declare function matchingPixels(image: ImageData, rect: Pick<DOMRectReadOnly, 'x' | 'y' | 'width' | 'height'>, color: string, tolerance?: number, backdrops?: number[][]): {
    matched: number;
    total: number;
    ratio: number;
    expected: number[];
    tolerance: number;
};
