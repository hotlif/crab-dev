import { type RefObject, useEffect, useState } from "react";

export const useViewportSize = <T extends HTMLElement> (divRef: RefObject<T | null>) => {
	const [viewportWidth, setViewportWidth] = useState<number>(0);
	const [viewportHeight, setViewportHeight] = useState<number>(0);
	useEffect(() => {
		const node = divRef.current;
		if (node) {
			node.style.boxSizing = "border-box";
		}

		const resizeObserver = new ResizeObserver((entries) => {
			entries.forEach(entry => {
				const { width, height } = entry.target.getBoundingClientRect();
				setViewportHeight(height);
				setViewportWidth(width);
			});
		});

		if (node) {
			resizeObserver.observe(node);
		}

		return () => {
			if (node) {
				resizeObserver.unobserve(node);
			}
			resizeObserver.disconnect();
		};
	}, [divRef]);
	return [viewportWidth, viewportHeight] as const;
}
