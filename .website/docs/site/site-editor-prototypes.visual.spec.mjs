import { test, expect, settleFiniteAnimations } from '../../../test/visual/component-fixture.mjs';
import { assertDocumentWidth, designIds, openSite } from './site-visual-support.mjs';

const options = { tag: ['@website'] };

async function capture(page, info, route, design, mode) {
    const path = info.outputPath(`${route}-${design}-${mode}.png`);
    await settleFiniteAnimations(page);
    const surface = route === 'pdf-editor' ? page.getByRole('region', { name: 'PDF 操作区' }) : page.locator('[data-editor-stage]');
    await surface.screenshot({ path, animations: 'disabled' });
    await info.attach(route, { path, contentType: 'image/png' });
}

for (const designSystem of designIds) {
    for (const [colorMode, width] of [['light', 1440], ['dark', 320]]) {
        test(`Canvas supports bounded zoom, dragging and recovery in ${designSystem} ${colorMode}`, options, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 860 });
            await openSite(page, previewOrigin, { path: '/design/canvas', heading: 'Canvas 工程画布' }, { designSystem, colorMode });
            const frame = page.getByRole('region', { name: '泵站布置画布' });
            const zoom = async () => Number(await frame.getAttribute('data-canvas-zoom'));
            const pan = async () => Number(await frame.getAttribute('data-canvas-pan-x'));
            const status = page.locator('[data-canvas-status]');
            await expect(frame.locator('canvas')).toBeVisible();
            const original = await zoom();
            const position = await pan();
            await frame.press('ArrowRight');
            expect(await pan()).toBeGreaterThan(position);
            await frame.press('Equal');
            expect(await zoom()).toBeGreaterThan(original);
            for (let index = 0; index < 7; index += 1) await frame.press('Equal');
            expect(await zoom()).toBe(200);
            await frame.press('0');
            expect(await zoom()).toBe(original);
            await frame.locator('canvas').scrollIntoViewIfNeeded();
            const bounds = await frame.locator('canvas').boundingBox();
            if (!bounds) throw new Error('Canvas has no client rectangle');
            await page.mouse.move(bounds.x + 14, bounds.y + 14);
            await page.mouse.down();
            await page.mouse.move(bounds.x + 50, bounds.y + 20, { steps: 5 });
            await page.mouse.up();
            expect(await pan()).toBeGreaterThan(position);

            const valve = page.getByRole('button', { name: '调节阀' });
            await valve.press('Enter');
            await expect(status).toContainText('选择模式');
            await expect(status).toContainText('已选择调节阀');
            await frame.press('Escape');
            await expect(status).toContainText('未选对象');
            await frame.press('0');
            await valve.press('Enter');
            await capture(page, info, 'canvas', designSystem, colorMode);
            await page.getByRole('button', { name: '新建空白画布' }).press('Enter');
            await expect(page.getByText('画布中还没有对象。')).toBeVisible();
            await page.getByRole('button', { name: '模拟初始化失败' }).press('Enter');
            await expect(page.getByRole('alert')).toContainText('无法初始化布置图');
            await page.getByRole('button', { name: '读取示例布置图' }).press('Enter');
            await expect(page.getByText('正在初始化工程画布')).toBeVisible();
            await expect(frame.locator('canvas')).toBeVisible();
            await assertDocumentWidth(page, info);
        });

        test(`FlowDiagram moves nodes and validates connections in ${designSystem} ${colorMode}`, options, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 860 });
            await openSite(page, previewOrigin, { path: '/design/flow-diagram', heading: 'FlowDiagram 节点与连线' }, { designSystem, colorMode });
            const stage = page.getByRole('region', { name: '设备数据流程图' });
            const status = page.locator('[data-flow-status]');
            const select = page.getByRole('button', { name: '流量采集', exact: true });
            const start = page.getByRole('button', { name: '设为连线起点' });
            const connect = page.getByRole('button', { name: '连接到选中节点' });
            await expect(stage).toHaveAttribute('data-flow-count', '1');
            await start.press('Enter');
            await connect.press('Enter');
            await expect(status).toContainText('无法连接到同一节点');
            await page.getByRole('button', { name: '指标校验', exact: true }).press('Enter');
            await connect.press('Enter');
            await expect(status).toContainText('已有连线');
            await start.press('Enter');
            await page.getByRole('button', { name: '工单队列', exact: true }).press('Enter');
            await connect.press('Enter');
            await expect(stage).toHaveAttribute('data-flow-count', '2');
            await expect(status).toContainText('指标校验已连接到工单队列');

            const originalX = Number(await select.getAttribute('data-node-x'));
            await select.press('ArrowRight');
            await expect(select).toBeFocused();
            await expect(select).toHaveAttribute('data-node-x', String(originalX + 12));
            const canvas = stage.locator('canvas');
            await canvas.scrollIntoViewIfNeeded();
            const box = await canvas.boundingBox();
            if (!box) throw new Error('FlowDiagram canvas has no client rectangle');
            const zoom = Number(await stage.getAttribute('data-flow-zoom')) / 100;
            const x = box.x + Number(await stage.getAttribute('data-flow-pan-x')) + (originalX + 12 + 52) * zoom;
            const y = box.y + Number(await stage.getAttribute('data-flow-pan-y')) + (width === 320 ? 36 : 122) * zoom;
            await page.mouse.move(x, y);
            await page.mouse.down();
            await page.mouse.move(x + 19, y + 2, { steps: 5 });
            await page.mouse.up();
            expect(Number(await select.getAttribute('data-node-x'))).toBeGreaterThan(originalX + 12);
            await page.getByRole('button', { name: '放大流程' }).press('Enter');
            expect(Number(await stage.getAttribute('data-flow-zoom'))).toBeGreaterThan(zoom * 100);
            await page.getByRole('button', { name: '定位全图' }).press('Enter');
            await capture(page, info, 'flow-diagram', designSystem, colorMode);
            await page.getByRole('button', { name: '查看空流程' }).press('Enter');
            await expect(stage).toHaveAttribute('data-flow-count', '0');
            await expect(status).toContainText('当前流程没有节点');
            await page.getByRole('button', { name: '恢复示例流程' }).press('Enter');
            await expect(stage).toHaveAttribute('data-flow-count', '2');
            await assertDocumentWidth(page, info);
        });

        test(`PdfEditor retains dirty data and produces a real export in ${designSystem} ${colorMode}`, options, async ({ page, previewOrigin }, info) => {
            await page.setViewportSize({ width, height: 920 });
            await openSite(page, previewOrigin, { path: '/design/pdf-editor', heading: 'PdfEditor 文档编辑器' }, { designSystem, colorMode });
            const document = page.locator('[data-pdf-prototype-status]');
            const workspace = page.getByRole('region', { name: 'PDF 操作区' });
            const save = page.getByRole('button', { name: '保存交接单' });
            const result = page.locator('[data-pdf-result]');
            await expect(document).toContainText('inspection-index.pdf', { timeout: 15000 });
            await expect(document).toContainText('第 1/');
            await page.getByRole('button', { name: '下一页', exact: true }).press('Enter');
            await expect(document).toContainText('第 2/');
            const broken = page.getByRole('button', { name: '模拟打开损坏文件' });
            await broken.press('Enter');
            const error = page.getByRole('alert').filter({ hasText: '文档操作失败' });
            await expect(error).toBeVisible();
            await expect(document).toContainText('inspection-index.pdf');
            await error.getByRole('button', { name: '关闭', exact: true }).press('Enter');
            await expect(error).toBeHidden();
            await expect(broken).toBeFocused();
            await page.getByRole('button', { name: '编辑模式' }).press('Enter');
            await workspace.getByRole('button', { name: '旋转页面', exact: true }).press('Enter');
            await expect(document).toHaveAttribute('data-pdf-dirty', 'true');
            await capture(page, info, 'pdf-editor', designSystem, colorMode);

            const open = page.getByRole('button', { name: '打开复核副本' });
            await open.press('Enter');
            const prompt = page.getByRole('dialog', { name: '保留当前文档的修改' });
            await expect(prompt).toBeVisible();
            await prompt.getByRole('button', { name: '继续编辑' }).press('Enter');
            await expect(prompt).toBeHidden();
            await expect(document).toHaveAttribute('data-pdf-dirty', 'true');
            await expect(result).toContainText('已保留当前文档');
            await save.press('Enter');
            await expect(page.getByRole('alert').filter({ hasText: '文档操作失败' })).toBeVisible();
            await expect(document).toHaveAttribute('data-pdf-dirty', 'true');
            await save.press('Enter');
            await expect(document).toHaveAttribute('data-pdf-dirty', 'false');
            const download = page.getByRole('link', { name: '下载已保存 PDF' });
            await expect(download).toBeVisible();
            const source = await download.getAttribute('href');
            const prefix = await page.evaluate(async (href) => (await (await fetch(href)).blob()).slice(0, 4).text(), source);
            expect(prefix).toBe('%PDF');
            await open.press('Enter');
            await expect(document).toContainText('inspection-review.pdf');
            await expect(prompt).toBeHidden();
            await assertDocumentWidth(page, info);
        });
    }
}
