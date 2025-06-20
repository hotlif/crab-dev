import {
    flex,
    flexDirection,
    flexWrap,
    flexJustifyContent,
    flexAlignItems,
    flexAlignContent,
    flexItemOrder,
    flexItemGrow,
    flexItemShrink,
    flexItemBasis,
    flexItemAlignSelf,
    grid,
    gridTemplateColumns,
    gridTemplateRows,
    gridTemplateAreas,
    gridAlignTtems,
    gridJustifyItems,
    gridJustifyContent,
    gridAlignContent,
    gridItemRowSpan,
    gridItemColumnSpan,
    gap,
    row,
    column
} from "../layout";


describe('layout utilities', () => {
    test('flex returns correct css', () => {
        expect(flex()).toContain('display: flex;');
        expect(flex()).toContain('> * {');
        expect(flex()).toContain('flex-grow: 0;');
    });

    test('flexDirection returns correct css', () => {
        expect(flexDirection('row')).toBe('flex-direction: row;');
        expect(flexDirection('column-reverse')).toBe('flex-direction: column-reverse;');
    });

    test('flexWrap returns correct css', () => {
        expect(flexWrap('nowrap')).toBe('flex-wrap: nowrap;');
        expect(flexWrap('wrap-reverse')).toBe('flex-wrap: wrap-reverse;');
    });

    test('flexJustifyContent returns correct css', () => {
        expect(flexJustifyContent('center')).toBe('justify-content: center;');
        expect(flexJustifyContent('space-between')).toBe('justify-content: space-between;');
    });

    test('flexAlignItems returns correct css', () => {
        expect(flexAlignItems('stretch')).toBe('align-items: stretch;');
        expect(flexAlignItems('baseline')).toBe('align-items: baseline;');
    });

    test('flexAlignContent returns correct css', () => {
        expect(flexAlignContent('space-around')).toBe('align-content: space-around;');
        expect(flexAlignContent('center')).toBe('align-content: center;');
    });

    test('flexItemOrder returns correct css', () => {
        expect(flexItemOrder(2)).toBe('order: 2;');
        expect(flexItemOrder(-1)).toBe('order: -1;');
    });

    test('flexItemGrow returns correct css', () => {
        expect(flexItemGrow(1)).toBe('flex-grow: 1;');
        expect(flexItemGrow(0)).toBe('flex-grow: 0;');
    });

    test('flexItemShrink returns correct css', () => {
        expect(flexItemShrink(1)).toBe('flex-shrink: 1;');
        expect(flexItemShrink(0)).toBe('flex-shrink: 0;');
    });

    test('flexItemBasis returns correct css', () => {
        expect(flexItemBasis('auto')).toBe('flex-basis: auto;');
        expect(flexItemBasis('100px')).toBe('flex-basis: 100px;');
    });

    test('flexItemAlignSelf returns correct css', () => {
        expect(flexItemAlignSelf('auto')).toBe('align-self: auto');
        expect(flexItemAlignSelf('center')).toBe('align-self: center');
    });

    test('grid returns correct css', () => {
        expect(grid()).toContain('display: grid;');
    });

    test('gridTemplateColumns returns correct css', () => {
        expect(gridTemplateColumns('1fr 2fr')).toBe('grid-template-columns: 1fr 2fr;');
    });

    test('gridTemplateRows returns correct css', () => {
        expect(gridTemplateRows('100px auto')).toBe('grid-template-rows: 100px auto;');
    });

    test('gridTemplateAreas returns correct css', () => {
        expect(gridTemplateAreas('"header header" "main sidebar"')).toBe('grid-template-areas: "header header" "main sidebar";');
    });

    test('gridAlignTtems returns correct css', () => {
        expect(gridAlignTtems('center')).toBe('align-items: center;');
        expect(gridAlignTtems('stretch')).toBe('align-items: stretch;');
    });

    test('gridJustifyItems returns correct css', () => {
        expect(gridJustifyItems('end')).toBe('justify-items: end;');
        expect(gridJustifyItems('stretch')).toBe('justify-items: stretch;');
    });

    test('gridJustifyContent returns correct css', () => {
        expect(gridJustifyContent('space-between')).toBe('justify-content: space-between;');
        expect(gridJustifyContent('center')).toBe('justify-content: center;');
    });

    test('gridAlignContent returns correct css', () => {
        expect(gridAlignContent('space-evenly')).toBe('align-content: space-evenly;');
        expect(gridAlignContent('start')).toBe('align-content: start;');
    });

    test('gridItemRowSpan returns correct css', () => {
        expect(gridItemRowSpan(2)).toBe('grid-row: span 2;');
    });

    test('gridItemColumnSpan returns correct css', () => {
        expect(gridItemColumnSpan(3)).toBe('grid-column: span 3;');
    });

    test('gap returns correct css', () => {
        expect(gap('10px', '20px')).toBe('gap: 10px 20px;');
    });

    test('row returns correct css', () => {
        const css = row();
        expect(css).toContain('display: flex;');
        expect(css).toContain('flex-direction: column;');
        expect(css).toContain('flex-wrap: nowrap;');
    });

    test('column returns correct css', () => {
        const css = column();
        expect(css).toContain('display: flex;');
        expect(css).toContain('flex-direction: row;');
        expect(css).toContain('flex-wrap: nowrap;');
    });
});
