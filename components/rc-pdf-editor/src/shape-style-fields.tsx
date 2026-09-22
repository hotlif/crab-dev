import { useId } from 'react';
import ColorPicker from '@crab-dev/rc-color-picker';
import NumberEdit from '@crab-dev/rc-number-edit';
import Select from '@crab-dev/rc-select';
import Checkbox from '@crab-dev/rc-checkbox';
import type { ShapeKind, ShapeStyle } from './protocol.js';
import { canFill } from './drawing.js';
import { fromOklch, toOklch } from './color.js';
import { hintStyle, rowStyle, sectionStyle } from './styles.js';

export default function ShapeStyleFields({ shape, value, disabled, onChange }: {
    shape: ShapeKind; value: ShapeStyle; disabled: boolean; onChange: (style: ShapeStyle) => void;
}) {
    const strokeId = useId(), fillId = useId();
    return <div className={sectionStyle}>
        <NumberEdit label="线宽（pt）" value={value.strokeWidth} min={0.25} max={100} step={0.5} precision={2} disabled={disabled}
            onChange={width => { if (width !== null) onChange({ ...value, strokeWidth: width }); }} />
        <Select label="线型" value={value.dashed ? 'dashed' : 'solid'} disabled={disabled}
            options={[{ value: 'solid', label: '实线' }, { value: 'dashed', label: '虚线' }]}
            onChange={line => onChange({ ...value, dashed: line === 'dashed' })} />
        <div className={rowStyle}><span id={strokeId} className={hintStyle}>描边颜色</span>
            <ColorPicker aria-labelledby={strokeId} value={toOklch(value.stroke)} showEyeDropper={false} disabled={disabled}
                onValueChange={color => onChange({ ...value, stroke: fromOklch(color) })} />
        </div>
        {canFill(shape) && <>
            <Checkbox checked={value.fill !== null} disabled={disabled} onChange={fill => onChange({ ...value, fill: fill ? [255, 230, 0, 64] : null })}>填充图形</Checkbox>
            {value.fill && <div className={rowStyle}><span id={fillId} className={hintStyle}>填充颜色</span>
                <ColorPicker aria-labelledby={fillId} value={toOklch(value.fill)} showEyeDropper={false} disabled={disabled}
                    onValueChange={color => onChange({ ...value, fill: fromOklch(color) })} />
            </div>}
        </>}
    </div>;
}
