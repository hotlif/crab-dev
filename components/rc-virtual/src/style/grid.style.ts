
export const containerStyle = `
	position: relative;
`;

export const gridStyle = `
	display: grid;
	overflow: hidden;
	position: relative;
	&::before {
		position: absolute;
		z-index: -1;
		display: block;
		content: "";
		grid-column-start: 1;
		grid-column-end: -1;
		grid-row-start: 1;
		grid-row-end: -1;
	}
`;


