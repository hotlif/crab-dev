import { css } from "@crab-dev/css";
import { containerStyle as scrollbarContainerStyle } from "./scrollbar.style";
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

export const gridStyle = css`
	overflow: hidden;
	position: relative;
`;


