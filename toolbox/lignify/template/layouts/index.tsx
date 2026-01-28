import { css } from "@linaria/core";

const LayoutIndex = () => {
    return (
        <div>
            <header
                className={css`
                    height: 40px;
                `}
            >
                <h1>Lignify</h1>
            </header>
            <div
                className={css`
                    display: flex;    
                `}
            >
                <aside>
                </aside>   
                <main>
                </main>
            </div>
        </div>
    )
}

export default LayoutIndex;
