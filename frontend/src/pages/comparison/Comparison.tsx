import { useEffect, useState } from "react";
import AppHeader from "../../components/header/AppHeader";

import {
  calculateAverages,
  calculateMax,
  fetchServices,
  formatMetric,
  formatNumber,
  PERIODS,
} from "./components/comparisonData";

import type { CompareTarget } from "./components/comparisonData";

import {
  Chevron,
  Gauge,
  greeting,
  HelpIcon,
  Popover,
  SelectPill,
  StarIcon,
} from "./components/ComparisonComponents";

import ServiceCard from "./components/ServiceCard";

import "./Comparison.css";

import {
  CmpAveragesSkeleton,
  ComparisonServicesSkeleton,
} from "./ComparisonSkeleton";

import "./Comparison.css";

import type { MetricsType, ServiceType } from "../../types/service";
import Loading from "../../components/loading/Loading";

export default function Comparison() {
  const [period, setPeriod] = useState("today");

  const [userName, _setUserName] = useState<string>(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return "usuário";
    try {
      const parsedUser = JSON.parse(storedUser);
      return parsedUser.name || "usuário";
    } catch (e) {
      return "usuário";
    }
  });

  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [order, setOrder] = useState<string[]>([]);

  const [selected, setSelected] = useState<Set<string>>(() => new Set());

  const [referenceId, setReferenceId] = useState<string | null>(null);

  const [compareMap, setCompareMap] = useState<Record<string, CompareTarget>>(
    {},
  );

  /* Buscar os serviços e suas métricas no backend. */
  useEffect(() => {
    let ignore = false;

    fetchServices()
      .then((data) => {
        if (ignore) return;

        setServices(data);
        setOrder(data.map((service) => service.id));
        setSelected(new Set(data.map((service) => service.id)));
        setReferenceId(data[0]?.id ?? null);
        setError(null);
      })
      .catch((error: unknown) => {
        if (ignore) return;

        setError(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os serviços. Tente novamente mais tarde.",
        );
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  /* Serviços selecionados na ordem atual. */
  const visible = order
    .filter((id) => selected.has(id))
    .map((id) => services.find((service) => service.id === id))
    .filter((service): service is ServiceType => service !== undefined);

  /* Médias dos serviços selecionados e escala dos medidores. */
  const averages = calculateAverages(visible);
  const maxConsumo = calculateMax(visible, "kwh");
  const maxEmissao = calculateMax(visible, "co2e");

  const gaugeFill = (value?: number, max?: number) =>
    value === undefined || !max ? "0" : String((value / max) * 100);

  const referenceService = services.find(
    (service) => service.id === referenceId,
  );

  /* Base de comparação de cada cartão: referência ou média. */
  const baseMetricsFor = (service: ServiceType): MetricsType | undefined => {
    if (service.id === referenceId) return undefined;

    const target = compareMap[service.id] ?? "reference";

    if (target === "reference" && referenceService) {
      return referenceService.metrics;
    }

    return averages;
  };

  /* Selecionar ou desmarcar serviços. */
  const MIN_SERVICES = 2;

  const toggleSelected = (id: string) => {
    setSelected((previous) => {
      const next = new Set(previous);

      if (next.has(id)) {
        // não deixa ficar com menos de MIN_SERVICES
        if (previous.size <= MIN_SERVICES) return previous;

        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  /* Marcar ou remover a referência de um cartão. */
  const toggleReference = (id: string) => {
    setReferenceId((current) => (current === id ? null : id));
  };

  /* Mover um cartão para cima ou para baixo. */
  const move = (id: string, direction: -1 | 1) => {
    const visibleIndex = visible.findIndex((service) => service.id === id);

    const neighbor = visible[visibleIndex + direction];

    if (!neighbor) return;

    setOrder((previous) => {
      const next = [...previous];
      const currentIndex = next.indexOf(id);
      const neighborIndex = next.indexOf(neighbor.id);

      [next[currentIndex], next[neighborIndex]] = [
        next[neighborIndex],
        next[currentIndex],
      ];

      return next;
    });
  };

  return (
    <div className="cmp-comparison">
      {loading && <Loading/>}
      <AppHeader />

      <main className="cmp-page">
        <section className="cmp-intro">
          <div>
            <h1>
              {greeting()}, {userName}.
            </h1>

            <p className="cmp-intro__sub">Comparação de serviços</p>
            <p className="cmp-intro__sub">
              Selecione dois ou mais serviços para comparar suas métricas.
            </p>

            <Popover
              trigger={({ open, toggle }) => (
                <button
                  type="button"
                  className={`cmp-pill-outline ${loading ? "blocked" : ""}`}
                  aria-expanded={open}
                  disabled={loading}
                  onClick={toggle}
                >
                  Serviços selecionados
                  <Chevron size={22} />
                </button>
              )}
            >
              {() => (
                <ul className="cmp-menu">
                  {services.map((service) => (
                    <li key={service.id}>
                      <label>
                        <input
                          type="checkbox"
                          checked={selected.has(service.id)}
                          onChange={() => toggleSelected(service.id)}
                        />
                        {service.name}
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </Popover>
          </div>

          <SelectPill
            variant="dark"
            label="Período"
            value={period}
            onChange={setPeriod}
            options={PERIODS}
            disabled={loading}
          />
        </section>

        {/* ---------------------------------------------------------- */}
        {/* Médias dos indicadores                                     */}
        {/* ---------------------------------------------------------- */}

        {loading ? (
          <CmpAveragesSkeleton />
        ) : (
          <section className="cmp-averages" aria-labelledby="avg-title">
            <h2 id="avg-title" className="cmp-averages__title">
              Média indicadores
            </h2>

            <button
              type="button"
              className="cmp-averages__help"
              aria-label="Ajuda sobre os indicadores"
              title="Média dos serviços selecionados"
            >
              <HelpIcon />
            </button>

            <div className="cmp-averages__content">
              <div className="cmp-averages__tiles">
                <div className="cmp-avg-tile">
                  <span>Rede</span>
                  <strong>
                    {formatMetric("network_gb", averages.network_gb)}
                  </strong>
                </div>

                <div className="cmp-avg-tile">
                  <span>CPU</span>
                  <strong>
                    {formatMetric("cpu_percent", averages.cpu_percent)}
                  </strong>
                </div>

                <div className="cmp-avg-tile">
                  <span>Armazenamento</span>
                  <strong>{formatMetric("disk_gb", averages.disk_gb)}</strong>
                </div>

                <div className="cmp-avg-tile">
                  <span>Memória</span>
                  <strong>
                    {formatMetric("memory_gb", averages.memory_gb)}
                  </strong>
                </div>
              </div>

              <Gauge
                title="Consumo energético"
                value={formatMetric("kwh", averages.kwh)}
                unit=""
                fill={gaugeFill(averages.kwh, maxConsumo)}
                max={formatNumber(maxConsumo)}
              />

              <Gauge
                title="Emissão de CO₂e"
                value={formatMetric("co2e", averages.co2e)}
                unit=""
                fill={gaugeFill(averages.co2e, maxEmissao)}
                max={formatNumber(maxEmissao)}
              />
            </div>
          </section>
        )}

        {/* ---------------------------------------------------------- */}
        {/* Serviços                                                    */}
        {/* ---------------------------------------------------------- */}

        <section className="cmp-services" aria-labelledby="services-title">
          <div className="cmp-services__head">
            <h2 id="services-title">Serviços</h2>

            <div className="cmp-services__tools">
              <Popover
                align="right"
                trigger={({ open, toggle }) => (
                  <button
                    type="button"
                    className={`cmp-chip cmp-chip--wide ${loading ? "blocked" : ""}`}
                    aria-expanded={open}
                    onClick={toggle}
                    disabled={loading}
                  >
                    Escolher serviço referência
                    <StarIcon size={24} />
                  </button>
                )}
              >
                {(close) => (
                  <ul className="cmp-menu">
                    {visible.map((service) => (
                      <li key={service.id}>
                        <button
                          type="button"
                          className={
                            service.id === referenceId ? "cmp-is-active" : ""
                          }
                          onClick={() => {
                            setReferenceId(service.id);
                            close();
                          }}
                        >
                          {service.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </Popover>
            </div>
          </div>

          <div className="cmp-services__scroll">
            {/* {!loading && error && <p className="cmp-empty">{error}</p>} */}
            {loading ? (
              <ComparisonServicesSkeleton quantity={8} />
            ) : (
              <>
                {visible.map((service, index) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    rank={index + 1}
                    isFirst={index === 0}
                    isLast={index === visible.length - 1}
                    isReference={service.id === referenceId}
                    compareWith={compareMap[service.id] ?? "reference"}
                    hasReference={
                      referenceId !== null && referenceId !== service.id
                    }
                    baseMetrics={baseMetricsFor(service)}
                    onMove={(direction) => move(service.id, direction)}
                    onToggleReference={() => toggleReference(service.id)}
                    onCompareChange={(target) =>
                      setCompareMap((previous) => ({
                        ...previous,
                        [service.id]: target,
                      }))
                    }
                  />
                ))}
              </>
            )}

            {!loading && error && <p className="cmp-empty">{error}</p>}

            {!loading && !error && visible.length === 0 && (
              <p className="cmp-empty">
                Nenhum serviço selecionado. Escolha ao menos um em “Serviços
                selecionados”.
              </p>
            )}

            {/* Aqui é gerado o card de cada serviço */}

            {visible.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                rank={index + 1}
                isFirst={index === 0}
                isLast={index === visible.length - 1}
                isReference={service.id === referenceId}
                compareWith={compareMap[service.id] ?? "reference"}
                hasReference={
                  referenceId !== null && referenceId !== service.id
                }
                baseMetrics={baseMetricsFor(service)}
                onMove={(direction) => move(service.id, direction)}
                onToggleReference={() => toggleReference(service.id)}
                onCompareChange={(target) =>
                  setCompareMap((previous) => ({
                    ...previous,
                    [service.id]: target,
                  }))
                }
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="cmp-footer">Desenvolvido por Atmos © 2026</footer>
    </div>
  );
}
