import type { CompareTarget } from "./comparisonData";
import { calculateDelta, formatMetric } from "./comparisonData";
import { ExternalLink } from "lucide-react";

import {
  CarbonCard,
  Chevron,
  EnergyTile,
  MetricTile,
  SelectPill,
  StarIcon,
} from "./ComparisonComponents";

import type { MetricsType, ServiceType } from "../../../types/service";
import { Link } from "react-router-dom";

/* ------------------------------------------------------------------ */
/* Propriedades do cartão                                              */
/* ------------------------------------------------------------------ */

interface ServiceCardProps {
  service: ServiceType;
  rank: number;
  isFirst: boolean;
  isLast: boolean;
  isReference: boolean;
  compareWith: CompareTarget;
  hasReference: boolean;
  baseMetrics?: MetricsType;
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
  const metrics: MetricsType | undefined = service.metrics;

  /* Diferença em relação à base (referência ou média). */
  const delta = (key: keyof MetricsType) =>
    baseMetrics && metrics
      ? calculateDelta(metrics[key], baseMetrics[key])
      : undefined;

  return (
    <article
      className={`cmp-service ${isReference ? "cmp-service--reference" : ""}`}
    >
      <h3 className="cmp-service__name">
        {service.status == "active" ? (
          <Link className="cmp-service-link" to={`/dashboard/${service.id}`}>
            {service.name}
            <ExternalLink className="redirect-link-icon" />
          </Link>
        ) : (
          <>{service.name}</>
        )}
      </h3>

      {isReference ? (
        <span
          className={`cmp-service__star ${
            isReference ? "cmp-service__star--active" : ""
          }`}
          title={
            isReference ? "Serviço de referência" : "Marcar como referência"
          }
        >
          <StarIcon filled={isReference} size={38} />
        </span>
      ) : (
        <></>
      )}

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

            <span className="cmp-service__compare-label">Comparar com</span>

            <SelectPill
              variant="green"
              label={`Comparar ${service.name} com`}
              value={compareWith}
              onChange={(value) => onCompareChange(value as CompareTarget)}
              options={[
                {
                  value: "reference",
                  label: "Referência",
                  disabled: !hasReference,
                },
                {
                  value: "average",
                  label: "Média",
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
          value={formatMetric("kwh", metrics ? metrics.kwh : undefined)}
          delta={delta("kwh")}
        />

        <EnergyTile
          label="Emissão de CO₂e"
          value={formatMetric("co2e", metrics ? metrics.co2e : undefined)}
          delta={delta("co2e")}
        />

        <div className="cmp-tiles">
          <MetricTile
            label="Rede"
            value={formatMetric(
              "network_gb",
              metrics ? metrics.network_gb : undefined,
            )}
            delta={delta("network_gb")}
            unavailable={metrics && metrics.network_gb === undefined}
          />

          <MetricTile
            label="CPU"
            value={formatMetric(
              "cpu_percent",
              metrics ? metrics.cpu_percent : undefined,
            )}
            delta={delta("cpu_percent")}
            unavailable={metrics && metrics.cpu_percent === undefined}
          />

          <MetricTile
            label="Armazenamento"
            value={formatMetric(
              "disk_gb",
              metrics ? metrics.disk_gb : undefined,
            )}
            delta={delta("disk_gb")}
            unavailable={metrics && metrics.disk_gb === undefined}
          />

          <MetricTile
            label="Memória"
            value={formatMetric(
              "memory_gb",
              metrics ? metrics.memory_gb : undefined,
            )}
            delta={delta("memory_gb")}
            unavailable={metrics && metrics.memory_gb === undefined}
          />
        </div>

        <CarbonCard
          intensity={metrics ? metrics.carbon_intensity : undefined}
        />
      </div>
    </article>
  );
}
