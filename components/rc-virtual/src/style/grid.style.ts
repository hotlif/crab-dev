import { css } from "@linaria/core";
import { containerStyle as scrollbarContainerStyle } from "./scrollbar.style";

export const containerStyle = css`
	position: relative;
	background-color: inherit;
	& > .${scrollbarContainerStyle} {
		opacity: 0;
		transition: opacity 150ms;
	}
	&:hover > .${scrollbarContainerStyle} {
		opacity: 1;
	}
`;

export const gridStyle = css`
	overflow: hidden;
	position: relative;
`;


