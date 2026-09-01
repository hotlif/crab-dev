import { createContext } from 'react';
import type { ReactElement } from 'react';
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

export const NavigationContext = createContext<NavigationContextValue | null>(null);
export const LocationContext = createContext<LocationContextValue | null>(null);
export const RouteContext = createContext<RouteContextValue | null>(null);
export const OutletContext = createContext<unknown>(undefined);
