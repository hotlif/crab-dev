import { css } from "@crab-dev/css";

export const containerStyle = css`
	cursor: pointer;
	background-color: unset;
	position: absolute;
	border-radius: 99px;
	user-select: none;
	z-index: 200;
`;

export const thumbStyle = css`
	cursor: pointer;
	background-color: rgba(0, 0, 0, 0.5);
	position: absolute;
	border-radius: 99px;
	user-select: none;
`;

export const xContainerStyle = css`
	width: 100%;
	height: 8px;
	bottom: 0;
`;

export const xThumbStyle = css`
	height: 100%;
`;

export const yContainerStyle = css`
	width: 8px;
	height: 100%;
	top: 0;
	right: 0;
`;

export const yThumbStyle = css`
	width: 100%;
`;
