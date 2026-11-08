import { assertContentGeometry } from '../../../test/visual/content-geometry.mjs';
import { expect } from '../../../test/visual/component-fixture.mjs';

export async function assertNumberEditGeometry(input, frame) {
    const field = input.locator('..').locator('..');
    const label = field.locator('[data-field-label-text]');
    const accessibleName = await input.getAttribute('aria-label') || await label.textContent();
    await expect(input).toHaveAccessibleName(accessibleName);
    const labelArea = await input.evaluate(node => {
        const root = node.closest('[data-field-root]');
        const labelBounds = root.querySelector(':scope > label').getBoundingClientRect();
        const control = node.closest('[data-field-control]').getBoundingClientRect();
        return { gap: control.top - labelBounds.bottom, start: labelBounds.left - control.left, end: control.right - labelBounds.right };
    });
    expect(labelArea.gap).toBeGreaterThanOrEqual(3);
    expect(labelArea.start).toBeGreaterThanOrEqual(-1);
    expect(labelArea.end).toBeGreaterThanOrEqual(-1);
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
