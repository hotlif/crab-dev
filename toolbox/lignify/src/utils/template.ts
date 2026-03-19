import { copy } from "fs-extra";
import { join } from "path";

/**
 * 拷贝模板目录到目标临时目录
 */
export async function copyTemplate(projectPath: string, targetDir: string) {
    const templateDir = join(projectPath, "template");
    try {
        await copy(templateDir, targetDir, {
            overwrite: true,
            errorOnExist: false
        });
    } catch (err) {
        console.error("failed to copy template directory:", err);
    }
}
