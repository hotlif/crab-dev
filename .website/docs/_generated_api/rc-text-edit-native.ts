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
type CSSProperties = DocsTypePlaceholder;
type DragEventHandler<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type FocusEventHandler<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type HTMLTextAreaElement = DocsTypePlaceholder;
type InputEventHandler<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type KeyboardEventHandler<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type MouseEventHandler<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type PointerEventHandler<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type ReactEventHandler<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type ReactNode = DocsTypePlaceholder;
type SubmitEventHandler<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type ToggleEventHandler<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type TouchEventHandler<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type TransitionEventHandler<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type TrustedHTML = DocsTypePlaceholder;
type UIEventHandler<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };
type WheelEventHandler<T0 = unknown> = DocsTypePlaceholder & { readonly __docsTypeArguments__?: readonly [T0] };

export interface TextEditPropsNativeAttributes {
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
    "children"?: ReactNode | undefined;

    /**
     * 暂无说明。
     */
    "dangerouslySetInnerHTML"?: { __html: string | TrustedHTML; } | undefined;

    /**
     * Clipboard Events
     */
    "onCopy"?: ClipboardEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onCopyCapture"?: ClipboardEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onCut"?: ClipboardEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onCutCapture"?: ClipboardEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onPaste"?: ClipboardEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onPasteCapture"?: ClipboardEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * Composition Events
     */
    "onCompositionEnd"?: CompositionEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onCompositionEndCapture"?: CompositionEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onCompositionStart"?: CompositionEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onCompositionStartCapture"?: CompositionEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onCompositionUpdate"?: CompositionEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onCompositionUpdateCapture"?: CompositionEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * Focus Events
     */
    "onFocus"?: FocusEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onFocusCapture"?: FocusEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onBlur"?: FocusEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onBlurCapture"?: FocusEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onChangeCapture"?: ChangeEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onBeforeInput"?: InputEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onBeforeInputCapture"?: InputEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onInput"?: InputEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onInputCapture"?: InputEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onReset"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onResetCapture"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onSubmit"?: SubmitEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onSubmitCapture"?: SubmitEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onInvalid"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onInvalidCapture"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * Image Events
     */
    "onLoad"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onLoadCapture"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onError"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onErrorCapture"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * Keyboard Events
     */
    "onKeyDown"?: KeyboardEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onKeyDownCapture"?: KeyboardEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     * @deprecated
     */
    "onKeyPress"?: KeyboardEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     * @deprecated
     */
    "onKeyPressCapture"?: KeyboardEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onKeyUp"?: KeyboardEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onKeyUpCapture"?: KeyboardEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * Media Events
     */
    "onAbort"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onAbortCapture"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onCanPlay"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onCanPlayCapture"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onCanPlayThrough"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onCanPlayThroughCapture"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onDurationChange"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onDurationChangeCapture"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onEmptied"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onEmptiedCapture"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onEncrypted"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onEncryptedCapture"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onEnded"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onEndedCapture"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onLoadedData"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onLoadedDataCapture"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onLoadedMetadata"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onLoadedMetadataCapture"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onLoadStart"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onLoadStartCapture"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onPause"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onPauseCapture"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onPlay"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onPlayCapture"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onPlaying"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onPlayingCapture"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onProgress"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onProgressCapture"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onRateChange"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onRateChangeCapture"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onSeeked"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onSeekedCapture"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onSeeking"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onSeekingCapture"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onStalled"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onStalledCapture"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onSuspend"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onSuspendCapture"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onTimeUpdate"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onTimeUpdateCapture"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onVolumeChange"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onVolumeChangeCapture"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onWaiting"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onWaitingCapture"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * MouseEvents
     */
    "onAuxClick"?: MouseEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onAuxClickCapture"?: MouseEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onClick"?: MouseEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onClickCapture"?: MouseEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onContextMenu"?: MouseEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onContextMenuCapture"?: MouseEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onDoubleClick"?: MouseEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onDoubleClickCapture"?: MouseEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onDrag"?: DragEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onDragCapture"?: DragEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onDragEnd"?: DragEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onDragEndCapture"?: DragEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onDragEnter"?: DragEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onDragEnterCapture"?: DragEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onDragExit"?: DragEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onDragExitCapture"?: DragEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onDragLeave"?: DragEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onDragLeaveCapture"?: DragEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onDragOver"?: DragEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onDragOverCapture"?: DragEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onDragStart"?: DragEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onDragStartCapture"?: DragEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onDrop"?: DragEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onDropCapture"?: DragEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onMouseDown"?: MouseEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onMouseDownCapture"?: MouseEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onMouseEnter"?: MouseEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onMouseLeave"?: MouseEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onMouseMove"?: MouseEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onMouseMoveCapture"?: MouseEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onMouseOut"?: MouseEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onMouseOutCapture"?: MouseEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onMouseOver"?: MouseEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onMouseOverCapture"?: MouseEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onMouseUp"?: MouseEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onMouseUpCapture"?: MouseEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * Selection Events
     */
    "onSelect"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onSelectCapture"?: ReactEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * Touch Events
     */
    "onTouchCancel"?: TouchEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onTouchCancelCapture"?: TouchEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onTouchEnd"?: TouchEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onTouchEndCapture"?: TouchEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onTouchMove"?: TouchEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onTouchMoveCapture"?: TouchEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onTouchStart"?: TouchEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onTouchStartCapture"?: TouchEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * Pointer Events
     */
    "onPointerDown"?: PointerEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onPointerDownCapture"?: PointerEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onPointerMove"?: PointerEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onPointerMoveCapture"?: PointerEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onPointerUp"?: PointerEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onPointerUpCapture"?: PointerEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onPointerCancel"?: PointerEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onPointerCancelCapture"?: PointerEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onPointerEnter"?: PointerEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onPointerLeave"?: PointerEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onPointerOver"?: PointerEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onPointerOverCapture"?: PointerEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onPointerOut"?: PointerEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onPointerOutCapture"?: PointerEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onGotPointerCapture"?: PointerEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onGotPointerCaptureCapture"?: PointerEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onLostPointerCapture"?: PointerEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onLostPointerCaptureCapture"?: PointerEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * UI Events
     */
    "onScroll"?: UIEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onScrollCapture"?: UIEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onScrollEnd"?: UIEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onScrollEndCapture"?: UIEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * Wheel Events
     */
    "onWheel"?: WheelEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onWheelCapture"?: WheelEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * Animation Events
     */
    "onAnimationStart"?: AnimationEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onAnimationStartCapture"?: AnimationEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onAnimationEnd"?: AnimationEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onAnimationEndCapture"?: AnimationEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onAnimationIteration"?: AnimationEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onAnimationIterationCapture"?: AnimationEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * Toggle Events
     */
    "onToggle"?: ToggleEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onBeforeToggle"?: ToggleEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * Transition Events
     */
    "onTransitionCancel"?: TransitionEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onTransitionCancelCapture"?: TransitionEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onTransitionEnd"?: TransitionEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onTransitionEndCapture"?: TransitionEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onTransitionRun"?: TransitionEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onTransitionRunCapture"?: TransitionEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onTransitionStart"?: TransitionEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * 暂无说明。
     */
    "onTransitionStartCapture"?: TransitionEventHandler<HTMLTextAreaElement> | undefined;

    /**
     * React-specific Attributes
     */
    "defaultChecked"?: boolean | undefined;

    /**
     * 暂无说明。
     */
    "suppressContentEditableWarning"?: boolean | undefined;

    /**
     * 暂无说明。
     */
    "suppressHydrationWarning"?: boolean | undefined;

    /**
     * Standard HTML Attributes
     */
    "accessKey"?: string | undefined;

    /**
     * 暂无说明。
     */
    "autoCapitalize"?: "off" | "none" | "on" | "sentences" | "words" | "characters" | undefined | (string & {});

    /**
     * 暂无说明。
     */
    "autoFocus"?: boolean | undefined;

    /**
     * 暂无说明。
     */
    "className"?: string | undefined;

    /**
     * 暂无说明。
     */
    "contentEditable"?: Booleanish | "inherit" | "plaintext-only" | undefined;

    /**
     * 暂无说明。
     */
    "contextMenu"?: string | undefined;

    /**
     * 暂无说明。
     */
    "dir"?: string | undefined;

    /**
     * 暂无说明。
     */
    "draggable"?: Booleanish | undefined;

    /**
     * 暂无说明。
     */
    "enterKeyHint"?: "enter" | "done" | "go" | "next" | "previous" | "search" | "send" | undefined;

    /**
     * 暂无说明。
     */
    "hidden"?: boolean | undefined;

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
    "spellCheck"?: Booleanish | undefined;

    /**
     * 暂无说明。
     */
    "style"?: CSSProperties | undefined;

    /**
     * 暂无说明。
     */
    "tabIndex"?: number | undefined;

    /**
     * 暂无说明。
     */
    "title"?: string | undefined;

    /**
     * 暂无说明。
     */
    "translate"?: "yes" | "no" | undefined;

    /**
     * Unknown
     */
    "radioGroup"?: string | undefined;

    /**
     * WAI-ARIA
     */
    "role"?: AriaRole | undefined;

    /**
     * RDFa Attributes
     */
    "about"?: string | undefined;

    /**
     * 暂无说明。
     */
    "content"?: string | undefined;

    /**
     * 暂无说明。
     */
    "datatype"?: string | undefined;

    /**
     * 暂无说明。
     */
    "inlist"?: any;

    /**
     * 暂无说明。
     */
    "prefix"?: string | undefined;

    /**
     * 暂无说明。
     */
    "property"?: string | undefined;

    /**
     * 暂无说明。
     */
    "rel"?: string | undefined;

    /**
     * 暂无说明。
     */
    "resource"?: string | undefined;

    /**
     * 暂无说明。
     */
    "rev"?: string | undefined;

    /**
     * 暂无说明。
     */
    "typeof"?: string | undefined;

    /**
     * 暂无说明。
     */
    "vocab"?: string | undefined;

    /**
     * Non-standard Attributes
     */
    "autoCorrect"?: string | undefined;

    /**
     * 暂无说明。
     */
    "autoSave"?: string | undefined;

    /**
     * 暂无说明。
     */
    "color"?: string | undefined;

    /**
     * 暂无说明。
     */
    "itemProp"?: string | undefined;

    /**
     * 暂无说明。
     */
    "itemScope"?: boolean | undefined;

    /**
     * 暂无说明。
     */
    "itemType"?: string | undefined;

    /**
     * 暂无说明。
     */
    "itemID"?: string | undefined;

    /**
     * 暂无说明。
     */
    "itemRef"?: string | undefined;

    /**
     * 暂无说明。
     */
    "results"?: number | undefined;

    /**
     * 暂无说明。
     */
    "security"?: string | undefined;

    /**
     * 暂无说明。
     */
    "unselectable"?: "on" | "off" | undefined;

    /**
     * Popover API
     */
    "popover"?: "" | "auto" | "manual" | "hint" | undefined;

    /**
     * 暂无说明。
     */
    "popoverTargetAction"?: "toggle" | "show" | "hide" | undefined;

    /**
     * 暂无说明。
     */
    "popoverTarget"?: string | undefined;

    /**
     * 暂无说明。
     */
    "inert"?: boolean | undefined;

    /**
     * Hints at the type of data that might be entered by the user while editing the element or its contents
     */
    "inputMode"?: "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search" | undefined;

    /**
     * Specify that a standard HTML element should behave like a defined custom built-in element
     */
    "is"?: string | undefined;

    /**
     * 暂无说明。
     */
    "exportparts"?: string | undefined;

    /**
     * 暂无说明。
     */
    "part"?: string | undefined;

    /**
     * 暂无说明。
     */
    "autoComplete"?: string | undefined;

    /**
     * 暂无说明。
     */
    "cols"?: number | undefined;

    /**
     * 暂无说明。
     */
    "dirName"?: string | undefined;

    /**
     * 暂无说明。
     */
    "disabled"?: boolean | undefined;

    /**
     * 暂无说明。
     */
    "form"?: string | undefined;

    /**
     * 暂无说明。
     */
    "maxLength"?: number | undefined;

    /**
     * 暂无说明。
     */
    "minLength"?: number | undefined;

    /**
     * 暂无说明。
     */
    "name"?: string | undefined;

    /**
     * 暂无说明。
     */
    "placeholder"?: string | undefined;

    /**
     * 暂无说明。
     */
    "readOnly"?: boolean | undefined;

    /**
     * 暂无说明。
     */
    "required"?: boolean | undefined;

    /**
     * 暂无说明。
     */
    "rows"?: number | undefined;

    /**
     * 暂无说明。
     */
    "wrap"?: string | undefined;

    /**
     * No other element dispatching change events can be nested in a <textarea> so we know the target will be a HTMLTextAreaElement.
     */
    "onChange"?: ChangeEventHandler<HTMLTextAreaElement, HTMLTextAreaElement> | undefined;
}
