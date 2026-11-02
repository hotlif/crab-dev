export function formatContext(context) {
    const lines = [`目标：${context.target} (${context.kind})`, ...(context.workspace ? [`工作区：${context.workspace}`] : [])];
    for (const [key, title] of [["rules", "适用规则"], ["relatedRules", "关联来源规则"], ["navigation", "任务导航"], ["sources", "编辑来源与测试"],
        ["documents", "关联文档"], ["generated", "生成物"], ["skills", "相关技能"]]) {
        if (!context[key].length) continue;
        lines.push(`\n${title}`);
        for (const item of context[key]) lines.push(`- ${item.path} — ${item.purpose}`);
    }
    if (context.commands.length) lines.push("\n公开命令（仅列出，不执行）", ...context.commands.map(item => `- ${item.command} — ${item.purpose}`));
    for (const [key, title] of [["dependencies", "直接依赖"], ["dependents", "直接使用方"]]) {
        if (!context[key]) continue;
        for (const [role, names] of Object.entries(context[key])) if (names.length) lines.push(`\n${title} / ${role}: ${names.join(", ")}`);
    }
    lines.push(...context.notes.map(note => `\n${note}`));
    return `${lines.join("\n")}\n`;
}
