import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { parse } from 'smol-toml';

interface Token {
  build: {
    output: string;
    prefix: string;
  };
  token: {
    color: Record<string, any>;
    dimension: Record<string, any>;
    typography: Record<string, any>;
    motion: Record<string, any>;
    elevation: Record<string, any>;
    border: Record<string, any>;
    opacity: Record<string, any>;
  };
}

const generateToken = (prefix: string, value:  Record<string, any>) => {
    let tsStr = "";
    Object.keys(value).forEach(element => {
        let cssValue: string = value[element].trim();
        tsStr += `'${element}': 'var(--${prefix}-${element}, ${cssValue})',\n\t\t`
    })
    return tsStr;
}

const generateCssToken = async () => {
    const content = await readFile(join(process.cwd(), "token.toml"), "utf-8");
    const config = parse(content) as unknown as Token;
    const { build, token } = config;

    const {
        output,
        prefix
    } = build;
    const {
        color,
        dimension,
        typography,
        motion,
        elevation,
        border,
        opacity
    } = token;

    let tsSourceCode =`const token = {
    color: {
        ${generateToken(`${prefix}-color`, color)}
    },
    dimension: {
        ${generateToken(`${prefix}-dimension`, dimension)}
    },
    typography: {
        ${generateToken(`${prefix}-typography`, typography)}
    },
    motion: {
        ${generateToken(`${prefix}-motion`, motion)}
    },
    elevation: {
        ${generateToken(`${prefix}-elevation`, elevation)}
    },
    border: {
        ${generateToken(`${prefix}-border`, border)}
    },
    opacity: {
        ${generateToken(`${prefix}-opacity`, opacity)}
    }
};
export default token;
`
    await writeFile(output, tsSourceCode)
}

export default generateCssToken;