import { css } from "@linaria/core";
import {
    fontSize,
    fontFamily
} from "@crab/styleify";

export default css`
    :global() {
        * {
            ${fontFamily("serif")}
            ${fontSize("base")};
        }
        h1 {
           ${fontSize("3xl")};
        }
        h2 {
           ${fontSize("2xl")};
        }
        h3 {
           ${fontSize("xl")};
        }
        h4 {
            ${fontSize("lg")};
        }

        p {
            margin-block-start: 0rem;
            margin-block-end: 0rem;
        }
    }
`
