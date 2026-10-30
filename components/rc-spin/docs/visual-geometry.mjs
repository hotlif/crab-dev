import { assertContentGeometry } from '../../../test/visual/content-geometry.mjs';

export async function assertSpinGeometry(frame) {
    const status = frame.getByRole('status');
    return {
        status: await assertContentGeometry(status, frame, { checkText: false }),
        tip: await assertContentGeometry(status.locator(':scope > span').last(), status),
    };
}
