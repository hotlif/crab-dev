import { css } from "@linaria/core";
import {
    fontSize,
    fontFamily
} from "@crab/styleify";

export default css`
    :global() {
        * {
            ${fontFamily("sans")}
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
            ${fontSize("xl")};
        }
    }
`
