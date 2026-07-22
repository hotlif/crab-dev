/**
 * Shadow DOM 沙箱工具, 仅 mount 协议 + sandbox: true 分支使用。
 * mode 固定 'open'：closed 不可调试不可测试, 而样式隔离不依赖 closed。
 * CSS 自定义属性天然穿透 shadow 边界——远程样式可直接引用主题令牌变量,
 * 这是隔离下唯一"应该穿透"的东西, 行为正确且免费。
 */

/** 幂等取得 shadow root：StrictMode / 重挂二次调用不炸（attachShadow 重复调用会抛） */
export function ensureShadowRoot(host: HTMLElement): ShadowRoot {
    return host.shadowRoot ?? host.attachShadow({ mode: 'open' });
}

/**
 * 注入沙箱样式。优先 adoptedStyleSheets 整组替换；jsdom / 旧浏览器回退为
 * <style data-realm-style> 节点（先清旧再加新, 重复调用幂等）。
 * 必须在容器子节点就位后调用——回退分支的 style 是 root 的子节点,
 * 先 applyStyleSheets 再 replaceChildren 会把样式一并清掉。
 */
export function applyStyleSheets(root: ShadowRoot, cssTexts: readonly string[]): void {
    const all = [':host { display: block; }', ...cssTexts];
    const supportsAdopted =
        'adoptedStyleSheets' in root &&
        typeof CSSStyleSheet !== 'undefined' &&
        'replaceSync' in CSSStyleSheet.prototype;
    if (supportsAdopted) {
        root.adoptedStyleSheets = all.map((text) => {
            const sheet = new CSSStyleSheet();
            sheet.replaceSync(text);
            return sheet;
        });
    } else {
        for (const stale of root.querySelectorAll('style[data-realm-style]')) {
            stale.remove();
        }
        for (const text of all) {
            const style = document.createElement('style');
            style.dataset.realmStyle = '';
            style.textContent = text;
            root.append(style);
        }
    }
}
