import { type RefObject, useEffect, useState } from "react";

export const useViewportSize = <T extends HTMLElement> (divRef: RefObject<T | null>) => {
	const [viewportWidth, setViewportWidth] = useState<number>(0);
	const [viewportHeight, setViewportHeight] = useState<number>(0);
	useEffect(() => {
		const resizeObserver = new ResizeObserver((entries) => {
			entries.forEach(entry => {
				const { width, height } = entry.target.getBoundingClientRect();
				setViewportHeight(height);
				setViewportWidth(width);
			});
		});

		if (divRef.current) {
			resizeObserver.observe(divRef.current);
		}

		return () => {
			if (divRef.current) {
				resizeObserver.unobserve(divRef.current);
			}
		};
	}, []);
	return [viewportWidth, viewportHeight]
}
