import {
	zIndex
} from "@crab-dev/styleify";

export const containerStyle = `
	cursor: pointer;
	background-color: unset;
	position: absolute;
	border-radius: 99px;
	user-select: none;
	${zIndex("mid")};
`;

export const thumbStyle = `
	cursor: pointer;
	background-color: rgba(0, 0, 0, 0.5);
	position: absolute;
	border-radius: 99px;
	user-select: none;
`;

export const xContainerStyle = `
	width: 100%;
	height: 8px;
	bottom: 0;
`;

export const xThumbStyle = `
	height: 100%;
`;

export const yContainerStyle = `
	width: 8px;
	height: 100%;
	top: 0;
	right: 0;
`;

export const yThumbStyle = `
	width: 100%;
`;
