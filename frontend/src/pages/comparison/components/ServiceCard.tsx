
import type { Metrics, Service, CompareTarget } from '../comparisonData';

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
    onMove,
    onToggleReference,
    onCompareChange,
}: ServiceCardProps) {
    const metrics: Metrics = service.metrics;

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
                    value={metrics.consumo}
                />

                <EnergyTile
                    label="Emissão de CO₂e"
                    value={metrics.emissao}
                />

                <div className="cmp-tiles">
                    <MetricTile label="Rede" value={metrics.rede} />
                    <MetricTile label="CPU" value={metrics.cpu} />

                    <MetricTile
                        label="Armazenamento"
                        value={metrics.armazenamento}
                    />

                    <MetricTile label="Memória" value={metrics.memoria} />
                </div>

                <CarbonCard metrics={metrics} />
            </div>
        </article>
    );
}
