import { type ReactNode, type FC, useRef } from "react";
import { useMenuDisclosure, useMenuSelectionFocus } from '../interactions.js';
import { css, cx } from "@crab-dev/css";

import { type MenuProps } from "../menu.js";
import { ItemType, type Item } from "../type.js";
import ItemGroup from "./itemGroup.js";
import ItemNormal from "./itemNormal.js";
import { FloatingTree } from "@floating-ui/react";
import token from "../token.js";
import { navigateMenu } from '../keyboard.js';

const horizontalMenuRoot = css`
    display: flex;
    position: relative;
    flex-direction: row;
    flex-wrap: wrap;
    min-width: 0;
    max-width: 100%;
    margin: 0;
    padding: 0;
    list-style-type: none;
    border-bottom: 1px solid ${token.horizontal["border-color"]};
    @media (forced-colors: active) { border-bottom-color: CanvasText; }
    box-sizing: border-box;
`

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface HorizontalMenuProps extends Omit<MenuProps, "mode"> {
}

const HorizontalMenu: FC<HorizontalMenuProps> = ({
    className,
    openKeys = [],
    selectedKeys = [],
    items = [],
    onSelectedKeysChange,
    onOpenKeysChange,
    onClick,
    onKeyDown,
    ...props
}) => {
    const root = useRef<HTMLUListElement | null>(null);
    const captureSelectionFocus = useMenuSelectionFocus(openKeys, root);
    const { requestOpen, closeAll } = useMenuDisclosure(openKeys, onOpenKeysChange, root);

    const renderItem = (item: Item, children: ReactNode[], depth: number) => {
        return (
            <ItemNormal
                key={item.key}
                item={item}
                depth={depth}
                selected={selectedKeys.includes(item.key)}
                open={openKeys.includes(item.key)}
                onOpenChange={(next, event, dismissal) => requestOpen(item, depth, next, event, dismissal)}
                onClick={param => {
                    if (!item.children?.length) captureSelectionFocus(param.event.currentTarget);
                    onClick?.({ event: param.event, item: param.item });
                    onSelectedKeysChange?.(selectedKeys.includes(item.key) ? [] : [item.key], { reason: selectedKeys.includes(item.key) ? 'deselect' : 'select', item, event: param.activationEvent ?? param.event });
                    if (!item.children?.length && openKeys.length) {
                        closeAll(item, param.activationEvent ?? param.event);
                    }
                }}
            >
                {children}
            </ItemNormal>
        );
    }

    const renderItemGroup = (item: Item, children: ReactNode[], depth: number) => {
        return (
            <ItemGroup
                key={item.key}
                item={item}
                depth={depth}
            >
                {children}
            </ItemGroup>
        );
    }

    const renderMenu = (items: Item[], depth: number): ReactNode[] => {
        return items.map(item => {
            if (item.type === ItemType.ItemGroup ) {
                return renderItemGroup(item, renderMenu(item.children ?? [], depth + 1), depth);
            } else if (item.type === ItemType.Item) {
                return renderItem(item, renderMenu(item.children ?? [],depth + 1), depth);
            } else {
                throw new Error(`[${item.type}] The parameter \`type\` is incorrect, please check.`)
            }
        })
    }

    return (
        <FloatingTree>
            <ul
                ref={root}
                className={cx(className, horizontalMenuRoot)}
                {...props}
                onKeyDown={event => { onKeyDown?.(event); navigateMenu(event, true); }}
            >
                {renderMenu(items, 1)}
            </ul>
        </FloatingTree>
    )
}

export default HorizontalMenu;
