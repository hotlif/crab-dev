import { useLayoutEffect, useState, type FC } from "react";
import { useMediaQuery } from '@crab-dev/rc-hooks';

import { type MenuProps } from "../menu.js";
import VerticalNormalMenu from "./normal.js";
import VerticalCollapsedMenu from "./collapsed.js";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface VerticalMenuProps extends Omit<MenuProps, "mode"> {}

const VerticalMenu: FC<VerticalMenuProps> = (props) => {
    const [showCollapsed, setShowCollapsed] = useState(Boolean(props.inlineCollapsed));
    const [element, setElement] = useState<HTMLUListElement | null>(null);
    const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

    useLayoutEffect(() => {
        if (!props.inlineCollapsed) {
            setShowCollapsed(false);
            return;
        }
        // The menu's host owns width/padding timing. Follow its actual finite
        // transitions, including custom tokens and reversals, rather than
        // guessing a delay that outlives reduced motion or shorter themes.
        let cancelled = false;
        const settled = new Set<Promise<Animation>>();
        const observe = () => {
            if (cancelled) return;
            const pending: Promise<Animation>[] = [];
            for (let node: HTMLElement | null = element; node && !reducedMotion; node = node.parentElement) {
                for (const animation of node.getAnimations?.() ?? []) {
                    if ('transitionProperty' in animation
                        && /^(width|inline-size|padding(?:-.+)?|grid-template-columns)$/.test(String(animation.transitionProperty))
                        && animation.playState !== 'finished' && animation.playState !== 'idle'
                        && animation.effect?.getTiming().iterations !== Infinity
                        && !settled.has(animation.finished)) pending.push(animation.finished);
                }
            }
            if (!pending.length) { setShowCollapsed(true); return; }
            void Promise.allSettled(pending).then(() => {
                for (const finished of pending) settled.add(finished);
                observe();
            });
        };
        observe();
        return () => { cancelled = true; };
    }, [props.inlineCollapsed, element, reducedMotion]);

    if (showCollapsed) {
        return <VerticalCollapsedMenu {...props} />;
    }
    return <VerticalNormalMenu {...props} motionRef={setElement} />;
};

export default VerticalMenu;
