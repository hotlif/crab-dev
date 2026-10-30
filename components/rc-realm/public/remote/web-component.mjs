// Shared remote implementation: both real entry formats expose this lifecycle.
const tagName = 'crab-realm-network-draft';

function registerElement(document) {
    const view = document.defaultView;
    if (!view) throw new Error('A live document is required');
    if (view.customElements.get(tagName)) return;
    view.customElements.define(tagName, class extends view.HTMLElement {
        #style;
        #title;
        connectedCallback() {
            this.dataset.connected = 'true';
            if (this.shadowRoot) return;
            const root = this.attachShadow({ mode: 'open' });
            this.#style = this.ownerDocument.createElement('style');
            this.#title = this.ownerDocument.createElement('p');
            const label = this.ownerDocument.createElement('label');
            label.textContent = 'Web Component draft';
            const input = this.ownerDocument.createElement('input');
            input.value = 'Network CRAB-2026';
            label.append(input); root.append(this.#style, this.#title, label);
        }
        disconnectedCallback() { this.dataset.connected = 'false'; }
        set configuration(value) {
            this.#style.textContent = String(value.styleText ?? '');
            this.#title.textContent = String(value.caption ?? '');
        }
    });
}

export function createLifecycle() {
    // Realm caches remote modules. Key each consumer explicitly so sharing the
    // exported lifecycle never mixes instances or transfers another draft.
    const elements = new Map();
    return {
        mount(container, props) {
            if (typeof props.instanceId !== 'string') throw new Error('A remote instanceId is required');
            registerElement(container.ownerDocument);
            const element = container.ownerDocument.createElement(tagName);
            container.append(element); element.configuration = props;
            elements.set(props.instanceId, element);
            return () => { element.remove(); if (elements.get(props.instanceId) === element) elements.delete(props.instanceId); };
        },
        update(props) { const element = elements.get(props.instanceId); if (element) element.configuration = props; },
    };
}
