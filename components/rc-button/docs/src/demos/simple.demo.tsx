/**
 * label="基础用法"
 * description="一个简单的单行文本编辑器"
 */

import { css } from "@linaria/core";
import { AiOutlineLock  } from "react-icons/ai";
import Button from "../../../src/index";


const paddingTop = css`
	padding-top: 1rem;
`

const SimpleFrame = () => {
	return (
		<>
			<div
				className={css`
					display: flex;
					gap: 2rem;
				`}
			>
				<div>
					Default Button
					<div
						className={paddingTop}
					>
						<Button size="large">large</Button>
					</div>
					<div
						className={paddingTop}
					>
						<Button size="middle"> middle </Button>
					</div>
					<div
						className={paddingTop}
					>
						<Button size="small"> small </Button>
					</div>
				</div>
				<div>
					Primary Button
					<div
						className={paddingTop}
					>
						<Button appearance="primary" size="large">large</Button>
					</div>
					<div
						className={paddingTop}
					>
						<Button appearance="primary" size="middle"> middle </Button>
					</div>
					<div
						className={paddingTop}
					>
						<Button appearance="primary" size="small"> small </Button>
					</div>
				</div>
				<div>
					Dashed Button
					<div
						className={paddingTop}
					>
						<Button appearance="dashed" size="large">large</Button>
					</div>
					<div
						className={paddingTop}
					>
						<Button appearance="dashed" size="middle"> middle </Button>
					</div>
					<div
						className={paddingTop}
					>
						<Button appearance="dashed" size="small"> small </Button>
					</div>
				</div>
				<div>
					Link Button
					<div
						className={paddingTop}
					>
						<Button appearance="link" size="large">large</Button>
					</div>
					<div
						className={paddingTop}
					>
						<Button appearance="link" size="middle"> middle </Button>
					</div>
					<div
						className={paddingTop}
					>
						<Button appearance="link" size="small"> small </Button>
					</div>
				</div>
				<div>
					Text Button
					<div
						className={paddingTop}
					>
						<Button appearance="text" size="large">large</Button>
					</div>
					<div
						className={paddingTop}
					>
						<Button appearance="text" size="middle"> middle </Button>
					</div>
					<div
						className={paddingTop}
					>
						<Button appearance="text" size="small"> small </Button>
					</div>
				</div>
			</div>
			<br />
			<br />
			<div
				className={css`
					display: flex;
					gap: 2rem;
				`}
			>
				<div>
					Disabled Default Button
					<div
						className={paddingTop}
					>
						<Button disabled size="large">large</Button>
					</div>
					<div
						className={paddingTop}
					>
						<Button disabled size="middle"> middle </Button>
					</div>
					<div
						className={paddingTop}
					>
						<Button disabled size="small"> small </Button>
					</div>
				</div>
				<div>
					Disabled Primary Button
					<div
						className={paddingTop}
					>
						<Button disabled appearance="primary" size="large">large</Button>
					</div>
					<div
						className={paddingTop}
					>
						<Button disabled appearance="primary" size="middle"> middle </Button>
					</div>
					<div
						className={paddingTop}
					>
						<Button disabled appearance="primary" size="small"> small </Button>
					</div>
				</div>
				<div>
					Disabled Dashed Button
					<div
						className={paddingTop}
					>
						<Button disabled appearance="dashed" size="large">large</Button>
					</div>
					<div
						className={paddingTop}
					>
						<Button disabled appearance="dashed" size="middle"> middle </Button>
					</div>
					<div
						className={paddingTop}
					>
						<Button disabled appearance="dashed" size="small"> small </Button>
					</div>
				</div>
				<div>
					Disabled Link Button
					<div
						className={paddingTop}
					>
						<Button disabled appearance="link" size="large">large</Button>
					</div>
					<div
						className={paddingTop}
					>
						<Button disabled appearance="link" size="middle"> middle </Button>
					</div>
					<div
						className={paddingTop}
					>
						<Button disabled appearance="link" size="small"> small </Button>
					</div>
				</div>
				<div>
					Disabled Text Button
					<div
						className={paddingTop}
					>
						<Button disabled appearance="text" size="large">large</Button>
					</div>
					<div
						className={paddingTop}
					>
						<Button disabled appearance="text" size="middle"> middle </Button>
					</div>
					<div
						className={paddingTop}
					>
						<Button disabled appearance="text" size="small"> small </Button>
					</div>
				</div>
			</div>
			<br />
			<br />
			<div
				className={css`
					display: flex;
					gap: 2rem;
				`}
			>
				<div>
					Loading Default Button
					<div
						className={paddingTop}
					>
						<Button loading size="large">large</Button>
					</div>
					<div
						className={paddingTop}
					>
						<Button loading size="middle"> middle </Button>
					</div>
					<div
						className={paddingTop}
					>
						<Button loading size="small"> small </Button>
					</div>
				</div>
				<div>
					Loading Primary Button
					<div
						className={paddingTop}
					>
						<Button loading appearance="primary" size="large">large</Button>
					</div>
					<div
						className={paddingTop}
					>
						<Button loading appearance="primary" size="middle"> middle </Button>
					</div>
					<div
						className={paddingTop}
					>
						<Button loading appearance="primary" size="small"> small </Button>
					</div>
				</div>
				<div>
					Loading Dashed Button
					<div
						className={paddingTop}
					>
						<Button loading appearance="dashed" size="large">large</Button>
					</div>
					<div
						className={paddingTop}
					>
						<Button loading appearance="dashed" size="middle"> middle </Button>
					</div>
					<div
						className={paddingTop}
					>
						<Button loading appearance="dashed" size="small"> small </Button>
					</div>
				</div>
				<div>
					Loading Link Button
					<div
						className={paddingTop}
					>
						<Button loading appearance="link" size="large">large</Button>
					</div>
					<div
						className={paddingTop}
					>
						<Button loading appearance="link" size="middle"> middle </Button>
					</div>
					<div
						className={paddingTop}
					>
						<Button loading appearance="link" size="small"> small </Button>
					</div>
				</div>
				<div>
					Loading Text Button
					<div
						className={paddingTop}
					>
						<Button loading appearance="text" size="large">large</Button>
					</div>
					<div
						className={paddingTop}
					>
						<Button loading appearance="text" size="middle"> middle </Button>
					</div>
					<div
						className={paddingTop}
					>
						<Button loading appearance="text" size="small"> small </Button>
					</div>
				</div>
			</div>
		</>

	)
};

export default SimpleFrame;
