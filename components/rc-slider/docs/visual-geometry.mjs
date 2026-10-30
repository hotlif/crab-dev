import { assertContentGeometry } from '../../../test/visual/content-geometry.mjs';

export async function assertSliderGeometry(frame) {
    const control = frame.getByRole('slider');
    const text = [];
    for (const label of await frame.locator(':scope > span, :scope > div:not([role]) > span, output').all()) {
        text.push(await assertContentGeometry(label, frame));
    }
    return {
        control: await assertContentGeometry(control, frame, { checkText: false }),
        handle: await assertContentGeometry(control.locator('[data-slot="slider-handle"]'), frame, { checkText: false }),
        text,
    };
}
