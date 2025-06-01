import { describe, it, expect } from "@jest/globals";
import useVirtualItemRange from "../../hooks/useVirtualItemRange";

describe('useVirtualItemRange', () => {
    it('should return correct range for simple grid and no scroll', () => {
        const params = {
            viewportHeight: 100,
            viewportWidth: 100,
            currentScrollPositionTop: 0,
            currentScrollPositionLeft: 0,
            gridTemplateColumns: [50, 50, 50],
            gridTemplateRows: [50, 50, 50],
        };
        const { rowRange, columnRange } = useVirtualItemRange(params);
        expect(rowRange).toEqual([0, 1]);
        expect(columnRange).toEqual([0, 1]);
    });

    it('should return correct range when scrolled to middle cell', () => {
        const params = {
            viewportHeight: 50,
            viewportWidth: 50,
            currentScrollPositionTop: 50,
            currentScrollPositionLeft: 50,
            gridTemplateColumns: [50, 50, 50],
            gridTemplateRows: [50, 50, 50],
        };
        const { rowRange, columnRange } = useVirtualItemRange(params);
        expect(rowRange[0]).toBeGreaterThanOrEqual(1);
        expect(columnRange[0]).toBeGreaterThanOrEqual(1);
    });

    it('should handle uneven grid sizes', () => {
        const params = {
            viewportHeight: 120,
            viewportWidth: 80,
            currentScrollPositionTop: 30,
            currentScrollPositionLeft: 20,
            gridTemplateColumns: [20, 30, 40, 50],
            gridTemplateRows: [60, 30, 50, 40],
        };
        const { rowRange, columnRange } = useVirtualItemRange(params);
        expect(rowRange[0]).toBeGreaterThanOrEqual(0);
        expect(rowRange[1]).toBeLessThanOrEqual(3);
        expect(columnRange[0]).toBeGreaterThanOrEqual(0);
        expect(columnRange[1]).toBeLessThanOrEqual(3);
    });

    it('should handle scroll beyond grid', () => {
        const params = {
            viewportHeight: 100,
            viewportWidth: 100,
            currentScrollPositionTop: 200,
            currentScrollPositionLeft: 200,
            gridTemplateColumns: [50, 50, 50],
            gridTemplateRows: [50, 50, 50],
        };
        const { rowRange, columnRange } = useVirtualItemRange(params);
        expect(rowRange[0]).toBeLessThanOrEqual(2);
        expect(columnRange[0]).toBeLessThanOrEqual(2);
    });

    it('should handle single row and column', () => {
        const params = {
            viewportHeight: 100,
            viewportWidth: 100,
            currentScrollPositionTop: 0,
            currentScrollPositionLeft: 0,
            gridTemplateColumns: [100],
            gridTemplateRows: [100],
        };
        const { rowRange, columnRange } = useVirtualItemRange(params);
        expect(rowRange).toEqual([0, 0]);
        expect(columnRange).toEqual([0, 0]);
    });

    it('should handle empty grid', () => {
        const params = {
            viewportHeight: 100,
            viewportWidth: 100,
            currentScrollPositionTop: 0,
            currentScrollPositionLeft: 0,
            gridTemplateColumns: [],
            gridTemplateRows: [],
        };
        const { rowRange, columnRange } = useVirtualItemRange(params);
        expect(rowRange).toEqual([0, 0]);
        expect(columnRange).toEqual([0, 0]);
    });
});
