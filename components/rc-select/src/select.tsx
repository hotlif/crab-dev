import RcDropdownContainer from "@crab-dev/rc-dropdown-container";
import { useId, useRef, useState, type FC } from "react";
import { useControllableValue } from "@crab-dev/rc-hooks";

import useKeyboardNavigation from "./hooks/useKeyboardNavigation.js";
import SelectInput from "./selectInput.js";
import SelectOverlay from "./selectOverlay.js";
import type { FlatOption, SelectOption, SelectOptionGroup, SelectOptionOrGroup, SelectProps } from "./types.js";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const isGroup = (item: SelectOptionOrGroup): item is SelectOptionGroup =>
    "options" in item && Array.isArray((item as SelectOptionGroup).options);

const asArray = (value: string | string[] | undefined): string[] => {
    if (value === undefined) {
        return [];
    }

    return Array.isArray(value) ? value : [value];
};

const flattenOptions = (options: SelectOptionOrGroup[]): FlatOption[] => {
    const result: FlatOption[] = [];

    // 分组标题用所在下标生成合成 value,保证唯一;不得用 String(label),因为 label 是
    // ReactNode,序列化后多个分组会碰撞成 "__group_[object Object]",导致重复 React key。
    options.forEach((item, index) => {
        if (isGroup(item)) {
            result.push({ label: item.label, value: `__group_${index}`, isGroupLabel: true });

            for (const opt of item.options) {
                result.push(opt);
            }
        } else {
            result.push(item);
        }
    });

    return result;
};

const flattenPlainOptions = (options: SelectOptionOrGroup[]): SelectOption[] => {
    const result: SelectOption[] = [];

    for (const item of options) {
        if (isGroup(item)) {
            for (const opt of item.options) {
                result.push(opt);
            }
        } else {
            result.push(item);
        }
    }

    return result;
};

const filterOptions = (flatOptions: FlatOption[], searchable: boolean, searchText: string): FlatOption[] => {
    if (!searchable || searchText.trim() === "") {
        return flatOptions;
    }

    const keyword = searchText.trim().toLowerCase();

    return flatOptions.filter((opt) => {
        if (opt.isGroupLabel) {
            return false;
        }

        if (typeof opt.label === "string") {
            return opt.label.toLowerCase().includes(keyword);
        }

        return opt.value.toLowerCase().includes(keyword);
    });
};

const firstEnabledIndex = (flatOptions: FlatOption[]): number =>
    flatOptions.findIndex((opt) => !opt.disabled && !opt.isGroupLabel);

// ─── Component ───────────────────────────────────────────────────────────────

const Select: FC<SelectProps> = ({
    ref,
    options,
    placeholder = "请选择",
    disabled = false,
    searchable = false,
    multiple = false,
    size = "middle",
    status,
    allowClear = false,
    loading = false,
    maxTagCount,
    autoFocus = false,
    notFoundContent,
    popupClassName,
    popupMatchSelectWidth = true,
    optionRender,
    tagRender,
    dropdownRender,
    value,
    defaultValue,
    onChange,
    onOpenChange,
    onFocus,
    onBlur,
    className,
    "aria-label": ariaLabel,
    ...restProps
}) => {
    // combobox 的 aria-controls / aria-activedescendant 与 listbox 及各 option 的 id
    // 共享同一前缀(§3 触发器与目标显式关联),故在两个子组件的共同父级生成一次。
    const listboxId = useId();
    const [searchText, setSearchText] = useState("");
    // 内部统一以 string[] 表示选中值（单选也用长度 ≤1 的数组）；受控 / 非受控由 hook 统一
    const [selectedValues, setSelectedValues] = useControllableValue<string[]>({
        value: value !== undefined ? asArray(value) : undefined,
        defaultValue: asArray(defaultValue),
    });
    const [triggerWidth, setTriggerWidth] = useState(0);

    const onOpenChangeRef = useRef(onOpenChange);
    onOpenChangeRef.current = onOpenChange;

    const allPlainOptions = flattenPlainOptions(options);

    const selectedOptions = allPlainOptions.filter((opt) => selectedValues.includes(opt.value));

    const flatOptions = flattenOptions(options);

    const filteredOptions = filterOptions(flatOptions, searchable, searchText);

    const { highlightIndex, highlightedOption, moveHighlight, resetHighlight, setHighlightIndex } =
        useKeyboardNavigation({ filteredOptions, open: true });

    const emitOpenChange = (nextOpen: boolean) => {
        if (nextOpen) {
            // 单选且已有选中值时,打开下拉应直接高亮当前选中项(继而被 SelectOverlay
            // 的滚动 effect 带入视口),而非从 -1 开始——否则选中项不在首屏时,
            // 用户得自己往下翻找才能看到"当前选的是哪个"。
            if (!multiple && selectedValues.length > 0) {
                const selectedIndex = filteredOptions.findIndex((opt) => opt.value === selectedValues[0]);
                setHighlightIndex(selectedIndex);
            }
        } else {
            setSearchText("");
            resetHighlight();
        }

        onOpenChangeRef.current?.(nextOpen);
    };

    const updateValue = (nextValues: string[]) => {
        setSelectedValues(nextValues);

        if (multiple) {
            const nextOptions = allPlainOptions.filter((opt) => nextValues.includes(opt.value));
            (onChange as ((v: string[], o: SelectOption[]) => void) | undefined)?.(nextValues, nextOptions);
            return;
        }

        const nextValue = nextValues[0];
        const nextOption = allPlainOptions.find((opt) => opt.value === nextValue);
        (onChange as ((v: string | undefined, o: SelectOption | undefined) => void) | undefined)?.(
            nextValue,
            nextOption,
        );
    };

    const handleOptionSelect = (option: FlatOption) => {
        if (option.disabled || option.isGroupLabel) {
            return;
        }

        if (multiple) {
            const exists = selectedValues.includes(option.value);
            const nextValues = exists
                ? selectedValues.filter((v) => v !== option.value)
                : [...selectedValues, option.value];

            updateValue(nextValues);
            return;
        }

        updateValue([option.value]);
    };

    const handleClear = () => {
        updateValue([]);
        setSearchText("");
    };

    const handleRemoveTag = (val: string) => {
        updateValue(selectedValues.filter((v) => v !== val));
    };

    const handleTriggerWidthChange = (width: number) => {
        setTriggerWidth(width);
    };

    const handleSearchTextChange = (text: string) => {
        setSearchText(text);

        // 过滤结果随搜索词变化,把高亮重置到新结果的第一个可选项:
        // 既避免旧高亮索引越界(highlightedOption 变 undefined 导致回车失效),
        // 也让「筛出唯一项后直接回车即可选中」成立。
        const nextFiltered = filterOptions(flatOptions, searchable, text);
        setHighlightIndex(firstEnabledIndex(nextFiltered));
    };

    const floatingStyle = popupMatchSelectWidth
        ? { width: triggerWidth }
        : { minWidth: triggerWidth };

    return (
        <RcDropdownContainer
            {...restProps}
            className={className}
            overlay={
                <SelectOverlay
                    multiple={multiple}
                    loading={loading}
                    filteredOptions={filteredOptions}
                    selectedValues={selectedValues}
                    triggerWidth={triggerWidth}
                    highlightIndex={highlightIndex}
                    listboxId={listboxId}
                    notFoundContent={notFoundContent}
                    popupClassName={popupClassName}
                    optionRender={optionRender}
                    dropdownRender={dropdownRender}
                    onOptionSelect={handleOptionSelect}
                    onOpenChange={emitOpenChange}
                    onHighlightChange={setHighlightIndex}
                />
            }
            floatingContainerProps={{ style: floatingStyle }}
        >
            <SelectInput
                ref={ref}
                ariaLabel={ariaLabel}
                disabled={disabled}
                searchable={searchable}
                multiple={multiple}
                size={size}
                status={status}
                allowClear={allowClear}
                loading={loading}
                maxTagCount={maxTagCount}
                autoFocus={autoFocus}
                placeholder={placeholder}
                selectedOptions={selectedOptions}
                searchText={searchText}
                highlightIndex={highlightIndex}
                highlightedOption={highlightedOption}
                listboxId={listboxId}
                tagRender={tagRender}
                onSearchTextChange={handleSearchTextChange}
                onOpenChange={emitOpenChange}
                onWidthChange={handleTriggerWidthChange}
                onMoveHighlight={moveHighlight}
                onSelectHighlighted={handleOptionSelect}
                onClear={handleClear}
                onRemoveTag={handleRemoveTag}
                onFocus={onFocus}
                onBlur={onBlur}
            />
        </RcDropdownContainer>
    );
};

export default Select;
