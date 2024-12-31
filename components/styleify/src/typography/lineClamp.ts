const LineClampValue = {
    "1": "overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1;",
    "2": "overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2;",
    "3": "overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3;",
    "4": "overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 4;",
    "5": "overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 5;",
    "6": "overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 6;",
    none: "overflow: visible; display: block; -webkit-box-orient: horizontal; -webkit-line-clamp: none;",
};

export const lineClamp = (key: keyof typeof LineClampValue) => {
    return LineClampValue[key];
}
