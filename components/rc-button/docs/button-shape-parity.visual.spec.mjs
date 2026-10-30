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
        expect(pressed.width).toBeCloseTo(normal.width, 1);
        expect(pressed.height).toBeCloseTo(normal.height, 1);
    } finally {
        await page.mouse.up();
        // Native clicks retain the documented minimum feedback after release.
        await expect.poll(() => action.getAttribute('data-press-feedback')).toBeNull();
        await settleFiniteAnimations(page);
    }
    return { normal, pressed };
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
            // Square remains square when selected. Explicit round becomes the existing
            // selected-square treatment, and its real press keeps the same pressed role.
            expect(owner.square.selected.normal.radii).toEqual(owner.square.default.normal.radii);
            expect(owner.square.selected.pressed.radii).toEqual(owner.square.default.pressed.radii);
            expect(owner.round.selected.normal.radii).toEqual(owner.square.selected.normal.radii);
            expect(owner.round.selected.pressed.radii).toEqual(owner.round.default.pressed.radii);

            const circleRoot = await openDemo(page, previewOrigin, 'rc-button', 'circle.demo.tsx', config);
            const circle = circleRoot.getByRole('button', { name: '新增', exact: true }).nth(1);
            const sourceCircle = await normalAndPressed(page, circle);
            for (const phase of ['normal', 'pressed']) {
                sameShape(sourceCircle[phase], publicShapes.circle[phase]);
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
