import { assertContentGeometry } from '../../../test/visual/content-geometry.mjs';

export async function assertCheckboxGeometry(frame) {
    const input = frame.getByRole('checkbox', { name: 'Primary option', exact: true });
    const label = input.locator('..');
    return {
        label: await assertContentGeometry(label, frame, { checkText: false }),
        control: await assertContentGeometry(label.locator('[data-checkbox-part="control"]'), label, { checkText: false }),
        text: await assertContentGeometry(label.locator(':scope > span').last(), label),
    };
}
