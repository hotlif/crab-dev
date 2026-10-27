import { usePdfLocale } from './locale.js';
import Button from '@crab-dev/rc-button';
import ColorPicker from '@crab-dev/rc-color-picker';
import NumberEdit from '@crab-dev/rc-number-edit';
import Select from '@crab-dev/rc-select';
import TextEdit from '@crab-dev/rc-text-edit';
import { cx } from '@crab-dev/css';
import { useId } from 'react';
import type { PdfObject, Rgba, ShapeStyle, Transform } from './protocol.js';
import { fieldsStyle, hintStyle, sectionStyle, propertiesContentStyle, propertiesScrollStyle, propertiesActionsStyle, rowStyle } from './styles.js';
import { DEFAULT_SHAPE_STYLE } from './drawing.js';
import { fromOklch, toOklch } from './color.js';
import ShapeStyleFields from './shape-style-fields.js';
import PanelHeader from './panel-header.js';
import BusyRegion from './busy-region.js';

export interface LoadedFont { id: string; label: string; family: string }
export interface ObjectDraft { text: string; fontId: string; fontSize: number; color: Rgba; transform: Transform; shapeStyle: ShapeStyle }

export function draftFor(object: PdfObject): ObjectDraft {
    return { text: object.text ?? '', fontId: '', fontSize: object.fontSize ?? 16, color: object.color ?? [0, 0, 0, 255], transform: { ...object.bounds, rotation: 0 }, shapeStyle: object.shapeStyle ?? DEFAULT_SHAPE_STYLE };
}

interface PropertiesProps {
    object: PdfObject;
    draft: ObjectDraft;
    fonts: LoadedFont[];
    disabled: boolean;
    busy: boolean;
    onDraft: (draft: ObjectDraft) => void;
    onApply: () => void;
    onRemove: () => void;
    onReplace: () => void;
    onClose: () => void;
}

export default function PropertiesPanel({ object, draft, fonts, disabled, busy, onDraft, onApply, onRemove, onReplace, onClose }: PropertiesProps) {
    const { text, actionLabel, objectReason } = usePdfLocale();
    const colorId = useId();
    const change = (value: ObjectDraft) => { if (!disabled && !busy) onDraft(value); };
    const geometry = (key: keyof Transform, value: number | null) => {
        if (value !== null) change({ ...draft, transform: { ...draft.transform, [key]: key === 'rotation' ? value * Math.PI / 180 : value } });
    };
    return <BusyRegion className={propertiesContentStyle} busy={busy}>
        <div className={cx(sectionStyle, propertiesScrollStyle)} role="region" aria-label={text('属性字段')}>
            <PanelHeader panel="properties" onClose={onClose} title={object.shape ? text('{shape}属性', { shape: actionLabel(object.shape) }) : object.kind === 'text' ? text('文字属性') : object.kind === 'image' ? text('图片属性') : text('对象信息')} />
            {object.reason ? <p className={hintStyle}>{objectReason(object)}</p> : <>
                {object.kind === 'text' && <>
                    <TextEdit label={text('文字内容')} value={draft.text} rows={3} resize="none" disabled={disabled || !fonts.length} onValueChange={value => change({ ...draft, text: value })} />
                    <Select label={text('字体')} placeholder={object.fontFamily || text('选择字体')} value={draft.fontId || undefined} options={fonts.map(font => ({ value: font.id, label: font.label }))} disabled={disabled || !fonts.length} onValueChange={value => change({ ...draft, fontId: value ?? '' })} />
                    {!fonts.length && <p className={hintStyle}>{text('接入项目配置 TTF 字体后，可新增或修改文字内容。现有对象仍可移动、缩放及调整颜色。')}</p>}
                    <NumberEdit label={text('字号（pt）')} value={draft.fontSize} min={1} max={1000} disabled={disabled} onValueChange={value => { if (value !== null) change({ ...draft, fontSize: value }); }} />
                    <div className={rowStyle}>
                        <span id={colorId} className={hintStyle}>{text('文字颜色')}</span>
                        <ColorPicker aria-labelledby={colorId} value={toOklch(draft.color)} disabled={disabled} showEyeDropper={false} onValueChange={value => change({ ...draft, color: fromOklch(value) })} />
                    </div>
                </>}
                {object.shape && <ShapeStyleFields shape={object.shape} value={draft.shapeStyle} disabled={disabled} onChange={shapeStyle => change({ ...draft, shapeStyle })} />}
                <div className={fieldsStyle}>
                    <NumberEdit label={text('X（pt）')} value={Number(draft.transform.x.toFixed(2))} controls={false} disabled={disabled} precision={2} onValueChange={value => geometry('x', value)} />
                    <NumberEdit label={text('Y（pt）')} value={Number(draft.transform.y.toFixed(2))} controls={false} disabled={disabled} precision={2} onValueChange={value => geometry('y', value)} />
                    <NumberEdit label={text('宽（pt）')} value={Number(draft.transform.width.toFixed(2))} controls={false} min={0.1} disabled={disabled} precision={2} onValueChange={value => geometry('width', value)} />
                    <NumberEdit label={text('高（pt）')} value={Number(draft.transform.height.toFixed(2))} controls={false} min={0.1} disabled={disabled} precision={2} onValueChange={value => geometry('height', value)} />
                </div>
                <NumberEdit label={text('旋转增量（°）')} value={draft.transform.rotation * 180 / Math.PI} disabled={disabled} onValueChange={value => geometry('rotation', value)} />
            </>}
        </div>
        {!object.reason && <div className={propertiesActionsStyle} role="group" aria-label={text('对象操作')}>
            <Button appearance="primary" disabled={disabled || (object.kind === 'text' && (draft.text !== object.text && !draft.fontId))} onClick={() => { if (!busy && !disabled) onApply(); }}>{text('应用修改')}</Button>
            {object.kind === 'image' && <Button disabled={disabled} onClick={() => { if (!busy && !disabled) onReplace(); }}>{text('替换图片')}</Button>}
            <Button danger disabled={disabled} onClick={() => { if (!busy && !disabled) onRemove(); }}>{text('删除对象')}</Button>
        </div>}
    </BusyRegion>;
}
