import { describe, expect, it } from "@crab-dev/wake/test";
import { addThousandSeparator, applyPrecision, clamp, countDecimalPlaces, decimalDigitCount, formatEditing, formatPlain, parseNumber, shouldUseScientific, toPlainDecimalString, toScientificParts, toScientificString, } from "../format.js";
describe("format 纯函数", () => {
    describe("parseNumber", () => {
        const base = { decimalSeparator: ".", thousandSeparator: false as const };
        it("解析普通数字", () => {
            expect(parseNumber("123.45", base)).toBe(123.45);
            expect(parseNumber("-42", base)).toBe(-42);
            expect(parseNumber("+7", base)).toBe(7);
        });
        it("解析指数写法", () => {
            expect(parseNumber("1e5", base)).toBe(100000);
            expect(parseNumber("1.23e-3", base)).toBe(0.00123);
        });
        it("空串与中间态返回 null", () => {
            expect(parseNumber("", base)).toBeNull();
            expect(parseNumber("   ", base)).toBeNull();
            expect(parseNumber("-", base)).toBeNull();
            expect(parseNumber("1e", base)).toBeNull();
            expect(parseNumber("abc", base)).toBeNull();
        });
        it("剥离千分位分隔符", () => {
            expect(parseNumber("1,234,567", { decimalSeparator: ".", thousandSeparator: "," })).toBe(1234567);
        });
        it("归一化自定义小数点符号", () => {
            expect(parseNumber("1.234,5", { decimalSeparator: ",", thousandSeparator: "." })).toBe(1234.5);
        });
        it("优先使用自定义 parser", () => {
            expect(parseNumber("$5", { ...base, parser: () => 99 })).toBe(99);
        });
    });
    describe("clamp", () => {
        it("钳制到区间", () => {
            expect(clamp(5, 0, 10)).toBe(5);
            expect(clamp(-3, 0, 10)).toBe(0);
            expect(clamp(42, 0, 10)).toBe(10);
        });
    });
    describe("applyPrecision", () => {
        it("按精度四舍五入", () => {
            expect(applyPrecision(1.2345, 2)).toBe(1.23);
            expect(applyPrecision(1.2355, 2)).toBe(1.24);
            expect(applyPrecision(5, 0)).toBe(5);
        });
        it("precision 为 undefined 时原样返回", () => {
            expect(applyPrecision(1.23456, undefined)).toBe(1.23456);
        });
    });
    describe("countDecimalPlaces", () => {
        it("常规小数位", () => {
            expect(countDecimalPlaces(0.1)).toBe(1);
            expect(countDecimalPlaces(1.25)).toBe(2);
            expect(countDecimalPlaces(5)).toBe(0);
        });
        it("指数记法小数位", () => {
            expect(countDecimalPlaces(1e-7)).toBe(7);
        });
    });
    describe("decimalDigitCount（不好显示的度量）", () => {
        it("常规数取十进制长度", () => {
            expect(decimalDigitCount(123)).toBe(3);
            expect(decimalDigitCount(1000)).toBe(4);
            expect(decimalDigitCount(0.00012)).toBe(5);
            expect(decimalDigitCount(0)).toBe(1);
        });
        it("占位零多的数取完整十进制长度", () => {
            expect(decimalDigitCount(Number("1e20"))).toBe(21);
            expect(decimalDigitCount(1e-16)).toBe(16);
        });
        it("精确处于阈值边界", () => {
            expect(decimalDigitCount(123456789012345)).toBe(15);
            expect(decimalDigitCount(1234567890123456)).toBe(16);
        });
    });
    describe("shouldUseScientific", () => {
        it("auto：超阈值才转", () => {
            expect(shouldUseScientific(1.23e21, "auto", 15)).toBe(true);
            expect(shouldUseScientific(1000, "auto", 15)).toBe(false);
            expect(shouldUseScientific(123456789012345, "auto", 15)).toBe(false);
            expect(shouldUseScientific(1234567890123456, "auto", 15)).toBe(true);
        });
        it("never / always", () => {
            expect(shouldUseScientific(1e30, "never", 15)).toBe(false);
            expect(shouldUseScientific(5, "always", 15)).toBe(true);
            expect(shouldUseScientific(0, "always", 15)).toBe(false);
        });
    });
    describe("toScientificParts / toScientificString", () => {
        it("拆分尾数与指数并去尾零", () => {
            expect(toScientificParts(1.23e21)).toEqual({ mantissa: "1.23", exponent: 21 });
            expect(toScientificParts(Number("1e20"))).toEqual({ mantissa: "1", exponent: 20 });
            expect(toScientificParts(-4.5e-8)).toEqual({ mantissa: "-4.5", exponent: -8 });
        });
        it("序列化为可编辑 e 记法", () => {
            expect(toScientificString(1.23e21)).toBe("1.23e+21");
            expect(toScientificString(5e-8)).toBe("5e-8");
        });
    });
    describe("toPlainDecimalString（展开指数记法）", () => {
        it("大数展开", () => {
            expect(toPlainDecimalString(1e21)).toBe("1000000000000000000000");
            expect(toPlainDecimalString(1.23e5)).toBe("123000");
        });
        it("小数展开", () => {
            expect(toPlainDecimalString(1.2e-7)).toBe("0.00000012");
        });
        it("普通数原样", () => {
            expect(toPlainDecimalString(123.4)).toBe("123.4");
            expect(toPlainDecimalString(0)).toBe("0");
            expect(toPlainDecimalString(-15)).toBe("-15");
        });
    });
    describe("addThousandSeparator", () => {
        it("每三位插入分隔符", () => {
            expect(addThousandSeparator("1234567", ",")).toBe("1,234,567");
            expect(addThousandSeparator("100", ",")).toBe("100");
        });
    });
    describe("formatPlain", () => {
        it("千分位 + 小数", () => {
            expect(formatPlain(1234567.89, { thousandSeparator: ",", decimalSeparator: "." }))
                .toBe("1,234,567.89");
        });
        it("负数千分位", () => {
            expect(formatPlain(-1234.5, { thousandSeparator: ",", decimalSeparator: "." }))
                .toBe("-1,234.5");
        });
        it("固定精度补零", () => {
            expect(formatPlain(1.5, { precision: 3, thousandSeparator: false, decimalSeparator: "." }))
                .toBe("1.500");
        });
        it("自定义小数点符号", () => {
            expect(formatPlain(1234.5, { thousandSeparator: ".", decimalSeparator: "," }))
                .toBe("1.234,5");
        });
        it("无千分位", () => {
            expect(formatPlain(1234567, { thousandSeparator: false, decimalSeparator: "." }))
                .toBe("1234567");
        });
    });
    describe("formatEditing", () => {
        it("普通态去千分位", () => {
            expect(formatEditing(1234567, { useScientific: false, decimalSeparator: "." }))
                .toBe("1234567");
        });
        it("科学态回显 e 记法", () => {
            expect(formatEditing(1.23e21, { useScientific: true, decimalSeparator: "." }))
                .toBe("1.23e+21");
        });
    });
});
