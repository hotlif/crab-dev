import { test, expect, configurations, openDemo, readVisualSpec, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';

const spec = await readVisualSpec(import.meta.url);

async function geometry(action) {
    const box = await action.boundingBox();
    const style = await action.evaluate((node) => {
        const computed = globalThis.getComputedStyle(node);
        return {
            radii: [
                computed.borderTopLeftRadius,
                computed.borderTopRightRadius,
                computed.borderBottomRightRadius,
                computed.borderBottomLeftRadius,
            ],
            paint: {
                borderWidths: [computed.borderTopWidth, computed.borderRightWidth, computed.borderBottomWidth, computed.borderLeftWidth],
                borderStyles: [computed.borderTopStyle, computed.borderRightStyle, computed.borderBottomStyle, computed.borderLeftStyle],
                borderColors: [computed.borderTopColor, computed.borderRightColor, computed.borderBottomColor, computed.borderLeftColor],
                background: computed.backgroundColor,
            },
        };
    });
    expect(box.width).toBeGreaterThan(0);
    expect(box.height).toBeGreaterThan(0);
    return { ...box, ...style };
}

async function normalAndPressed(page, action) {
    await action.scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    await settleFiniteAnimations(page);
    const normal = await geometry(action);
    await action.hover();
    await page.mouse.down();
    let pressed;
    try {
        expect(await action.evaluate((node) => node.matches(':active'))).toBe(true);
        await settleFiniteAnimations(page);
        pressed = await geometry(action);
        sameBounds(pressed, normal);
    } finally {
        await page.mouse.up();
        // Native clicks retain the documented minimum feedback after release.
        await expect.poll(() => action.getAttribute('data-press-feedback')).toBeNull();
        await settleFiniteAnimations(page);
    }
    return { normal, pressed };
}

function sameBounds(actual, expected) {
    for (const key of ['x', 'y', 'width', 'height']) expect(actual[key]).toBeCloseTo(expected[key], 1);
}

async function configureOwner(page, root, args) {
    // The existing direct workbench protocol configures actual component Props.
    // It does not inject styles or bypass the component's public state protocol.
    await page.evaluate((args) => globalThis.postMessage({ type: 'wake:args', args }, globalThis.location.origin), args);
    const action = root.getByRole('button', { name: args.children, exact: true });
    await expect(action).toBeVisible();
    if (args.toggle) await expect(action).toHaveAttribute('aria-pressed', String(args.isSelected));
    return normalAndPressed(page, action);
}

function sameShape(owner, published) {
    expect(owner.radii).toEqual(published.radii);
    expect(owner.height).toBeCloseTo(published.height, 1);
}

for (const config of configurations)
    test(
        `owner/public Button shape parity ${config.designSystem} ${config.colorMode}`,
        {
            tag: ['@rc-button', '@boundary', '@chromium-only'],
            annotation: {
                type: 'contract',
                description: JSON.stringify({
                    id: 'owner-public-shape-parity',
                    ...config,
                    size: 's',
                    shapes: ['default', 'square', 'round', 'circle'],
                    states: ['default', 'selected', 'pressed', 'selected-pressed'],
                }),
            },
        },
        async ({ page, previewOrigin }, info) => {
            const owner = {};
            const basic = await openDemo(page, previewOrigin, 'rc-button', 'basic.demo.tsx', config);
            for (const shape of ['default', 'square', 'round']) {
                owner[shape] = {};
                for (const selected of [false, true]) {
                    owner[shape][selected ? 'selected' : 'default'] = await configureOwner(page, basic, {
                        children: `Owner ${shape} ${selected ? 'selected' : 'default'}`,
                        appearance: 'primary',
                        size: 's',
                        toggle: selected,
                        isSelected: selected,
                        ...(shape === 'default' ? {} : { shape }),
                    });
                }
            }
            const ownerOutlined = {};
            for (const selected of [false, true]) {
                ownerOutlined[selected ? 'selected' : 'default'] = await configureOwner(page, basic, {
                    children: `Owner outlined ${selected ? 'selected' : 'default'}`,
                    appearance: 'outlined',
                    size: 's',
                    toggle: selected,
                    isSelected: selected,
                });
            }

            const publicRoot = await openDemo(page, previewOrigin, 'rc-button', spec.demo, config);
            const state = publicRoot.getByLabel('验收状态', { exact: true });
            await publicRoot.getByLabel('验收尺寸', { exact: true }).selectOption('s');
            const published = {};
            const publishedOutlined = {};
            for (const selected of [false, true]) {
                await state.selectOption(selected ? 'selected' : 'default');
                const action = publicRoot.locator('[data-visual-scene] button[data-appearance="primary"]');
                if (selected) await expect(action).toHaveAttribute('aria-pressed', 'true');
                published[selected ? 'selected' : 'default'] = await normalAndPressed(page, action);
                for (const phase of ['normal', 'pressed'])
                    sameShape(owner.default[selected ? 'selected' : 'default'][phase], published[selected ? 'selected' : 'default'][phase]);
                const outlined = publicRoot.locator('[data-visual-scene] button[data-appearance="outlined"]');
                if (selected) await expect(outlined).toHaveAttribute('aria-pressed', 'true');
                const key = selected ? 'selected' : 'default';
                publishedOutlined[key] = await normalAndPressed(page, outlined);
                for (const phase of ['normal', 'pressed']) {
                    sameShape(ownerOutlined[key][phase], publishedOutlined[key][phase]);
                    expect(ownerOutlined[key][phase].paint).toEqual(publishedOutlined[key][phase].paint);
                    for (const width of ownerOutlined[key][phase].paint.borderWidths) expect(Number.parseFloat(width)).toBeGreaterThan(0);
                    expect(ownerOutlined[key][phase].paint.borderStyles).toEqual(['solid', 'solid', 'solid', 'solid']);
                }
            }
            await state.selectOption('variants');
            const publicShapes = {};
            for (const [shape, name] of [
                ['square', 'Square'],
                ['round', 'Round'],
                ['circle', 'Add item'],
            ]) {
                const action = publicRoot.getByRole('button', { name, exact: true });
                publicShapes[shape] = await normalAndPressed(page, action);
                if (shape !== 'circle')
                    for (const phase of ['normal', 'pressed']) sameShape(owner[shape].default[phase], publicShapes[shape][phase]);
            }
            const stableShape = config.designSystem === 'md3' || config.designSystem === 'macos';
            expect(owner.square.selected.normal.radii).toEqual(owner.square.default.normal.radii);
            expect(owner.square.selected.pressed.radii).toEqual(owner.square.default.pressed.radii);
            expect(owner.round.selected.normal.radii).toEqual(stableShape
                ? owner.round.default.normal.radii : owner.square.selected.normal.radii);
            expect(owner.round.selected.pressed.radii).toEqual(owner.round.default.pressed.radii);
            if (stableShape) {
                for (const shape of ['default', 'square', 'round']) {
                    expect(owner[shape].selected.normal.radii).toEqual(owner[shape].default.normal.radii);
                    for (const state of ['default', 'selected']) {
                        expect(owner[shape][state].pressed.radii).toEqual(owner[shape][state].normal.radii);
                    }
                }
            }

            const circleRoot = await openDemo(page, previewOrigin, 'rc-button', 'circle.demo.tsx', config);
            const circle = circleRoot.getByRole('button', { name: '新增', exact: true }).nth(1);
            const sourceCircle = await normalAndPressed(page, circle);
            for (const phase of ['normal', 'pressed']) {
                // This demo inherits medium; the public matrix explicitly uses s.
                // MD3 keeps their circle shape while separating 36px and 40px.
                if (config.designSystem === 'md3') {
                    expect(sourceCircle[phase].radii).toEqual(publicShapes.circle[phase].radii);
                    expect(sourceCircle[phase].height).toBeCloseTo(36, 1);
                    expect(publicShapes.circle[phase].height).toBeCloseTo(40, 1);
                } else sameShape(sourceCircle[phase], publicShapes.circle[phase]);
                expect(sourceCircle[phase].width).toBeCloseTo(sourceCircle[phase].height, 1);
                expect(Number.parseFloat(sourceCircle[phase].radii[0])).toBeGreaterThanOrEqual(sourceCircle[phase].height / 2);
            }
            await page.evaluate(() =>
                globalThis.postMessage({ type: 'wake:args', args: { isSelected: true } }, globalThis.location.origin),
            );
            await expect(circle).toHaveAttribute('aria-pressed', 'true');
            const selectedCircle = await normalAndPressed(page, circle);
            for (const phase of ['normal', 'pressed']) sameShape(selectedCircle[phase], sourceCircle[phase]);
            await info.attach('owner-public-shape-geometry', {
                body: JSON.stringify({
                    config,
                    owner,
                    ownerOutlined,
                    published,
                    publishedOutlined,
                    publicShapes,
                    sourceCircle,
                    selectedCircle,
                }),
                contentType: 'application/json',
            });
        },
    );

async function connectedDemo(page, previewOrigin, config) {
    const root = await openDemo(page, previewOrigin, 'rc-button', 'expressive.demo.tsx', config);
    const group = root.locator('[data-variant="connected"]');
    await expect(group.getByRole('button')).toHaveCount(3);
    await group.scrollIntoViewIfNeeded();
    return group;
}

async function expectStableGroup(actions, initial) {
    await settleFiniteAnimations(actions[0].page());
    for (const [index, action] of actions.entries()) {
        const current = await geometry(action);
        expect(current.radii).toEqual(initial[index].radii);
        sameBounds(current, initial[index]);
    }
}

for (const config of configurations) {
    test(`connected Button corners stay fixed through pointer and keyboard selection ${config.designSystem} ${config.colorMode}`, {
        tag: ['@rc-button', '@boundary', '@chromium-only'],
    }, async ({ page, previewOrigin }) => {
        const narrow = config.colorMode === 'dark';
        await page.setViewportSize({ width: narrow ? 320 : 1440, height: 820 });
        if (narrow) await page.emulateMedia({ reducedMotion: 'reduce' });
        const group = await connectedDemo(page, previewOrigin, {
            ...config, direction: narrow ? 'rtl' : 'ltr', size: narrow ? 'small' : 'large',
        });
        const actions = await group.getByRole('button').all();
        const initial = await Promise.all(actions.map(geometry));
        if (config.designSystem !== 'macos') {
            expect(initial[0].radii[0]).not.toEqual(initial[0].radii[1]);
            expect(initial[2].radii[0]).not.toEqual(initial[2].radii[1]);
        }
        await actions[1].hover();
        await page.mouse.down();
        try {
            await expectStableGroup(actions, initial);
        } finally {
            await page.mouse.up();
        }
        await expect(actions[1]).toHaveAttribute('aria-pressed', 'true');
        await expectStableGroup(actions, initial);
        await actions[1].press('Tab');
        await expect(actions[2]).toBeFocused();
        await page.keyboard.down('Space');
        try {
            await expectStableGroup(actions, initial);
        } finally {
            await page.keyboard.up('Space');
        }
        await expect(actions[2]).toHaveAttribute('aria-pressed', 'true');
        await expect(actions[1]).toHaveAttribute('aria-pressed', 'false');
        await expectStableGroup(actions, initial);
        await actions[0].press('Enter');
        await expect(actions[0]).toHaveAttribute('aria-pressed', 'true');
        await expectStableGroup(actions, initial);
    });
}

test.describe('MD3 Button touch corners', () => {
    test.use({ hasTouch: true, viewport: { width: 360, height: 780 } });

    test('keeps the connected layout and corners after tapping a different selection', {
        tag: ['@rc-button', '@boundary', '@chromium-only'],
    }, async ({ page, previewOrigin }) => {
        const group = await connectedDemo(page, previewOrigin, { designSystem: 'md3', colorMode: 'light' });
        const actions = await group.getByRole('button').all();
        const initial = await Promise.all(actions.map(geometry));
        await actions[1].tap();
        await expect(actions[1]).toHaveAttribute('aria-pressed', 'true');
        await expectStableGroup(actions, initial);
    });
});
