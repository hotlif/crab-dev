import { useCallback, useState } from "react";

import type { FlatOption } from "../types.js";

interface UseKeyboardNavigationOptions {
    filteredOptions: FlatOption[];
    open: boolean;
}

const useKeyboardNavigation = ({ filteredOptions, open }: UseKeyboardNavigationOptions) => {
    const [highlightIndex, setHighlightIndex] = useState(-1);

    const findNextEnabledIndex = useCallback(
        (startIndex: number, direction: 1 | -1): number => {
            const len = filteredOptions.length;

            if (len === 0) {
                return -1;
            }

            let index = startIndex;

            for (let i = 0; i < len; i += 1) {
                index = ((index + direction) % len + len) % len;
                const opt = filteredOptions[index];

                if (!opt.disabled && !opt.isGroupLabel) {
                    return index;
                }
            }

            return -1;
        },
        [filteredOptions],
    );

    const moveHighlight = useCallback(
        (direction: 1 | -1) => {
            if (!open) {
                return;
            }

            setHighlightIndex((prev) => {
                const start = prev === -1
                    ? (direction === 1 ? -1 : 0)
                    : prev;

                return findNextEnabledIndex(start, direction);
            });
        },
        [open, findNextEnabledIndex],
    );

    const resetHighlight = useCallback(() => {
        setHighlightIndex(-1);
    }, []);

    const highlightedOption = highlightIndex >= 0 && highlightIndex < filteredOptions.length
        ? filteredOptions[highlightIndex]
        : undefined;

    return {
        highlightIndex,
        highlightedOption,
        moveHighlight,
        resetHighlight,
        setHighlightIndex,
    };
};

export default useKeyboardNavigation;
