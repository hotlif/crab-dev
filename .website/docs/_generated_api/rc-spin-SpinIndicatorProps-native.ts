// THIS FILE IS AUTO-GENERATED. DO NOT MODIFY MANUALLY.
// Wake 通过该扁平接口构建属性搜索索引；真实 API 仍以组件源码为准。

type DocsTypePlaceholder = ((...args: never[]) => unknown) & {
    readonly [key: string]: DocsTypePlaceholder;
    readonly [key: number]: DocsTypePlaceholder;
};
type AnimationEventHandler<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type AriaRole = DocsTypePlaceholder;
type Booleanish = DocsTypePlaceholder;
type ChangeEventHandler<T0 = unknown, T1 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0, T1] };
type ClipboardEventHandler<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type CompositionEventHandler<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type CrossOrigin = DocsTypePlaceholder;
type CSSProperties = DocsTypePlaceholder;
type DragEventHandler<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type Element = DocsTypePlaceholder;
type FocusEventHandler<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type InputEventHandler<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type KeyboardEventHandler<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type MouseEventHandler<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type PointerEventHandler<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type ReactEventHandler<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type SubmitEventHandler<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type SVGSVGElement = DocsTypePlaceholder;
type ToggleEventHandler<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type TouchEventHandler<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type TransitionEventHandler<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type TrustedHTML = DocsTypePlaceholder;
type UIEventHandler<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type WheelEventHandler<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };

export interface SpinIndicatorPropsNativeAttributes {
    /**
     * 暂无说明。
     */
    "string"?: number | string | undefined;

    /**
     * React-specific Attributes
     */
    "suppressHydrationWarning"?: boolean | undefined;

    /**
     * Attributes which also defined in HTMLAttributes See comment in SVGDOMPropertyConfig.js
     */
    "className"?: string | undefined;

    /**
     * 暂无说明。
     */
    "id"?: string | undefined;

    /**
     * 暂无说明。
     */
    "lang"?: string | undefined;

    /**
     * 暂无说明。
     */
    "nonce"?: string | undefined;

    /**
     * 暂无说明。
     */
    "slot"?: string | undefined;

    /**
     * 暂无说明。
     */
    "style"?: CSSProperties | undefined;

    /**
     * 暂无说明。
     */
    "tabIndex"?: number | undefined;

    /**
     * Other HTML properties supported by SVG elements in browsers
     */
    "role"?: AriaRole | undefined;

    /**
     * 暂无说明。
     */
    "color"?: string | undefined;

    /**
     * 暂无说明。
     */
    "part"?: string | undefined;

    /**
     * Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application.
     */
    "aria-activedescendant"?: string | undefined;

    /**
     * Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute.
     */
    "aria-atomic"?: Booleanish | undefined;

    /**
     * Indicates whether inputting text could trigger display of one or more predictions of the user’s intended value for an input and specifies how predictions would be presented if they are made.
     */
    "aria-autocomplete"?: "none" | "inline" | "list" | "both" | undefined;

    /**
     * Defines a string value that labels the current element, which is intended to be converted into Braille.
     */
    "aria-braillelabel"?: string | undefined;

    /**
     * Defines a human-readable, author-localized abbreviated description for the role of an element, which is intended to be converted into Braille.
     */
    "aria-brailleroledescription"?: string | undefined;

    /**
     * 暂无说明。
     */
    "aria-busy"?: Booleanish | undefined;

    /**
     * Indicates the current "checked" state of checkboxes, radio buttons, and other widgets.
     */
    "aria-checked"?: boolean | "false" | "mixed" | "true" | undefined;

    /**
     * Defines the total number of columns in a table, grid, or treegrid.
     */
    "aria-colcount"?: number | undefined;

    /**
     * Defines an element’s column index or position with respect to the total number of columns within a table, grid, or treegrid.
     */
    "aria-colindex"?: number | undefined;

    /**
     * Defines a human readable text alternative of aria-colindex.
     */
    "aria-colindextext"?: string | undefined;

    /**
     * Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid.
     */
    "aria-colspan"?: number | undefined;

    /**
     * Identifies the element (or elements) whose contents or presence are controlled by the current element.
     */
    "aria-controls"?: string | undefined;

    /**
     * Indicates the element that represents the current item within a container or set of related elements.
     */
    "aria-current"?: boolean | "false" | "true" | "page" | "step" | "location" | "date" | "time" | undefined;

    /**
     * Identifies the element (or elements) that describes the object.
     */
    "aria-describedby"?: string | undefined;

    /**
     * Defines a string value that describes or annotates the current element.
     */
    "aria-description"?: string | undefined;

    /**
     * Identifies the element that provides a detailed, extended description for the object.
     */
    "aria-details"?: string | undefined;

    /**
     * Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
     */
    "aria-disabled"?: Booleanish | undefined;

    /**
     * Indicates what functions can be performed when a dragged object is released on the drop target.
     * @deprecated
     */
    "aria-dropeffect"?: "none" | "copy" | "execute" | "link" | "move" | "popup" | undefined;

    /**
     * Identifies the element that provides an error message for the object.
     */
    "aria-errormessage"?: string | undefined;

    /**
     * Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed.
     */
    "aria-expanded"?: Booleanish | undefined;

    /**
     * Identifies the next element (or elements) in an alternate reading order of content which, at the user’s discretion, allows assistive technology to override the general default of reading in document source order.
     */
    "aria-flowto"?: string | undefined;

    /**
     * Indicates an element’s "grabbed" state in a drag-and-drop operation.
     * @deprecated
     */
    "aria-grabbed"?: Booleanish | undefined;

    /**
     * Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element.
     */
    "aria-haspopup"?: boolean | "false" | "true" | "menu" | "listbox" | "tree" | "grid" | "dialog" | undefined;

    /**
     * Indicates whether the element is exposed to an accessibility API.
     */
    "aria-hidden"?: Booleanish | undefined;

    /**
     * Indicates the entered value does not conform to the format expected by the application.
     */
    "aria-invalid"?: boolean | "false" | "true" | "grammar" | "spelling" | undefined;

    /**
     * Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element.
     */
    "aria-keyshortcuts"?: string | undefined;

    /**
     * Defines a string value that labels the current element.
     */
    "aria-label"?: string | undefined;

    /**
     * Identifies the element (or elements) that labels the current element.
     */
    "aria-labelledby"?: string | undefined;

    /**
     * Defines the hierarchical level of an element within a structure.
     */
    "aria-level"?: number | undefined;

    /**
     * Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region.
     */
    "aria-live"?: "off" | "assertive" | "polite" | undefined;

    /**
     * Indicates whether an element is modal when displayed.
     */
    "aria-modal"?: Booleanish | undefined;

    /**
     * Indicates whether a text box accepts multiple lines of input or only a single line.
     */
    "aria-multiline"?: Booleanish | undefined;

    /**
     * Indicates that the user may select more than one item from the current selectable descendants.
     */
    "aria-multiselectable"?: Booleanish | undefined;

    /**
     * Indicates whether the element’s orientation is horizontal, vertical, or unknown/ambiguous.
     */
    "aria-orientation"?: "horizontal" | "vertical" | undefined;

    /**
     * Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship between DOM elements where the DOM hierarchy cannot be used to represent the relationship.
     */
    "aria-owns"?: string | undefined;

    /**
     * Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value. A hint could be a sample value or a brief description of the expected format.
     */
    "aria-placeholder"?: string | undefined;

    /**
     * Defines an element’s number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
     */
    "aria-posinset"?: number | undefined;

    /**
     * Indicates the current "pressed" state of toggle buttons.
     */
    "aria-pressed"?: boolean | "false" | "mixed" | "true" | undefined;

    /**
     * Indicates that the element is not editable, but is otherwise operable.
     */
    "aria-readonly"?: Booleanish | undefined;

    /**
     * Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified.
     */
    "aria-relevant"?: "additions" | "additions removals" | "additions text" | "all" | "removals" | "removals additions" | "removals text" | "text" | "text additions" | "text removals" | undefined;

    /**
     * Indicates that user input is required on the element before a form may be submitted.
     */
    "aria-required"?: Booleanish | undefined;

    /**
     * Defines a human-readable, author-localized description for the role of an element.
     */
    "aria-roledescription"?: string | undefined;

    /**
     * Defines the total number of rows in a table, grid, or treegrid.
     */
    "aria-rowcount"?: number | undefined;

    /**
     * Defines an element’s row index or position with respect to the total number of rows within a table, grid, or treegrid.
     */
    "aria-rowindex"?: number | undefined;

    /**
     * Defines a human readable text alternative of aria-rowindex.
     */
    "aria-rowindextext"?: string | undefined;

    /**
     * Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid.
     */
    "aria-rowspan"?: number | undefined;

    /**
     * Indicates the current "selected" state of various widgets.
     */
    "aria-selected"?: Booleanish | undefined;

    /**
     * Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
     */
    "aria-setsize"?: number | undefined;

    /**
     * Indicates if items in a table or grid are sorted in ascending or descending order.
     */
    "aria-sort"?: "none" | "ascending" | "descending" | "other" | undefined;

    /**
     * Defines the maximum allowed value for a range widget.
     */
    "aria-valuemax"?: number | undefined;

    /**
     * Defines the minimum allowed value for a range widget.
     */
    "aria-valuemin"?: number | undefined;

    /**
     * Defines the current value for a range widget.
     */
    "aria-valuenow"?: number | undefined;

    /**
     * Defines the human readable text alternative of aria-valuenow for a range widget.
     */
    "aria-valuetext"?: string | undefined;

    /**
     * 暂无说明。
     */
    "dangerouslySetInnerHTML"?: { __html: string | TrustedHTML; } | undefined;

    /**
     * Clipboard Events
     */
    "onCopy"?: ClipboardEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onCopyCapture"?: ClipboardEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onCut"?: ClipboardEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onCutCapture"?: ClipboardEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onPaste"?: ClipboardEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onPasteCapture"?: ClipboardEventHandler<SVGSVGElement>;

    /**
     * Composition Events
     */
    "onCompositionEnd"?: CompositionEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onCompositionEndCapture"?: CompositionEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onCompositionStart"?: CompositionEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onCompositionStartCapture"?: CompositionEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onCompositionUpdate"?: CompositionEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onCompositionUpdateCapture"?: CompositionEventHandler<SVGSVGElement>;

    /**
     * Focus Events
     */
    "onFocus"?: FocusEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onFocusCapture"?: FocusEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onBlur"?: FocusEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onBlurCapture"?: FocusEventHandler<SVGSVGElement>;

    /**
     * form related Events
     */
    "onChange"?: ChangeEventHandler<SVGSVGElement, Element>;

    /**
     * 暂无说明。
     */
    "onChangeCapture"?: ChangeEventHandler<SVGSVGElement, Element>;

    /**
     * 暂无说明。
     */
    "onBeforeInput"?: InputEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onBeforeInputCapture"?: InputEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onInput"?: InputEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onInputCapture"?: InputEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onReset"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onResetCapture"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onSubmit"?: SubmitEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onSubmitCapture"?: SubmitEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onInvalid"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onInvalidCapture"?: ReactEventHandler<SVGSVGElement>;

    /**
     * Image Events
     */
    "onLoad"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onLoadCapture"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onError"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onErrorCapture"?: ReactEventHandler<SVGSVGElement>;

    /**
     * Keyboard Events
     */
    "onKeyDown"?: KeyboardEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onKeyDownCapture"?: KeyboardEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     * @deprecated
     */
    "onKeyPress"?: KeyboardEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     * @deprecated
     */
    "onKeyPressCapture"?: KeyboardEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onKeyUp"?: KeyboardEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onKeyUpCapture"?: KeyboardEventHandler<SVGSVGElement>;

    /**
     * Media Events
     */
    "onAbort"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onAbortCapture"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onCanPlay"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onCanPlayCapture"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onCanPlayThrough"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onCanPlayThroughCapture"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onDurationChange"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onDurationChangeCapture"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onEmptied"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onEmptiedCapture"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onEncrypted"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onEncryptedCapture"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onEnded"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onEndedCapture"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onLoadedData"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onLoadedDataCapture"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onLoadedMetadata"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onLoadedMetadataCapture"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onLoadStart"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onLoadStartCapture"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onPause"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onPauseCapture"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onPlay"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onPlayCapture"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onPlaying"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onPlayingCapture"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onProgress"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onProgressCapture"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onRateChange"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onRateChangeCapture"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onSeeked"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onSeekedCapture"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onSeeking"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onSeekingCapture"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onStalled"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onStalledCapture"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onSuspend"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onSuspendCapture"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onTimeUpdate"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onTimeUpdateCapture"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onVolumeChange"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onVolumeChangeCapture"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onWaiting"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onWaitingCapture"?: ReactEventHandler<SVGSVGElement>;

    /**
     * MouseEvents
     */
    "onAuxClick"?: MouseEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onAuxClickCapture"?: MouseEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onClick"?: MouseEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onClickCapture"?: MouseEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onContextMenu"?: MouseEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onContextMenuCapture"?: MouseEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onDoubleClick"?: MouseEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onDoubleClickCapture"?: MouseEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onDrag"?: DragEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onDragCapture"?: DragEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onDragEnd"?: DragEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onDragEndCapture"?: DragEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onDragEnter"?: DragEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onDragEnterCapture"?: DragEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onDragExit"?: DragEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onDragExitCapture"?: DragEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onDragLeave"?: DragEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onDragLeaveCapture"?: DragEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onDragOver"?: DragEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onDragOverCapture"?: DragEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onDragStart"?: DragEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onDragStartCapture"?: DragEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onDrop"?: DragEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onDropCapture"?: DragEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onMouseDown"?: MouseEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onMouseDownCapture"?: MouseEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onMouseEnter"?: MouseEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onMouseLeave"?: MouseEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onMouseMove"?: MouseEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onMouseMoveCapture"?: MouseEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onMouseOut"?: MouseEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onMouseOutCapture"?: MouseEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onMouseOver"?: MouseEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onMouseOverCapture"?: MouseEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onMouseUp"?: MouseEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onMouseUpCapture"?: MouseEventHandler<SVGSVGElement>;

    /**
     * Selection Events
     */
    "onSelect"?: ReactEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onSelectCapture"?: ReactEventHandler<SVGSVGElement>;

    /**
     * Touch Events
     */
    "onTouchCancel"?: TouchEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onTouchCancelCapture"?: TouchEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onTouchEnd"?: TouchEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onTouchEndCapture"?: TouchEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onTouchMove"?: TouchEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onTouchMoveCapture"?: TouchEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onTouchStart"?: TouchEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onTouchStartCapture"?: TouchEventHandler<SVGSVGElement>;

    /**
     * Pointer Events
     */
    "onPointerDown"?: PointerEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onPointerDownCapture"?: PointerEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onPointerMove"?: PointerEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onPointerMoveCapture"?: PointerEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onPointerUp"?: PointerEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onPointerUpCapture"?: PointerEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onPointerCancel"?: PointerEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onPointerCancelCapture"?: PointerEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onPointerEnter"?: PointerEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onPointerLeave"?: PointerEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onPointerOver"?: PointerEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onPointerOverCapture"?: PointerEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onPointerOut"?: PointerEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onPointerOutCapture"?: PointerEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onGotPointerCapture"?: PointerEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onGotPointerCaptureCapture"?: PointerEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onLostPointerCapture"?: PointerEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onLostPointerCaptureCapture"?: PointerEventHandler<SVGSVGElement>;

    /**
     * UI Events
     */
    "onScroll"?: UIEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onScrollCapture"?: UIEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onScrollEnd"?: UIEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onScrollEndCapture"?: UIEventHandler<SVGSVGElement>;

    /**
     * Wheel Events
     */
    "onWheel"?: WheelEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onWheelCapture"?: WheelEventHandler<SVGSVGElement>;

    /**
     * Animation Events
     */
    "onAnimationStart"?: AnimationEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onAnimationStartCapture"?: AnimationEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onAnimationEnd"?: AnimationEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onAnimationEndCapture"?: AnimationEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onAnimationIteration"?: AnimationEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onAnimationIterationCapture"?: AnimationEventHandler<SVGSVGElement>;

    /**
     * Toggle Events
     */
    "onToggle"?: ToggleEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onBeforeToggle"?: ToggleEventHandler<SVGSVGElement>;

    /**
     * Transition Events
     */
    "onTransitionCancel"?: TransitionEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onTransitionCancelCapture"?: TransitionEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onTransitionEnd"?: TransitionEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onTransitionEndCapture"?: TransitionEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onTransitionRun"?: TransitionEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onTransitionRunCapture"?: TransitionEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onTransitionStart"?: TransitionEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "onTransitionStartCapture"?: TransitionEventHandler<SVGSVGElement>;

    /**
     * 暂无说明。
     */
    "fill"?: string | undefined;

    /**
     * 暂无说明。
     */
    "origin"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "clipPath"?: string | undefined;

    /**
     * 暂无说明。
     */
    "filter"?: string | undefined;

    /**
     * 暂无说明。
     */
    "mask"?: string | undefined;

    /**
     * 暂无说明。
     */
    "path"?: string | undefined;

    /**
     * 暂无说明。
     */
    "href"?: string | undefined;

    /**
     * 暂无说明。
     */
    "media"?: string | undefined;

    /**
     * 暂无说明。
     */
    "target"?: string | undefined;

    /**
     * 暂无说明。
     */
    "type"?: string | undefined;

    /**
     * 暂无说明。
     */
    "name"?: string | undefined;

    /**
     * 暂无说明。
     */
    "height"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "max"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "min"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "width"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "direction"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "spacing"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "end"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "method"?: string | undefined;

    /**
     * 暂无说明。
     */
    "crossOrigin"?: CrossOrigin;

    /**
     * SVG Specific attributes
     */
    "accentHeight"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "accumulate"?: "none" | "sum" | undefined;

    /**
     * 暂无说明。
     */
    "additive"?: "replace" | "sum" | undefined;

    /**
     * 暂无说明。
     */
    "alignmentBaseline"?: "auto" | "baseline" | "before-edge" | "text-before-edge" | "middle" | "central" | "after-edge" | "text-after-edge" | "ideographic" | "alphabetic" | "hanging" | "mathematical" | "inherit" | undefined;

    /**
     * 暂无说明。
     */
    "allowReorder"?: "no" | "yes" | undefined;

    /**
     * 暂无说明。
     */
    "alphabetic"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "amplitude"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "arabicForm"?: "initial" | "medial" | "terminal" | "isolated" | undefined;

    /**
     * 暂无说明。
     */
    "ascent"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "attributeName"?: string | undefined;

    /**
     * 暂无说明。
     */
    "attributeType"?: string | undefined;

    /**
     * 暂无说明。
     */
    "autoReverse"?: Booleanish | undefined;

    /**
     * 暂无说明。
     */
    "azimuth"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "baseFrequency"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "baselineShift"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "baseProfile"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "bbox"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "begin"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "bias"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "by"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "calcMode"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "capHeight"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "clip"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "clipPathUnits"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "clipRule"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "colorInterpolation"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "colorInterpolationFilters"?: "auto" | "sRGB" | "linearRGB" | "inherit" | undefined;

    /**
     * 暂无说明。
     */
    "colorProfile"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "colorRendering"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "contentScriptType"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "contentStyleType"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "cursor"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "cx"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "cy"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "d"?: string | undefined;

    /**
     * 暂无说明。
     */
    "decelerate"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "descent"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "diffuseConstant"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "display"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "divisor"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "dominantBaseline"?: "auto" | "use-script" | "no-change" | "reset-size" | "ideographic" | "alphabetic" | "hanging" | "mathematical" | "central" | "middle" | "text-after-edge" | "text-before-edge" | "inherit" | undefined;

    /**
     * 暂无说明。
     */
    "dur"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "dx"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "dy"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "edgeMode"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "elevation"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "enableBackground"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "exponent"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "externalResourcesRequired"?: Booleanish | undefined;

    /**
     * 暂无说明。
     */
    "fillOpacity"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "fillRule"?: "nonzero" | "evenodd" | "inherit" | undefined;

    /**
     * 暂无说明。
     */
    "filterRes"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "filterUnits"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "floodColor"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "floodOpacity"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "focusable"?: Booleanish | "auto" | undefined;

    /**
     * 暂无说明。
     */
    "fontFamily"?: string | undefined;

    /**
     * 暂无说明。
     */
    "fontSize"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "fontSizeAdjust"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "fontStretch"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "fontStyle"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "fontVariant"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "fontWeight"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "format"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "fr"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "from"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "fx"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "fy"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "g1"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "g2"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "glyphName"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "glyphOrientationHorizontal"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "glyphOrientationVertical"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "glyphRef"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "gradientTransform"?: string | undefined;

    /**
     * 暂无说明。
     */
    "gradientUnits"?: string | undefined;

    /**
     * 暂无说明。
     */
    "hanging"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "horizAdvX"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "horizOriginX"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "ideographic"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "imageRendering"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "in2"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "in"?: string | undefined;

    /**
     * 暂无说明。
     */
    "intercept"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "k1"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "k2"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "k3"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "k4"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "k"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "kernelMatrix"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "kernelUnitLength"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "kerning"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "keyPoints"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "keySplines"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "keyTimes"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "lengthAdjust"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "letterSpacing"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "lightingColor"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "limitingConeAngle"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "local"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "markerEnd"?: string | undefined;

    /**
     * 暂无说明。
     */
    "markerHeight"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "markerMid"?: string | undefined;

    /**
     * 暂无说明。
     */
    "markerStart"?: string | undefined;

    /**
     * 暂无说明。
     */
    "markerUnits"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "markerWidth"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "maskContentUnits"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "maskUnits"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "mathematical"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "mode"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "numOctaves"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "offset"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "opacity"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "operator"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "order"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "orient"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "orientation"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "overflow"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "overlinePosition"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "overlineThickness"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "paintOrder"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "panose1"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "pathLength"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "patternContentUnits"?: string | undefined;

    /**
     * 暂无说明。
     */
    "patternTransform"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "patternUnits"?: string | undefined;

    /**
     * 暂无说明。
     */
    "pointerEvents"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "points"?: string | undefined;

    /**
     * 暂无说明。
     */
    "pointsAtX"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "pointsAtY"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "pointsAtZ"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "preserveAlpha"?: Booleanish | undefined;

    /**
     * 暂无说明。
     */
    "preserveAspectRatio"?: string | undefined;

    /**
     * 暂无说明。
     */
    "primitiveUnits"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "r"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "radius"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "refX"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "refY"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "renderingIntent"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "repeatCount"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "repeatDur"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "requiredExtensions"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "requiredFeatures"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "restart"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "result"?: string | undefined;

    /**
     * 暂无说明。
     */
    "rotate"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "rx"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "ry"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "scale"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "seed"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "shapeRendering"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "slope"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "specularConstant"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "specularExponent"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "speed"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "spreadMethod"?: string | undefined;

    /**
     * 暂无说明。
     */
    "startOffset"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "stdDeviation"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "stemh"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "stemv"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "stitchTiles"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "stopColor"?: string | undefined;

    /**
     * 暂无说明。
     */
    "stopOpacity"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "strikethroughPosition"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "strikethroughThickness"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "stroke"?: string | undefined;

    /**
     * 暂无说明。
     */
    "strokeDasharray"?: string | number | undefined;

    /**
     * 暂无说明。
     */
    "strokeDashoffset"?: string | number | undefined;

    /**
     * 暂无说明。
     */
    "strokeLinecap"?: "butt" | "round" | "square" | "inherit" | undefined;

    /**
     * 暂无说明。
     */
    "strokeLinejoin"?: "miter" | "round" | "bevel" | "inherit" | undefined;

    /**
     * 暂无说明。
     */
    "strokeMiterlimit"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "strokeOpacity"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "strokeWidth"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "surfaceScale"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "systemLanguage"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "tableValues"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "targetX"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "targetY"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "textAnchor"?: "start" | "middle" | "end" | "inherit" | undefined;

    /**
     * 暂无说明。
     */
    "textDecoration"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "textLength"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "textRendering"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "to"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "transform"?: string | undefined;

    /**
     * 暂无说明。
     */
    "u1"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "u2"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "underlinePosition"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "underlineThickness"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "unicode"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "unicodeBidi"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "unicodeRange"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "unitsPerEm"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "vAlphabetic"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "values"?: string | undefined;

    /**
     * 暂无说明。
     */
    "vectorEffect"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "version"?: string | undefined;

    /**
     * 暂无说明。
     */
    "vertAdvY"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "vertOriginX"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "vertOriginY"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "vHanging"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "vIdeographic"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "viewBox"?: string | undefined;

    /**
     * 暂无说明。
     */
    "viewTarget"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "visibility"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "vMathematical"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "widths"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "wordSpacing"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "writingMode"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "x1"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "x2"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "x"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "xChannelSelector"?: string | undefined;

    /**
     * 暂无说明。
     */
    "xHeight"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "xlinkActuate"?: string | undefined;

    /**
     * 暂无说明。
     */
    "xlinkArcrole"?: string | undefined;

    /**
     * 暂无说明。
     */
    "xlinkHref"?: string | undefined;

    /**
     * 暂无说明。
     */
    "xlinkRole"?: string | undefined;

    /**
     * 暂无说明。
     */
    "xlinkShow"?: string | undefined;

    /**
     * 暂无说明。
     */
    "xlinkTitle"?: string | undefined;

    /**
     * 暂无说明。
     */
    "xlinkType"?: string | undefined;

    /**
     * 暂无说明。
     */
    "xmlBase"?: string | undefined;

    /**
     * 暂无说明。
     */
    "xmlLang"?: string | undefined;

    /**
     * 暂无说明。
     */
    "xmlns"?: string | undefined;

    /**
     * 暂无说明。
     */
    "xmlnsXlink"?: string | undefined;

    /**
     * 暂无说明。
     */
    "xmlSpace"?: string | undefined;

    /**
     * 暂无说明。
     */
    "y1"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "y2"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "y"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "yChannelSelector"?: string | undefined;

    /**
     * 暂无说明。
     */
    "z"?: number | string | undefined;

    /**
     * 暂无说明。
     */
    "zoomAndPan"?: string | undefined;
}
