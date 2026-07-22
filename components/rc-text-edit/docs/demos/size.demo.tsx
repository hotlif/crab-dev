/**
 * title = "三种尺寸"
 * description = "`size` 控制内边距与字号排版（large / middle / small），可视高度仍由 `rows` 决定"
 */

import { css } from "@linaria/core";
import { useState } from "react";
import TextEdit from "../../src/index.js";

const wrapperStyle = css`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    max-width: 480px;
`;

const SizeDemo = () => {
    const [large, setLarge] = useState("");
    const [middle, setMiddle] = useState("");
    const [small, setSmall] = useState("");

    return (
        <div className={wrapperStyle}>
            <TextEdit size="large" rows={2} value={large} placeholder="large" onChange={(e) => setLarge(e.target.value)} />
            <TextEdit size="middle" rows={2} value={middle} placeholder="middle（默认）" onChange={(e) => setMiddle(e.target.value)} />
            <TextEdit size="small" rows={2} value={small} placeholder="small" onChange={(e) => setSmall(e.target.value)} />
        </div>
    );
};

export default SizeDemo;
