import { assertContentGeometry } from '../../../test/visual/content-geometry.mjs';
import { expect } from '../../../test/visual/component-fixture.mjs';

export async function assertNumberEditGeometry(input, frame) {
    const field = input.locator('..').locator('..');
    const label = field.locator('[data-field-label-text]');
    const accessibleName = await input.getAttribute('aria-label') || await label.textContent();
    await expect(input).toHaveAccessibleName(accessibleName);
    const labelArea = await input.evaluate(node => {
        const root = node.closest('[data-field-root]'), bounds = node.getBoundingClientRect();
        const labelBounds = root.querySelector(':scope > label').getBoundingClientRect();
        const inside = root.dataset.labeled === 'true' && root.closest('[data-crab-design]')?.getAttribute('data-crab-design') === 'md3'
            && (root.dataset.appearance === 'filled' || (!root.matches(':focus-within') && node.matches(':placeholder-shown') && !node.matches(':autofill')));
        return { inside, start: labelBounds.left - bounds.left, end: bounds.right - labelBounds.right };
    });
    if (labelArea.inside) {
        expect(labelArea.start).toBeGreaterThanOrEqual(-1);
        expect(labelArea.end).toBeGreaterThanOrEqual(-1);
    }
    const buttons = [];
    for (const button of await field.getByRole('button').all()) {
        buttons.push({
            button: await assertContentGeometry(button, field, { checkText: false }),
            icon: await assertContentGeometry(button.locator('svg'), button, { checkText: false }),
        });
    }
    return {
        field: await assertContentGeometry(field, frame, { checkText: false }),
        input: await assertContentGeometry(input, field, { checkText: false }),
        label: await assertContentGeometry(label, frame, { allowEllipsis: true, accessibleName }),
        labelArea,
        supportingText: await assertContentGeometry(field.locator('[data-field-support] > span'), field),
        buttons,
    };
}
