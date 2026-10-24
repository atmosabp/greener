import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';
import './Comparison.css';
import AppHeader from "../../components/header/AppHeader";

/* ------------------------------------------------------------------ */
/* Tipos                                                               */
/* ------------------------------------------------------------------ */

interface Metrics {
  consumo: number | null; // kWh
  emissao: number | null; // kg CO₂e
  rede: number | null; // GB
  cpu: number | null; // %
  armazenamento: number | null; // GB
  memoria: number | null; // GB
  intensidade: number | null; // gCO₂e/kWh
}

interface Service extends Metrics {
  id: string;
  name: string;
}

type CompareTarget = 'reference' | 'average';
type Direction = 'up' | 'down' | 'same';

/* ------------------------------------------------------------------ */
/* Dados de exemplo                                                    */
/* TODO(backend): trocar por chamada à API (dependente do período).    */
/* ------------------------------------------------------------------ */

const MOCK_SERVICES: Service[] = [
  { id: 'billing-api', name: 'Billing API', consumo: 12.48, emissao: 4.21, rede: 0.21, cpu: 41, armazenamento: 8, memoria: 1.36, intensidade: 85 },
  { id: 'reporting-batch', name: 'Reporting Batch', consumo: 17.31, emissao: 2.18, rede: 0.2058, cpu: 25.4, armazenamento: null, memoria: 1.14, intensidade: 85 },
  { id: 'auth-service', name: 'Auth Service', consumo: 6.92, emissao: 1.74, rede: 0.09, cpu: 22, armazenamento: 4, memoria: 0.8, intensidade: 140 },
  { id: 'notification-worker', name: 'Notification Worker', consumo: 9.15, emissao: 3.6, rede: 0.32, cpu: 55, armazenamento: 2, memoria: 2.1, intensidade: 230 },
];

const PERIODS = [
  { value: 'today', label: 'Hoje' },
  { value: '7d', label: 'Últimos 7 dias' },
  { value: '30d', label: 'Últimos 30 dias' },
];

const GAUGE_MAX = 1000;
const CARBON_SCALE = 200; // gCO₂e/kWh no fim da barra (marcador vermelho)

/* ------------------------------------------------------------------ */
/* Utilitários                                                         */
/* ------------------------------------------------------------------ */

const nf = (n: number, min: number, max: number) =>
  n.toLocaleString('pt-BR', { minimumFractionDigits: min, maximumFractionDigits: max });

const fmtKwh = (n: number) => `${nf(n, 2, 2)} kWh`;
const fmtCo2 = (n: number) => `${nf(n, 2, 2)}kg CO₂e`;
const fmtGb = (n: number) => `${nf(n, 0, 2)}GB`;
const fmtPct = (n: number) => `${nf(n, 0, 0)}%`;

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

function trend(value: number, base: number, threshold: number): { dir: Direction; pct: number } {
  const pct = base === 0 ? (value === 0 ? 0 : 100) : ((value - base) / base) * 100;
  const dir: Direction = pct === 0 || Math.abs(pct) <= threshold ? 'same' : pct > 0 ? 'up' : 'down';
  return { dir, pct: Math.abs(pct) };
}

function carbonLevel(v: number) {
  if (v < CARBON_SCALE / 2) return 'Baixo';
  if (v < CARBON_SCALE) return 'Médio';
  return 'Alto';
}

function useOutsideClose(ref: RefObject<HTMLElement | null>, onClose: () => void) {
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('mousedown', handle);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', handle);
      document.removeEventListener('keydown', esc);
    };
  }, [ref, onClose]);
}

/* ------------------------------------------------------------------ */
/* Ícones                                                              */
/* ------------------------------------------------------------------ */

const STAR_PATH =
  'M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.2 1.2-6.5L2.5 9.5l6.6-.9z';

function StarIcon({ filled = true, size = 24 }: { filled?: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
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

function Chevron({ dir = 'down', size = 18 }: { dir?: 'up' | 'down'; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
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

function Arrow({ dir, size = 18 }: { dir: 'up' | 'down'; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="cmp-arrow">
      <path
        d={dir === 'up' ? 'M12 20V5M6 11l6-6 6 6' : 'M12 4v15M6 13l6 6 6-6'}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="2" />
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

function AlertIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#5f8a4c" />
      <rect x="10.8" y="5.5" width="2.4" height="8" rx="1.2" fill="#fff" />
      <circle cx="12" cy="17.4" r="1.5" fill="#fff" />
    </svg>
  );
}

function Logo() {
  return (
    <svg width="62" height="36" viewBox="0 0 62 36" role="img" aria-label="Atmos">
      <path
        d="M14 33c-7 0-12-4-12-9.500 0-4.700 3.600-8.300 8.300-9C11.500 8.500 16 4.500 21.700 4.500c3.800 0 7 1.700 9 4.400C32.200 5.600 35.600 3 40 3c5.600 0 9.800 3.900 10.300 9 5.400.8 9.200 4.700 9.200 9.600C59.500 28 54.500 33 48 33z"
        fill="#6f8f5f"
      />
      <path
        d="M31 28V19m0 0c-4.500 0-6.500-2.800-6.500-6.500 4.200 0 6.500 2.200 6.500 6.500zm0 0c0-3.700 2.200-6 6-6 0 3.700-2.200 6-6 6z"
        fill="none"
        stroke="#f9eedc"
        strokeWidth="2.200"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Componentes pequenos                                                */
/* ------------------------------------------------------------------ */

function SelectPill({
  value,
  onChange,
  options,
  variant,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; disabled?: boolean }[];
  variant: 'dark' | 'green';
  label: string;
}) {
  return (
    <span className={`cmp-select cmp-select--${variant}`}>
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={label}>
        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>
            {o.label}
          </option>
        ))}
      </select>
      <Chevron size={20} />
    </span>
  );
}

function Popover({
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
      {trigger({ open, toggle: () => setOpen((o) => !o) })}
      {open && <div className={`cmp-popover__menu cmp-popover__menu--${align}`}>{children(close)}</div>}
    </div>
  );
}

function Gauge({ value, unit, title }: { value: number | null; unit: string; title: string }) {
  const pct = value === null ? 0 : Math.min(Math.max(value / GAUGE_MAX, 0), 1) * 100;
  const arc = 'M 12 80 A 68 68 0 0 1 148 80';
  return (
    <div className="cmp-gauge-card">
      <h3 className="cmp-gauge-card__title">{title}</h3>
      <svg className="cmp-gauge" viewBox="0 0 160 82" role="img" aria-label={`${title}: ${value ?? 'indisponível'} ${unit}`}>
        <path d={arc} pathLength={100} className="cmp-gauge__track" />
        <path d={arc} pathLength={100} className="cmp-gauge__fill" strokeDasharray={`${pct} 100`} />
      </svg>
      <div className="cmp-gauge__scale">
        <span>0</span>
        <span>{GAUGE_MAX}</span>
      </div>
      <p className="cmp-gauge-card__value">{value === null ? '—' : `${nf(value, 2, 2)} ${unit}`}</p>
    </div>
  );
}

function CarbonCard({ value }: { value: number | null }) {
  if (value === null) {
    return (
      <div className="cmp-carbon">
        <p className="cmp-carbon__title">Intensidade de carbono</p>
        <p className="cmp-carbon__level">—</p>
      </div>
    );
  }
  const fill = Math.min(value / CARBON_SCALE, 1) * 100;
  return (
    <div className="cmp-carbon">
      <p className="cmp-carbon__title">Intensidade de carbono</p>
      <p className="cmp-carbon__level">{carbonLevel(value)}</p>
      <div className="cmp-carbon__bar" aria-hidden="true">
        <span className="cmp-carbon__fill" style={{ width: `${fill}%` }} />
        <span className="cmp-carbon__dot cmp-carbon__dot--mid" />
        <span className="cmp-carbon__dot cmp-carbon__dot--high" />
      </div>
      <p className="cmp-carbon__value">
        {nf(value, 0, 0)} <small>gCO₂e/kWh</small>
      </p>
    </div>
  );
}

function Delta({ dir, pct }: { dir: Direction; pct: number }) {
  return (
    <span className="cmp-delta">
      {dir === 'same' ? <span className="cmp-delta__eq">=</span> : <Arrow dir={dir} />}
      {nf(pct, 0, 0)}%
    </span>
  );
}

function MetricTile({
  label,
  value,
  base,
  compare,
  threshold,
  format,
}: {
  label: string;
  value: number | null;
  base: number | null;
  compare: boolean;
  threshold: number;
  format: (n: number) => string;
}) {
  if (value === null || (compare && base === null)) {
    return (
      <div className="cmp-tile cmp-tile--unavailable">
        <span className="cmp-tile__label">Métrica indisponível</span>
        <AlertIcon />
      </div>
    );
  }
  const t = compare && base !== null ? trend(value, base, threshold) : null;
  return (
    <div className="cmp-tile">
      <span className="cmp-tile__label">{label}</span>
      <span className="cmp-tile__value">{t ? <Delta dir={t.dir} pct={t.pct} /> : format(value)}</span>
    </div>
  );
}

function EnergyTile({
  label,
  value,
  base,
  compare,
  threshold,
  format,
}: {
  label: ReactNode;
  value: number | null;
  base: number | null;
  compare: boolean;
  threshold: number;
  format: (n: number) => string;
}) {
  const t = compare && value !== null && base !== null ? trend(value, base, threshold) : null;
  return (
    <div className="cmp-energy">
      <span className="cmp-energy__label">
        {label}
        {t && t.dir !== 'same' && <Arrow dir={t.dir} size={20} />}
      </span>
      <span className="cmp-energy__value">{value === null ? '—' : format(value)}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Card de serviço                                                     */
/* ------------------------------------------------------------------ */

interface ServiceCardProps {
  service: Service;
  rank: number;
  isFirst: boolean;
  isLast: boolean;
  isReference: boolean;
  baseline: Metrics | null;
  compareWith: CompareTarget;
  hasReference: boolean;
  threshold: number;
  onMove: (dir: -1 | 1) => void;
  onToggleReference: () => void;
  onCompareChange: (t: CompareTarget) => void;
}

function ServiceCard({
  service: s,
  rank,
  isFirst,
  isLast,
  isReference,
  baseline,
  compareWith,
  hasReference,
  threshold,
  onMove,
  onToggleReference,
  onCompareChange,
}: ServiceCardProps) {
  const compare = !isReference && baseline !== null;
  const b = baseline;

  return (
    <article className={`cmp-service ${isReference ? 'cmp-service--reference' : ''}`}>
      <h3 className="cmp-service__name">{s.name}</h3>

      {isReference && (
        <span className="cmp-service__star" title="Serviço de referência">
          <StarIcon filled={false} size={38} />
        </span>
      )}

      <div className="cmp-service__actions">
        {isReference ? (
          <button type="button" className="cmp-chip" onClick={onToggleReference}>
            <StarIcon size={24} /> Remover referência
          </button>
        ) : (
          <>
            <button type="button" className="cmp-chip" onClick={onToggleReference}>
              <StarIcon size={24} /> Marcar como referência
            </button>
            <span className="cmp-service__compare-label">Comparar com</span>
            <SelectPill
              variant="green"
              label={`Comparar ${s.name} com`}
              value={compareWith}
              onChange={(v) => onCompareChange(v as CompareTarget)}
              options={[
                { value: 'reference', label: 'Referência', disabled: !hasReference },
                { value: 'average', label: 'Média' },
              ]}
            />
          </>
        )}
      </div>

      <div className="cmp-rank">
        {isFirst ? (
          <span className="cmp-rank__spacer" />
        ) : (
          <button type="button" aria-label={`Subir ${s.name}`} onClick={() => onMove(-1)}>
            <Chevron dir="up" />
          </button>
        )}
        <span className="cmp-rank__number">{rank}</span>
        {isLast ? (
          <span className="cmp-rank__spacer" />
        ) : (
          <button type="button" aria-label={`Descer ${s.name}`} onClick={() => onMove(1)}>
            <Chevron dir="down" />
          </button>
        )}
      </div>

      <div className="cmp-service__body">
        <EnergyTile
          label="Consumo energético"
          value={s.consumo}
          base={b?.consumo ?? null}
          compare={compare}
          threshold={threshold}
          format={fmtKwh}
        />
        <EnergyTile
          label="Emissão de CO₂e"
          value={s.emissao}
          base={b?.emissao ?? null}
          compare={compare}
          threshold={threshold}
          format={fmtCo2}
        />

        <div className="cmp-tiles">
          <MetricTile label="Rede" value={s.rede} base={b?.rede ?? null} compare={compare} threshold={threshold} format={fmtGb} />
          <MetricTile label="CPU" value={s.cpu} base={b?.cpu ?? null} compare={compare} threshold={threshold} format={fmtPct} />
          <MetricTile label="Armazenamento" value={s.armazenamento} base={b?.armazenamento ?? null} compare={compare} threshold={threshold} format={fmtGb} />
          <MetricTile label="Memória" value={s.memoria} base={b?.memoria ?? null} compare={compare} threshold={threshold} format={fmtGb} />
        </div>

        <CarbonCard value={s.intensidade} />
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

interface ComparisonProps {
  userName?: string;
  onLogout?: () => void;
}

export default function Comparison({ userName = 'Júlia', onLogout }: ComparisonProps) {
  const [services] = useState<Service[]>(MOCK_SERVICES); // TODO(backend)
  const [period, setPeriod] = useState('today'); // TODO(backend): refazer a busca ao mudar
  const [order, setOrder] = useState<string[]>(() => MOCK_SERVICES.map((s) => s.id));
  const [selected, setSelected] = useState<Set<string>>(() => new Set(MOCK_SERVICES.map((s) => s.id)));
  const [referenceId, setReferenceId] = useState<string | null>('billing-api');
  const [compareMap, setCompareMap] = useState<Record<string, CompareTarget>>({});
  const [thresholdText, setThresholdText] = useState('0.0');

  const threshold = Math.max(parseFloat(thresholdText.replace(',', '.')) || 0, 0);

  const visible = useMemo(() => {
    const byId = new Map(services.map((s) => [s.id, s]));
    return order.map((id) => byId.get(id)).filter((s): s is Service => !!s && selected.has(s.id));
  }, [services, order, selected]);

  const reference = visible.find((s) => s.id === referenceId) ?? null;

  const averages = useMemo<Metrics>(() => {
    const avg = (key: keyof Metrics) => {
      const vals = visible.map((s) => s[key]).filter((v): v is number => v !== null);
      return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
    };
    return {
      consumo: avg('consumo'),
      emissao: avg('emissao'),
      rede: avg('rede'),
      cpu: avg('cpu'),
      armazenamento: avg('armazenamento'),
      memoria: avg('memoria'),
      intensidade: avg('intensidade'),
    };
  }, [visible]);

  const move = (id: string, dir: -1 | 1) => {
    const idx = visible.findIndex((s) => s.id === id);
    const neighbor = visible[idx + dir];
    if (!neighbor) return;
    setOrder((prev) => {
      const next = [...prev];
      const a = next.indexOf(id);
      const b = next.indexOf(neighbor.id);
      [next[a], next[b]] = [next[b], next[a]];
      return next;
    });
  };

  const toggleSelected = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleReference = (id: string) => setReferenceId((cur) => (cur === id ? null : id));

  const baselineFor = (id: string): { baseline: Metrics | null; target: CompareTarget } => {
    const target = compareMap[id] ?? 'reference';
    if (target === 'average') return { baseline: averages, target };
    return { baseline: reference && reference.id !== id ? reference : null, target };
  };

  return (
    <div className="cmp-comparison">
      <AppHeader />

      <main className="cmp-page">
        <section className="cmp-intro">
          <div>
            <h1>
              {greeting()}, {userName}.
            </h1>
            <p className="cmp-intro__sub">Comparação de serviços</p>
          </div>
          <SelectPill variant="dark" label="Período" value={period} onChange={setPeriod} options={PERIODS} />
        </section>

        <Popover
          trigger={({ open, toggle }) => (
            <button type="button" className="cmp-pill-outline" aria-expanded={open} onClick={toggle}>
              Serviços selecionados <Chevron size={22} />
            </button>
          )}
        >
          {() => (
            <ul className="cmp-menu">
              {services.map((s) => (
                <li key={s.id}>
                  <label>
                    <input type="checkbox" checked={selected.has(s.id)} onChange={() => toggleSelected(s.id)} />
                    {s.name}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </Popover>

        <section className="cmp-averages" aria-labelledby="avg-title">
          <h2 id="avg-title" className="cmp-averages__title">Média indicadores</h2>
          <button type="button" className="cmp-averages__help" aria-label="Ajuda sobre os indicadores" title="Médias calculadas sobre os serviços selecionados">
            <HelpIcon />
          </button>

          <div className="cmp-averages__content">
            <div className="cmp-averages__tiles">
              <div className="cmp-avg-tile"><span>Rede</span><strong>{averages.rede === null ? '—' : fmtGb(averages.rede)}</strong></div>
              <div className="cmp-avg-tile"><span>CPU</span><strong>{averages.cpu === null ? '—' : fmtPct(averages.cpu)}</strong></div>
              <div className="cmp-avg-tile"><span>Armazenamento</span><strong>{averages.armazenamento === null ? '—' : fmtGb(averages.armazenamento)}</strong></div>
              <div className="cmp-avg-tile"><span>Memória</span><strong>{averages.memoria === null ? '—' : fmtGb(averages.memoria)}</strong></div>
            </div>
            <Gauge title="Consumo energético" value={averages.consumo} unit="kWh" />
            <Gauge title="Emissão de CO₂e" value={averages.emissao} unit="kg CO₂e" />
          </div>
        </section>

        <section className="cmp-services" aria-labelledby="services-title">
          <div className="cmp-services__head">
            <h2 id="services-title">Serviços</h2>
            <div className="cmp-services__tools">
              <Popover
                align="right"
                trigger={({ open, toggle }) => (
                  <button type="button" className="cmp-chip cmp-chip--wide" aria-expanded={open} onClick={toggle}>
                    Escolher serviço referência <StarIcon size={24} />
                  </button>
                )}
              >
                {(close) => (
                  <ul className="cmp-menu">
                    {visible.map((s) => (
                      <li key={s.id}>
                        <button
                          type="button"
                          className={s.id === referenceId ? 'cmp-is-active' : ''}
                          onClick={() => {
                            setReferenceId(s.id);
                            close();
                          }}
                        >
                          {s.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </Popover>

              <label className="cmp-threshold" title="Variações até este percentual são tratadas como iguais">
                <input
                  type="text"
                  inputMode="decimal"
                  value={thresholdText}
                  onChange={(e) => setThresholdText(e.target.value.replace(/[^0-9.,]/g, ''))}
                  aria-label="Tolerância de variação em %"
                />
                <span>%</span>
              </label>
            </div>
          </div>

          <div className="cmp-services__scroll">
            {visible.length === 0 && (
              <p className="cmp-empty">Nenhum serviço selecionado. Escolha ao menos um em “Serviços selecionados”.</p>
            )}
            {visible.map((s, i) => {
              const { baseline, target } = baselineFor(s.id);
              return (
                <ServiceCard
                  key={s.id}
                  service={s}
                  rank={i + 1}
                  isFirst={i === 0}
                  isLast={i === visible.length - 1}
                  isReference={s.id === reference?.id}
                  baseline={baseline}
                  compareWith={target}
                  hasReference={!!reference && reference.id !== s.id}
                  threshold={threshold}
                  onMove={(dir) => move(s.id, dir)}
                  onToggleReference={() => toggleReference(s.id)}
                  onCompareChange={(t) => setCompareMap((m) => ({ ...m, [s.id]: t }))}
                />
              );
            })}
          </div>
        </section>
      </main>

      <footer className="cmp-footer">Desenvolvido por Atmos © 2026</footer>
    </div>
  );
}