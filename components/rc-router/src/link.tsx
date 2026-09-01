import type { MouseEvent as ReactMouseEvent } from 'react';
import { useHref, useLocation, useNavigate, useNavigationContext, useResolvedPath, } from './hooks.js';
import { isAbsoluteUrl, normalizeBasename, stripBasename } from './path.js';
import type { LinkProps, NavLinkProps, NavLinkRenderProps, To } from './types.js';

interface LinkTarget {
    external: boolean;
    href: string;
    navigationTarget: To;
}

function useLinkTarget(
    to: To,
    relative: 'route' | 'path' = 'route',
): LinkTarget {
    const localHref = useHref(
        typeof to === 'string' && isAbsoluteUrl(to) ? '/' : to,
        relative,
    );
    const { basename, history } = useNavigationContext();

    if (typeof to !== 'string' || !isAbsoluteUrl(to)) {
        return { external: false, href: localHref, navigationTarget: to };
    }

    let absoluteUrl: URL;
    try {
        absoluteUrl = new URL(to, history.window.location.href);
    } catch {
        return { external: true, href: to, navigationTarget: to };
    }
    const strippedPathname = stripBasename(
        absoluteUrl.pathname,
        normalizeBasename(basename),
    );
    const external =
        absoluteUrl.origin !== history.window.location.origin ||
        strippedPathname === null;
    return {
        external,
        href: absoluteUrl.href,
        navigationTarget: external
            ? to
            : {
                pathname: strippedPathname,
                search: absoluteUrl.search,
                hash: absoluteUrl.hash,
            },
    };
}

function shouldProcessClick(
    event: ReactMouseEvent<HTMLAnchorElement>,
    target: string | undefined,
): boolean {
    return (
        event.button === 0 &&
        (!target || target === '_self') &&
        !event.metaKey &&
        !event.altKey &&
        !event.ctrlKey &&
        !event.shiftKey
    );
}

/**
 * 渲染具有真实 href、同时支持客户端导航的链接。
 */
export function Link({
    ref,
    to,
    replace,
    state,
    relative,
    reloadDocument,
    onClick,
    target,
    download,
    ...anchorProps
}: LinkProps) {
    const navigate = useNavigate();
    const linkTarget = useLinkTarget(to, relative);

    const handleClick = (event: ReactMouseEvent<HTMLAnchorElement>): void => {
        onClick?.(event);
        if (
            event.defaultPrevented ||
            reloadDocument ||
            linkTarget.external ||
            download !== undefined ||
            !shouldProcessClick(event, target)
        ) {
            return;
        }
        event.preventDefault();
        navigate(linkTarget.navigationTarget, { replace, state, relative });
    };

    return (
        <a
            {...anchorProps}
            ref={ref}
            href={linkTarget.href}
            target={target}
            download={download}
            onClick={handleClick}
        />
    );
}

function isPathActive(
    currentPathname: string,
    targetPathname: string,
    end: boolean,
    caseSensitive: boolean,
): boolean {
    const current = caseSensitive ? currentPathname : currentPathname.toLowerCase();
    const target = caseSensitive ? targetPathname : targetPathname.toLowerCase();
    if (target === '/') {
        return current === '/';
    }
    if (end) {
        return current === target;
    }
    return current === target || current.startsWith(`${target}/`);
}

/**
 * 在 Link 基础上提供当前路径的激活状态和 aria-current 反馈。
 */
export function NavLink({
    to,
    relative,
    caseSensitive = false,
    end = false,
    className,
    children,
    'aria-current': ariaCurrent,
    ...linkProps
}: NavLinkProps) {
    const location = useLocation();
    const linkTarget = useLinkTarget(to, relative);
    const resolvedPath = useResolvedPath(
        linkTarget.external ? '/' : linkTarget.navigationTarget,
        relative,
    );
    const isActive = !linkTarget.external && isPathActive(
        location.pathname,
        resolvedPath.pathname,
        end,
        caseSensitive,
    );
    const renderProps: NavLinkRenderProps = { isActive, isPending: false };
    const resolvedClassName =
        typeof className === 'function' ? className(renderProps) : className;
    const resolvedChildren =
        typeof children === 'function' ? children(renderProps) : children;

    return (
        <Link
            {...linkProps}
            to={to}
            relative={relative}
            className={resolvedClassName}
            aria-current={isActive ? (ariaCurrent ?? 'page') : undefined}
        >
            {resolvedChildren}
        </Link>
    );
}
