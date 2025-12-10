/**
 * path = "*"
 */
import { css } from "@linaria/core";

const Error404Page = () => {
    return (
        <div
            className={css`
                display: flex;
                width: 100%;
                height: 100%;
                justify-content: center;
                align-items: center;
            `}
        >
            <img
                className={css`
                    width: 40%;
                    object-fit: cover;    
                `}
                src="/undraw/undraw_page-not-found_6wni.svg"
            />
        </div>
    )
}

export default Error404Page;