import { css } from "@linaria/core";
import { fontSize } from "@crab/styleify";


export default css`
    table {
        width: 100%;
        border-collapse: collapse;
        * {
            ${fontSize("base")}
        }
        th,td {
            padding: 0.5rem 1rem;
            border-bottom: 1px solid #e5e7eb;
        }

        thead {
            th {
                text-align: left;
            }
        }

        tbody {
            td {
                vertical-align: initial;
            }
        }
    }
    ul {
        > li {
            line-height: 1.5;
        }
    }
    
`
