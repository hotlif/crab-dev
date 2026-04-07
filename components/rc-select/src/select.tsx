import RcDropdownContainer from "@crab-dev/rc-dropdown-container";
import { useCallback, useMemo, useRef, useState, type FC } from "react";

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

    for (const item of options) {
        if (isGroup(item)) {
            result.push({ label: item.label, value: `__group_${String(item.label)}`, isGroupLabel: true });

            for (const opt of item.options) {
                result.push(opt);
            }
        } else {
            result.push(item);
        }
    }

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

// ─── Component ───────────────────────────────────────────────────────────────

const Select: FC<SelectProps> = ({
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
    const isControlled = value !== undefined;
    const [searchText, setSearchText] = useState("");
    const [internalValue, setInternalValue] = useState<string[]>(() => asArray(defaultValue));
    const [triggerWidth, setTriggerWidth] = useState(0);

    const onOpenChangeRef = useRef(onOpenChange);
    onOpenChangeRef.current = onOpenChange;

    const selectedValues = isControlled ? asArray(value) : internalValue;

    const allPlainOptions = useMemo(() => flattenPlainOptions(options), [options]);

    const selectedOptions = useMemo(
        () => allPlainOptions.filter((opt) => selectedValues.includes(opt.value)),
        [allPlainOptions, selectedValues],
    );

    const flatOptions = useMemo(() => flattenOptions(options), [options]);

    const filteredOptions = useMemo(() => {
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
    }, [flatOptions, searchable, searchText]);

    const { highlightIndex, highlightedOption, moveHighlight, resetHighlight, setHighlightIndex } =
        useKeyboardNavigation({ filteredOptions, open: true });

    const emitOpenChange = useCallback((nextOpen: boolean) => {
        if (!nextOpen) {
            setSearchText("");
            resetHighlight();
        }

        onOpenChangeRef.current?.(nextOpen);
    }, [resetHighlight]);

    const updateValue = useCallback((nextValues: string[]) => {
        if (!isControlled) {
            setInternalValue(nextValues);
        }

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
    }, [isControlled, multiple, allPlainOptions, onChange]);

    const handleOptionSelect = useCallback((option: FlatOption) => {
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
    }, [multiple, selectedValues, updateValue]);

    const handleClear = useCallback(() => {
        updateValue([]);
        setSearchText("");
    }, [updateValue]);

    const handleRemoveTag = useCallback((val: string) => {
        updateValue(selectedValues.filter((v) => v !== val));
    }, [selectedValues, updateValue]);

    const handleTriggerWidthChange = useCallback((width: number) => {
        setTriggerWidth(width);
    }, []);

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
                highlightedOption={highlightedOption}
                tagRender={tagRender}
                onSearchTextChange={setSearchText}
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