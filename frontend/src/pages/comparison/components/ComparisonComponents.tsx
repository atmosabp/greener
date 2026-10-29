
import { useEffect, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';
import type { Metrics } from '../comparisonData';

/* ------------------------------------------------------------------ */
/* Saudação                                                            */
/* ------------------------------------------------------------------ */

export function greeting() {
    const hour = new Date().getHours();

    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
}

/* ------------------------------------------------------------------ */
/* Fechar menus ao clicar fora ou pressionar Escape                    */
/* ------------------------------------------------------------------ */

function useOutsideClose(
    ref: RefObject<HTMLElement | null>,
    onClose: () => void,
) {
    useEffect(() => {
        const handleMouse = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onClose();
            }
        };

        const handleKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };

        document.addEventListener('mousedown', handleMouse);
        document.addEventListener('keydown', handleKey);

        return () => {
            document.removeEventListener('mousedown', handleMouse);
            document.removeEventListener('keydown', handleKey);
        };
    }, [ref, onClose]);
}

/* ------------------------------------------------------------------ */
/* Ícones                                                              */
/* ------------------------------------------------------------------ */

const STAR_PATH =
    'M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.2 1.2-6.5L2.5 9.5l6.6-.9z';

export function StarIcon({
    filled = true,
    size = 24,
}: {
    filled?: boolean;
    size?: number;
}) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path
                d={STAR_PATH}
                fill={filled ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function Chevron({
    dir = 'down',
    size = 18,
}: {
    dir?: 'up' | 'down';
    size?: number;
}) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path
                d={dir === 'down' ? 'M6 9l6 6 6-6' : 'M6 15l6-6 6 6'}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function HelpIcon() {
    return (
        <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
            <circle
                cx="16"
                cy="16"
                r="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            />
            <path
                d="M12.3 12.6a3.8 3.8 0 117.2 1.7c-.7 1.3-2.4 1.8-3 3v.9"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <circle cx="16.4" cy="22.2" r="1.3" fill="currentColor" />
        </svg>
    );
}

/* ------------------------------------------------------------------ */
/* Seletor em formato de pílula                                        */
/* ------------------------------------------------------------------ */

interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export function SelectPill({
    value,
    onChange,
    options,
    variant,
    label,
}: {
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    variant: 'dark' | 'green';
    label: string;
}) {
    return (
        <span className={`cmp-select cmp-select--${variant}`}>
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                aria-label={label}
            >
                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                    >
                        {option.label}
                    </option>
                ))}
            </select>

            <Chevron size={20} />
        </span>
    );
}

/* ------------------------------------------------------------------ */
/* Menu suspenso                                                       */
/* ------------------------------------------------------------------ */

export function Popover({
    trigger,
    children,
    align = 'left',
}: {
    trigger: (props: { open: boolean; toggle: () => void }) => ReactNode;
    children: (close: () => void) => ReactNode;
    align?: 'left' | 'right';
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const close = () => setOpen(false);

    useOutsideClose(ref, close);

    return (
        <div className="cmp-popover" ref={ref}>
            {trigger({
                open,
                toggle: () => setOpen((current) => !current),
            })}

            {open && (
                <div className={`cmp-popover__menu cmp-popover__menu--${align}`}>
                    {children(close)}
                </div>
            )}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Medidor semicircular                                                */
/* ------------------------------------------------------------------ */

export function Gauge({
    title,
    value,
    fill,
    unit,
}: {
    title: string;
    value: string;
    fill: string;
    unit: string;
}) {
    const arc = 'M 12 80 A 68 68 0 0 1 148 80';

    return (
        <div className="cmp-gauge-card">
            <h3 className="cmp-gauge-card__title">{title}</h3>

            <svg
                className="cmp-gauge"
                viewBox="0 0 160 82"
                role="img"
                aria-label={`${title}: ${value} ${unit}`}
            >
                <path d={arc} pathLength={100} className="cmp-gauge__track" />

                <path
                    d={arc}
                    pathLength={100}
                    className="cmp-gauge__fill"
                    strokeDasharray={`${fill} 100`}
                />
            </svg>

            <div className="cmp-gauge__scale">
                <span>0</span>
                <span>1000</span>
            </div>

            <p className="cmp-gauge-card__value">
                {value} {unit}
            </p>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Cartão de intensidade de carbono                                    */
/* ------------------------------------------------------------------ */

export function CarbonCard({ metrics }: { metrics: Metrics }) {
    return (
        <div className="cmp-carbon">
            <p className="cmp-carbon__title">Intensidade de carbono</p>

            <p className="cmp-carbon__level">{metrics.nivelCarbono}</p>

            <div className="cmp-carbon__bar" aria-hidden="true">
                <span
                    className="cmp-carbon__fill"
                    style={{ width: metrics.barraCarbono }}
                />

                <span className="cmp-carbon__dot cmp-carbon__dot--mid" />
                <span className="cmp-carbon__dot cmp-carbon__dot--high" />
            </div>

            <p className="cmp-carbon__value">
                {metrics.intensidade} <small>gCO₂e/kWh</small>
            </p>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Indicadores menores                                                 */
/* ------------------------------------------------------------------ */

export function MetricTile({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="cmp-tile">
            <span className="cmp-tile__label">{label}</span>
            <span className="cmp-tile__value">{value}</span>
        </div>
    );
}

export function EnergyTile({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="cmp-energy">
            <span className="cmp-energy__label">{label}</span>
            <span className="cmp-energy__value">{value}</span>
        </div>
    );
}
