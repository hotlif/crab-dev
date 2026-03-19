import { css } from "@linaria/core";
import { useOutlet } from "react-router";


const PlaygroundLayout = () => {
    const outlet = useOutlet();
    return (
        <div
            className={css`
                display: flex;
                height: 100%;
            `}
        >
            {outlet}
        </div>
    )
}

export default PlaygroundLayout;