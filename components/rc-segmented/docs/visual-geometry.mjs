import { assertContentGeometry } from '../../../test/visual/content-geometry.mjs';

export async function assertSegmentedGeometry(frame) {
    const group = frame.getByRole('radiogroup', { name: 'Time range' });
    const options = [];
    for (const input of await group.getByRole('radio').all()) {
        const option = input.locator('..');
        options.push({
            option: await assertContentGeometry(option, group, { checkText: false }),
            text: await assertContentGeometry(option.locator(':scope > span:not([aria-hidden])'), option, {
                // Segmented deliberately ellipsizes its bounded text slot.
                // Record the actual truncation and keep an accessible identity.
                allowEllipsis: true,
                accessibleName: await input.getAttribute('aria-label'),
            }),
        });
    }
    return { group: await assertContentGeometry(group, frame, { checkText: false }), options };
}
