import { act, describe, expect, it, render } from "@crab-dev/wake/test/react";
import React from 'react';
import Prose from '../prose.js';
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
describe('Prose', () => {
    it('renders as div by default', async () => {
        const { container, unmount } = await render(<Prose>Hello</Prose>);
        const el = container.firstElementChild as HTMLElement;
        expect(el.tagName.toLowerCase()).toBe('div');
        await unmount();
    });
    it('renders children correctly', async () => {
        const { container, unmount } = await render(<Prose>
            <h1>Title</h1>
            <p>Paragraph</p>
        </Prose>);
        expect(container.textContent).toContain('Title');
        expect(container.textContent).toContain('Paragraph');
        await unmount();
    });
    it('renders as article when as="article"', async () => {
        const { container, unmount } = await render(<Prose as="article">Content</Prose>);
        const el = container.firstElementChild as HTMLElement;
        expect(el.tagName.toLowerCase()).toBe('article');
        await unmount();
    });
    it('renders as section when as="section"', async () => {
        const { container, unmount } = await render(<Prose as="section">Content</Prose>);
        const el = container.firstElementChild as HTMLElement;
        expect(el.tagName.toLowerCase()).toBe('section');
        await unmount();
    });
    it('renders as main when as="main"', async () => {
        const { container, unmount } = await render(<Prose as="main">Content</Prose>);
        const el = container.firstElementChild as HTMLElement;
        expect(el.tagName.toLowerCase()).toBe('main');
        await unmount();
    });
    it('applies a className to the root element', async () => {
        const { container, unmount } = await render(<Prose className="custom-class">Content</Prose>);
        const el = container.firstElementChild as HTMLElement;
        expect(el.classList.contains('custom-class')).toBe(true);
        await unmount();
    });
    it('applies additional className alongside generated class', async () => {
        const { container, unmount } = await render(<Prose className="extra">Content</Prose>);
        const el = container.firstElementChild as HTMLElement;
        // At least two classes: the Crab CSS generated one and the consumer class
        expect(el.classList.length).toBeGreaterThanOrEqual(2);
        expect(el.classList.contains('extra')).toBe(true);
        await unmount();
    });
    it('applies the invert style class when invert=true', async () => {
        const { container: withInvert, unmount: u1 } = await render(<Prose invert={true}>Content</Prose>);
        const { container: withoutInvert, unmount: u2 } = await render(<Prose invert={false}>Content</Prose>);
        const invertedClasses = (withInvert.firstElementChild as HTMLElement).className;
        const normalClasses = (withoutInvert.firstElementChild as HTMLElement).className;
        // The inverted element should have more classes (base + size + invert vs base + size)
        expect(invertedClasses.split(' ').length).toBeGreaterThan(normalClasses.split(' ').length);
        await u1();
        await u2();
    });
    it('applies different classes for each size variant', async () => {
        const sizes = ['sm', 'base', 'lg', 'xl'] as const;
        const classes: string[] = [];
        for (const size of sizes) {
            const { container, unmount } = await render(<Prose size={size}>Content</Prose>);
            classes.push((container.firstElementChild as HTMLElement).className);
            await unmount();
        }
        // All size classes must be unique
        const uniqueClasses = new Set(classes);
        expect(uniqueClasses.size).toBe(sizes.length);
    });
    it('forwards HTML attributes to the root element', async () => {
        const { container, unmount } = await render(<Prose data-testid="prose-root" aria-label="article content">
                Content
        </Prose>);
        const el = container.firstElementChild as HTMLElement;
        expect(el.getAttribute('data-testid')).toBe('prose-root');
        expect(el.getAttribute('aria-label')).toBe('article content');
        await unmount();
    });
    it('forwards style prop to the root element', async () => {
        const { container, unmount } = await render(<Prose style={{ maxWidth: 'none' }}>Content</Prose>);
        const el = container.firstElementChild as HTMLElement;
        expect(el.style.maxWidth).toBe('none');
        await unmount();
    });
    it('attaches ref to the root DOM element', async () => {
        let capturedEl: HTMLElement | null = null;
        const Wrapper = () => {
            const refCallback = (el: HTMLDivElement | null) => {
                capturedEl = el;
            };
            return <Prose ref={refCallback}>Content</Prose>;
        };
        await act(async () => {
            await render(<Wrapper />);
        });
        expect(capturedEl).not.toBeNull();
        const el = capturedEl as unknown as HTMLElement;
        expect(el.tagName.toLowerCase()).toBe('div');
    });
    it('defaults: size=base, invert=false, as=div', async () => {
        const { container, unmount } = await render(<Prose>Default</Prose>);
        const el = container.firstElementChild as HTMLElement;
        // Tag is div
        expect(el.tagName.toLowerCase()).toBe('div');
        // Not inverted — same class count as explicit invert=false
        const { container: explicit, unmount: u2 } = await render(<Prose invert={false} size="base" as="div">Default</Prose>);
        expect(el.className).toBe((explicit.firstElementChild as HTMLElement).className);
        await unmount();
        await u2();
    });
});
