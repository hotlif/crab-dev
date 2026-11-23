import { css } from "@crab-dev/css";
import { containerStyle as scrollbarContainerStyle } from "./scrollbar.style.js";
import token from "../token.js";

export const containerStyle = css`
	position: relative;
	background-color: inherit;
	& > .${scrollbarContainerStyle} {
		opacity: ${token.scrollbar.opacity};
		transition: opacity ${token.scrollbar.transition};
	}
	&:hover > .${scrollbarContainerStyle},
	&:focus-within > .${scrollbarContainerStyle} {
		opacity: 1;
	}
	@media (prefers-reduced-motion: reduce) {
		& > .${scrollbarContainerStyle} { transition: none; }
	}
`;

// 局部占位和滚动位置由 Virtual 同步，禁止浏览器锚定在布局后再次补偿位移。
export const gridStyle = css`
	overflow: hidden;
	overflow-anchor: none;
	position: relative;
`;

// The direct window can scroll between column updates. Let the browser prepare its scroll layers.
export const scrollPositionHintStyle = css`
	will-change: scroll-position;
`;


