
import type { Metrics, Service, CompareTarget } from './comparisonData';
import { calculateDelta, formatMetric } from './comparisonData';

import {
    CarbonCard,
    Chevron,
    EnergyTile,
    MetricTile,
    SelectPill,
    StarIcon,
} from './ComparisonComponents';

/* ------------------------------------------------------------------ */
/* Propriedades do cartão                                              */
/* ------------------------------------------------------------------ */

interface ServiceCardProps {
    service: Service;
    rank: number;
    isFirst: boolean;
    isLast: boolean;
    isReference: boolean;
    compareWith: CompareTarget;
    hasReference: boolean;
    baseMetrics?: Metrics;
    onMove: (direction: -1 | 1) => void;
    onToggleReference: () => void;
    onCompareChange: (target: CompareTarget) => void;
}

/* ------------------------------------------------------------------ */
/* Cartão de serviço                                                   */
/* ------------------------------------------------------------------ */

export default function ServiceCard({
    service,
    rank,
    isFirst,
    isLast,
    isReference,
    compareWith,
    hasReference,
    baseMetrics,
    onMove,
    onToggleReference,
    onCompareChange,
}: ServiceCardProps) {
    const metrics: Metrics = service.metrics;

    /* Diferença em relação à base (referência ou média). */
    const delta = (key: keyof Metrics) =>
        baseMetrics ? calculateDelta(metrics[key], baseMetrics[key]) : undefined;

    return (
        <article
            className={`cmp-service ${isReference ? 'cmp-service--reference' : ''
                }`}
        >
            <h3 className="cmp-service__name">{service.name}</h3>

            <span
                className={`cmp-service__star ${isReference ? 'cmp-service__star--active' : ''
                    }`}
                title={
                    isReference
                        ? 'Serviço de referência'
                        : 'Marcar como referência'
                }
            >
                <StarIcon filled={isReference} size={38} />
            </span>

            <div className="cmp-service__actions">
                {isReference ? (
                    <button
                        type="button"
                        className="cmp-chip"
                        onClick={onToggleReference}
                    >
                        <StarIcon size={24} /> Remover referência
                    </button>
                ) : (
                    <>
                        <button
                            type="button"
                            className="cmp-chip"
                            onClick={onToggleReference}
                        >
                            <StarIcon size={24} /> Marcar como referência
                        </button>

                        <span className="cmp-service__compare-label">
                            Comparar com
                        </span>

                        <SelectPill
                            variant="green"
                            label={`Comparar ${service.name} com`}
                            value={compareWith}
                            onChange={(value) =>
                                onCompareChange(value as CompareTarget)
                            }
                            options={[
                                {
                                    value: 'reference',
                                    label: 'Referência',
                                    disabled: !hasReference,
                                },
                                {
                                    value: 'average',
                                    label: 'Média',
                                },
                            ]}
                        />
                    </>
                )}
            </div>

            <div className="cmp-rank">
                {isFirst ? (
                    <span className="cmp-rank__spacer" />
                ) : (
                    <button
                        type="button"
                        aria-label={`Subir ${service.name}`}
                        onClick={() => onMove(-1)}
                    >
                        <Chevron dir="up" />
                    </button>
                )}

                <span className="cmp-rank__number">{rank}</span>

                {isLast ? (
                    <span className="cmp-rank__spacer" />
                ) : (
                    <button
                        type="button"
                        aria-label={`Descer ${service.name}`}
                        onClick={() => onMove(1)}
                    >
                        <Chevron dir="down" />
                    </button>
                )}
            </div>

            <div className="cmp-service__body">
                <EnergyTile
                    label="Consumo energético"
                    value={formatMetric('consumo', metrics.consumo)}
                    delta={delta('consumo')}
                />

                <EnergyTile
                    label="Emissão de CO₂e"
                    value={formatMetric('emissao', metrics.emissao)}
                    delta={delta('emissao')}
                />

                <div className="cmp-tiles">
                    <MetricTile
                        label="Rede"
                        value={formatMetric('rede', metrics.rede)}
                        delta={delta('rede')}
                        unavailable={metrics.rede === undefined}
                    />

                    <MetricTile
                        label="CPU"
                        value={formatMetric('cpu', metrics.cpu)}
                        delta={delta('cpu')}
                        unavailable={metrics.cpu === undefined}
                    />

                    <MetricTile
                        label="Armazenamento"
                        value={formatMetric(
                            'armazenamento',
                            metrics.armazenamento,
                        )}
                        delta={delta('armazenamento')}
                        unavailable={metrics.armazenamento === undefined}
                    />

                    <MetricTile
                        label="Memória"
                        value={formatMetric('memoria', metrics.memoria)}
                        delta={delta('memoria')}
                        unavailable={metrics.memoria === undefined}
                    />
                </div>

                <CarbonCard intensity={metrics.intensidade} />
            </div>
        </article>
    );
}
