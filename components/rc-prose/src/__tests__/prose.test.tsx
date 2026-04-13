import React, { act } from 'react';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from '@jest/globals';

import Prose from '../prose.js';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => cleanup());

describe('Prose', () => {
    it('renders as div by default', () => {
        const { container, unmount } = render(<Prose>Hello</Prose>);
        const el = container.firstElementChild as HTMLElement;
        expect(el.tagName.toLowerCase()).toBe('div');
        unmount();
    });

    it('renders children correctly', () => {
        const { container, unmount } = render(
            <Prose>
                <h1>Title</h1>
                <p>Paragraph</p>
            </Prose>,
        );
        expect(container.textContent).toContain('Title');
        expect(container.textContent).toContain('Paragraph');
        unmount();
    });

    it('renders as article when as="article"', () => {
        const { container, unmount } = render(<Prose as="article">Content</Prose>);
        const el = container.firstElementChild as HTMLElement;
        expect(el.tagName.toLowerCase()).toBe('article');
        unmount();
    });

    it('renders as section when as="section"', () => {
        const { container, unmount } = render(<Prose as="section">Content</Prose>);
        const el = container.firstElementChild as HTMLElement;
        expect(el.tagName.toLowerCase()).toBe('section');
        unmount();
    });

    it('renders as main when as="main"', () => {
        const { container, unmount } = render(<Prose as="main">Content</Prose>);
        const el = container.firstElementChild as HTMLElement;
        expect(el.tagName.toLowerCase()).toBe('main');
        unmount();
    });

    it('applies a className to the root element', () => {
        const { container, unmount } = render(
            <Prose className="custom-class">Content</Prose>,
        );
        const el = container.firstElementChild as HTMLElement;
        expect(el.classList.contains('custom-class')).toBe(true);
        unmount();
    });

    it('applies additional className alongside generated class', () => {
        const { container, unmount } = render(
            <Prose className="extra">Content</Prose>,
        );
        const el = container.firstElementChild as HTMLElement;
        // At least two classes: the linaria-generated one and the consumer class
        expect(el.classList.length).toBeGreaterThanOrEqual(2);
        expect(el.classList.contains('extra')).toBe(true);
        unmount();
    });

    it('applies the invert style class when invert=true', () => {
        const { container: withInvert, unmount: u1 } = render(
            <Prose invert={true}>Content</Prose>,
        );
        const { container: withoutInvert, unmount: u2 } = render(
            <Prose invert={false}>Content</Prose>,
        );

        const invertedClasses = (withInvert.firstElementChild as HTMLElement).className;
        const normalClasses = (withoutInvert.firstElementChild as HTMLElement).className;

        // The inverted element should have more classes (base + size + invert vs base + size)
        expect(invertedClasses.split(' ').length).toBeGreaterThan(
            normalClasses.split(' ').length,
        );

        u1();
        u2();
    });

    it('applies different classes for each size variant', () => {
        const sizes = ['sm', 'base', 'lg', 'xl'] as const;
        const classes = sizes.map((size) => {
            const { container, unmount } = render(<Prose size={size}>Content</Prose>);
            const className = (container.firstElementChild as HTMLElement).className;
            unmount();
            return className;
        });

        // All size classes must be unique
        const uniqueClasses = new Set(classes);
        expect(uniqueClasses.size).toBe(sizes.length);
    });

    it('forwards HTML attributes to the root element', () => {
        const { container, unmount } = render(
            <Prose data-testid="prose-root" aria-label="article content">
                Content
            </Prose>,
        );
        const el = container.firstElementChild as HTMLElement;
        expect(el.getAttribute('data-testid')).toBe('prose-root');
        expect(el.getAttribute('aria-label')).toBe('article content');
        unmount();
    });

    it('forwards style prop to the root element', () => {
        const { container, unmount } = render(
            <Prose style={{ maxWidth: 'none' }}>Content</Prose>,
        );
        const el = container.firstElementChild as HTMLElement;
        expect(el.style.maxWidth).toBe('none');
        unmount();
    });

    it('attaches ref to the root DOM element', () => {
        let capturedEl: HTMLElement | null = null;

        const Wrapper = () => {
            const refCallback = (el: HTMLDivElement | null) => {
                capturedEl = el;
            };
            return <Prose ref={refCallback}>Content</Prose>;
        };

        act(() => {
            render(<Wrapper />);
        });

        expect(capturedEl).not.toBeNull();
        const el = capturedEl as unknown as HTMLElement;
        expect(el.tagName.toLowerCase()).toBe('div');
    });

    it('defaults: size=base, invert=false, as=div', () => {
        const { container, unmount } = render(<Prose>Default</Prose>);
        const el = container.firstElementChild as HTMLElement;

        // Tag is div
        expect(el.tagName.toLowerCase()).toBe('div');
        // Not inverted — same class count as explicit invert=false
        const { container: explicit, unmount: u2 } = render(
            <Prose invert={false} size="base" as="div">Default</Prose>,
        );
        expect(el.className).toBe((explicit.firstElementChild as HTMLElement).className);

        unmount();
        u2();
    });
});
