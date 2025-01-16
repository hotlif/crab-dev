export const getTemplateStyle = (objs: number[]) => {
    const result: number[][] = [];
    objs.forEach((obj) => {
        const data = result[result.length - 1];
        if (data?.length > 0) {
            if (data?.[0] === obj) {
                data.push(obj)
            } else {
                result.push([obj])
            }
        } else {
            result.push([obj]);
        }
    })

    let template = "";
    result.forEach(row => {
        if (row.length > 1) {
            template += `repeat(${row.length}, ${row[0]}px) `
        } else {
            template += `${row?.[0]}`
        }
    })
    return template;
}
