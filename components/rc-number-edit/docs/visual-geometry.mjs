import { assertContentGeometry } from '../../../test/visual/content-geometry.mjs';

export async function assertNumberEditGeometry(input, frame) {
    const field = input.locator('..').locator('..');
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
        label: await assertContentGeometry(field.locator('[data-field-label-text]'), frame),
        supportingText: await assertContentGeometry(field.locator('[data-field-support] > span'), field),
        buttons,
    };
}
