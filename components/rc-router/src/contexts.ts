import { createContext } from 'react';
import type { Context, ReactElement } from 'react';
import type { BrowserHistory } from './history.js';
import type { RouteMatch } from './matcher.js';
import type { Location, NavigationType } from './types.js';

export interface NavigationContextValue {
    basename: string;
    history: BrowserHistory;
}

export interface LocationContextValue {
    location: Location;
    navigationType: NavigationType;
}

export interface RouteContextValue {
    matches: readonly RouteMatch[];
    outlet: ReactElement | null;
}

export const NavigationContext: Context<NavigationContextValue | null> = createContext<NavigationContextValue | null>(null);
export const LocationContext: Context<LocationContextValue | null> = createContext<LocationContextValue | null>(null);
export const RouteContext: Context<RouteContextValue | null> = createContext<RouteContextValue | null>(null);
export const OutletContext: Context<unknown> = createContext<unknown>(undefined);
