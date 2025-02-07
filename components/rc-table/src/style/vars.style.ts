import { css } from "@linaria/core";

export const globals = css`
	:global() {
		html {
			--table-cell-border-color: #ddd;
			--table-header-background-color: hsl(0deg 0% 97.5%);
			--table-body-group-background-color: hsl(0deg 0% 98.5%);
			--table-cell-selection-color: rgb(22, 119, 255);
		}
	}
`;