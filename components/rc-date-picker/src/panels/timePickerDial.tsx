import Button from '@crab-dev/rc-button';
import { useRef, type PointerEvent } from 'react';
import { timeClockStyle, timeClockButtonStyle } from './timePicker.style.js';

interface TimePickerDialProps {
    part: 'hour' | 'minute';
    hourCycle: 12 | 24;
    value: number;
    onChange: (value: number) => void;
    onComplete: () => void;
}

// SVG geometry is expressed in a fixed 256-unit coordinate system; physical sizes use component tokens.
const point = (position: number, radius: number) => ({
    x: 128 + Math.sin(position * Math.PI / 6) * radius,
    y: 128 - Math.cos(position * Math.PI / 6) * radius,
});

export default function TimePickerDial({ part, hourCycle, value, onChange, onComplete }: TimePickerDialProps) {
    // Pointer capture is mutable instance state and must survive the controlled value updates during a drag.
    const pointer = useRef<number | null>(null);
    const hour = part === 'hour';
    const inner = hour && hourCycle === 24 && (value === 0 || value > 12);
    const selected = point(hour ? value % 12 : value / 5, inner ? 68 : 104);
    const numbers = Array.from({ length: hour && hourCycle === 24 ? 24 : 12 }, (_, i) => {
        if (!hour) return i * 5;
        if (i < 12) return i === 0 ? 12 : i;
        return i === 12 ? 0 : i;
    });
    const updateFromPointer = (event: PointerEvent<SVGSVGElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const x = (event.clientX - rect.left) / rect.width * 256 - 128;
        const y = (event.clientY - rect.top) / rect.height * 256 - 128;
        const turns = (Math.atan2(x, -y) / (Math.PI * 2) + 1) % 1;
        if (!hour) { onChange(Math.round(turns * 60) % 60); return; }
        const base = Math.round(turns * 12) % 12;
        const next = hourCycle === 24
            ? Math.hypot(x, y) < 86 ? base === 0 ? 0 : base + 12 : base || 12
            : base + (value >= 12 ? 12 : 0);
        onChange(next);
    };
    return <svg className={timeClockStyle} viewBox="0 0 256 256" role="group" aria-label={hour ? '小时表盘' : '分钟表盘'}
        onPointerDown={event => {
            if (event.button !== 0 || pointer.current !== null) return;
            event.preventDefault();
            pointer.current = event.pointerId;
            event.currentTarget.setPointerCapture(event.pointerId);
            updateFromPointer(event);
        }}
        onPointerMove={event => { if (pointer.current === event.pointerId) updateFromPointer(event); }}
        onPointerUp={event => {
            if (pointer.current !== event.pointerId) return;
            updateFromPointer(event);
            pointer.current = null;
            event.currentTarget.releasePointerCapture(event.pointerId);
            onComplete();
        }}
        onPointerCancel={() => { pointer.current = null; }}
        onLostPointerCapture={() => { pointer.current = null; }}>
        <circle data-clock-face cx="128" cy="128" r="128" />
        <g data-clock-hand aria-hidden="true">
            <line x1="128" y1="128" x2={selected.x} y2={selected.y} />
            <circle cx="128" cy="128" r="4" stroke="none" />
            <circle cx={selected.x} cy={selected.y} r="24" stroke="none" />
        </g>
        {numbers.map((number, i) => {
            const at = point(i % 12, i >= 12 ? 68 : 104);
            const selectedNumber = hour && hourCycle === 12 ? value % 12 || 12 : value;
            return <foreignObject key={number} x={at.x - 24} y={at.y - 24} width="48" height="48">
                <Button type="button" appearance="text" className={timeClockButtonStyle}
                    data-clock-value={number}
                    aria-label={hour ? `${number} 时，共 ${hourCycle} 小时` : `${number} 分，共 60 分钟`}
                    aria-pressed={number === selectedNumber}
                    onClick={event => {
                        // Pointer selection is handled by the clock, including dragging. Native keyboard/AT clicks have detail 0.
                        if (event.detail !== 0) return;
                        onChange(hour && hourCycle === 12 ? number % 12 + (value >= 12 ? 12 : 0) : number);
                        onComplete();
                    }}
                    onKeyDown={event => {
                        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return;
                        event.preventDefault();
                        const total = hour ? hourCycle : 60;
                        const step = hour ? 1 : 5;
                        const next = (number % total + (event.key === 'ArrowUp' || event.key === 'ArrowRight' ? step : -step) + total) % total;
                        onChange(next + (hour && hourCycle === 12 && value >= 12 ? 12 : 0));
                        const label = hour && hourCycle === 12 ? next || 12 : next;
                        event.currentTarget.closest('svg')?.querySelector<HTMLElement>(`[data-clock-value="${label}"]`)?.focus();
                    }}>{hour ? number : String(number).padStart(2, '0')}</Button>
            </foreignObject>;
        })}
        {!hour && value % 5 !== 0 && <circle data-clock-dot aria-hidden="true" cx={selected.x} cy={selected.y} r="2" />}
    </svg>;
}
