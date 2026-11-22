
import { useEffect, useState } from "react";

import { port } from "../../utils/connection";
import AppHeader from "../../components/header/AppHeader";
import Loading from "../../components/loading/Loading";
import RefreshButton from "../../components/refreshButton/RefreshButton";
import Greeting from "../../components/greetings/Greeting";
import Tooltip from "../../components/tooltip/Tooltip";

import useCalendar from "../../components/calendar/useCalendar";
import Calendar from "../../components/calendar/Calendar";
import PeriodSelect from "../../components/calendar/PeriodSelect";

import {
  MultiSelect,
  DropdownMenu,
} from "../../components/dropdown";

import {
  calculateAverages,
  calculateMax,
  fetchServices,
  formatMetric,
  formatNumber,
  type CompareTarget,
} from "./components/comparisonData";

import { Gauge } from "./components/ComparisonComponents";

import ServiceCard from "./components/ServiceCard";

import {
  CmpAveragesSkeleton,
  ComparisonServicesSkeleton,
} from "./ComparisonSkeleton";

import {
  timeFormatter,
  type RankingPeriod,
} from "../ranking/rankingData";

import type {
  MetricsType,
  ServiceType,
} from "../../types/service";

import { toReadableTime } from "../../utils/history";

import "./comparison.css";

type HistoryService = {
  id: string;
  name: string;
  cpu_percentage: number;
  memory_gb: number;
  disk_gb: number;
  network_gb: number;
  co2e: number;
  kwh: number;
};

export default function Comparison() {
  const [period, setPeriod] = useState<RankingPeriod>("now");

  const [historyActivated, setHistoryActivated] = useState(false);

  const [lastUpdate, setLastUpdate] = useState(() => new Date());
  const formattedLastUpdate = timeFormatter.format(lastUpdate);

  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [historyMessage, setHistoryMessage] = useState("");

  const [order, setOrder] = useState<string[]>([]);

  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(),
  );

  const [referenceId, setReferenceId] = useState<string | null>(null);

  const [compareMap, setCompareMap] = useState<
    Record<string, CompareTarget>
  >({});

  const MIN_SERVICES = 2;

  const calendar = useCalendar();

  /* ==========================================================
     CARREGAMENTO INICIAL
  ========================================================== */

  useEffect(() => {
    localStorage.setItem("last_page", "/comparison");
    handleRefresh();
  }, []);

  /* ==========================================================
     ATUALIZAR DADOS ATUAIS
  ========================================================== */

  async function handleRefresh() {
    setLoading(true);
    setError(null);
    setHistoryMessage("");
    setHistoryActivated(false);
    setPeriod("now");

    try {
      const data = await fetchServices();

      setServices(data);
      setOrder(data.map((service) => service.id));
      setSelected(new Set(data.map((service) => service.id)));
      setReferenceId(data[0]?.id ?? null);
      setError(null);
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os serviços. Tente novamente mais tarde.",
      );
    } finally {
      setLoading(false);
      setLastUpdate(new Date());
    }
  }

  /* ==========================================================
     BUSCAR DADOS HISTÓRICOS
  ========================================================== */

  async function fetchHistory(
    periodType: string,
    datePull: Date | string,
  ) {
    setLoading(true);
    setError(null);

    try {
      const result = await fetch(
        `http://localhost:${port}/collections/all-service-history`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            periodType,
            datePull,
          }),
        },
      );

      if (!result.ok) {
        throw new Error("Não foi possível buscar o histórico.");
      }

      const data: HistoryService[] = await result.json();

      if (data && data.length > 0) {
        const formattedData: ServiceType[] = data.map((service) => ({
          id: service.id,
          name: service.name,
          metrics: {
            cpu_percent: service.cpu_percentage,
            memory_gb: service.memory_gb,
            disk_gb: service.disk_gb,
            network_gb: service.network_gb,
            co2e: service.co2e,
            kwh: service.kwh,
            carbon_intensity: service.kwh
              ? service.co2e / service.kwh
              : 0,
          },
          status: "active",
        }));

        setHistoryMessage(
          `Você está vendo dados do passado: ${toReadableTime(datePull)}`,
        );

        setHistoryActivated(true);

        setServices(formattedData);
        setOrder(formattedData.map((service) => service.id));
        setSelected(
          new Set(formattedData.map((service) => service.id)),
        );
        setReferenceId(formattedData[0]?.id ?? null);
        setError(null);
      } else {
        await handleRefresh();

        setHistoryMessage("Período escolhido não possui dado.");
      }
    } catch (error: unknown) {
      console.error(
        "Ocorreu um erro ao buscar dados do período selecionado.",
        error,
      );

      setHistoryActivated(true);

      setHistoryMessage(
        "Ocorreu um erro ao buscar dados do período selecionado.",
      );
    } finally {
      setLoading(false);
    }
  }

  /* ==========================================================
     ALTERAR PERÍODO DE VISUALIZAÇÃO
  ========================================================== */

  function handlePeriodChange(nextPeriod: RankingPeriod) {
    if (nextPeriod === "now") {
      handleRefresh();
    } else {
      setHistoryActivated(true);
      setPeriod(nextPeriod);
      calendar.openCalendar(nextPeriod);
    }
  }

  /* ==========================================================
     SERVIÇOS SELECIONADOS
  ========================================================== */

  const visible = order
    .filter((id) => selected.has(id))
    .map((id) => services.find((service) => service.id === id))
    .filter(
      (service): service is ServiceType => service !== undefined,
    );

  /* ==========================================================
     OPÇÕES DOS DROPDOWNS
  ========================================================== */

  const serviceOptions = services.map((service) => ({
    label: service.name,
    value: service.id,
  }));

  const referenceOptions = visible.map((service) => ({
    label: service.name,
    value: service.id,
  }));

  /* ==========================================================
     MÉDIAS E ESCALAS DOS INDICADORES
  ========================================================== */

  const averages = calculateAverages(visible);

  const maxConsumo = calculateMax(visible, "kwh");
  const maxEmissao = calculateMax(visible, "co2e");

  const gaugeFill = (value?: number, max?: number) =>
    value === undefined || !max
      ? "0"
      : String((value / max) * 100);

  const referenceService = services.find(
    (service) => service.id === referenceId,
  );

  /* ==========================================================
     BASE DE COMPARAÇÃO DE CADA CARD
  ========================================================== */

  const baseMetricsFor = (
    service: ServiceType,
  ): MetricsType | undefined => {
    if (service.id === referenceId) return undefined;

    const target = compareMap[service.id] ?? "reference";

    if (target === "reference" && referenceService) {
      return referenceService.metrics;
    }

    return averages;
  };

  /* ==========================================================
     SELECIONAR OU DESELECIONAR SERVIÇOS
  ========================================================== */

  const handleSelectedChange = (values: string[]) => {
    if (values.length < MIN_SERVICES) return;

    setSelected(new Set(values));
  };

  /* ==========================================================
     MARCAR OU REMOVER REFERÊNCIA
  ========================================================== */

  const toggleReference = (id: string) => {
    setReferenceId((current) =>
      current === id ? null : id,
    );
  };

  /* ==========================================================
     REORDENAR CARDS
  ========================================================== */

  const move = (id: string, direction: -1 | 1) => {
    const visibleIndex = visible.findIndex(
      (service) => service.id === id,
    );

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

  /* ==========================================================
     RENDERIZAÇÃO
  ========================================================== */

  return (
    <div className="cmp-comparison">
      {loading && <Loading />}

      <AppHeader />

      <main className="cmp-page">

        {/* INTRODUÇÃO E CONTROLES */}

        <section className="cmp-intro">

          <div className="cmp-intro__content">
            <Greeting />

            <p className="cmp-intro__sub">
              Selecione dois ou mais serviços para comparar suas métricas.
            </p>

            <div className="cmp-selection-dropdown">
              <MultiSelect
                value={Array.from(selected)}
                onChange={handleSelectedChange}
                options={serviceOptions}
                placeholder="Serviços selecionados"
                emptyLabel="Nenhum serviço selecionado"
              />
            </div>
          </div>

          <div className="cmp-intro__actions">

            <div className="cmp-intro__status">
              {historyMessage ? (
                <strong className="cmp-history-message">
                  {historyMessage}
                </strong>
              ) : !historyActivated ? (
                <span className="last-updated-text">
                  <strong>Última atualização:</strong>{" "}
                  {formattedLastUpdate}
                </span>
              ) : null}
            </div>

            <div className="cmp-intro__controls">
              <RefreshButton handleRefresh={handleRefresh} />

              <div className="cmp-intro__period">
                <PeriodSelect
                  showSkeleton={loading}
                  handlePeriodChange={handlePeriodChange}
                  period={period}
                />
              </div>
            </div>

          </div>
        </section>

        {/* MÉDIAS DOS INDICADORES */}

        {loading ? (
          <CmpAveragesSkeleton />
        ) : (
          <section
            className="cmp-averages"
            aria-labelledby="avg-title"
          >
            <h2
              id="avg-title"
              className="cmp-averages__title"
            >
              Média indicadores
            </h2>

            <div className="cmp-averages__help">
              <Tooltip
                text={"Média das métricas dos \n serviços selecionados"}
              />
            </div>

            <div className="cmp-averages__content">

              <div className="cmp-averages__tiles">

                <div className="cmp-avg-tile">
                  <span>Rede</span>
                  <strong>
                    {formatMetric(
                      "network_gb",
                      averages.network_gb,
                    )}
                  </strong>
                </div>

                <div className="cmp-avg-tile">
                  <span>CPU</span>
                  <strong>
                    {formatMetric(
                      "cpu_percent",
                      averages.cpu_percent,
                    )}
                  </strong>
                </div>

                <div className="cmp-avg-tile">
                  <span>Armazenamento</span>
                  <strong>
                    {formatMetric(
                      "disk_gb",
                      averages.disk_gb,
                    )}
                  </strong>
                </div>

                <div className="cmp-avg-tile">
                  <span>Memória</span>
                  <strong>
                    {formatMetric(
                      "memory_gb",
                      averages.memory_gb,
                    )}
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

        {/* SERVIÇOS */}

        <section
          className="cmp-services"
          aria-labelledby="services-title"
        >

          <div className="cmp-services__head">

            <h2 id="services-title">Serviços</h2>

            <div className="cmp-services__tools">
              <div className="cmp-reference-dropdown">
                <DropdownMenu
                  value={referenceId ?? ""}
                  onChange={setReferenceId}
                  options={referenceOptions}
                  placeholder="Escolher serviço referência"
                />
              </div>
            </div>

          </div>

          <div className="cmp-services__scroll">

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
                    compareWith={
                      compareMap[service.id] ?? "reference"
                    }
                    hasReference={
                      referenceId !== null &&
                      referenceId !== service.id
                    }
                    baseMetrics={baseMetricsFor(service)}
                    onMove={(direction) =>
                      move(service.id, direction)
                    }
                    onToggleReference={() =>
                      toggleReference(service.id)
                    }
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

            {!loading && error && (
              <p className="cmp-empty">{error}</p>
            )}

            {!loading && !error && visible.length === 0 && (
              <p className="cmp-empty">
                Nenhum serviço selecionado. Escolha ao menos um em
                “Serviços selecionados”.
              </p>
            )}

          </div>
        </section>

        {/* CALENDÁRIO DO HISTÓRICO */}

        {calendar.calendarOpen && (
          <Calendar
            period={period}
            selectedMinute={calendar.selectedMinute}
            selectedHour={calendar.selectedHour}
            selectedDay={calendar.selectedDay}
            selectedMonth={calendar.selectedMonth}
            selectedYear={calendar.selectedYear}
            viewMonth={calendar.viewMonth}
            viewYear={calendar.viewYear}
            currentYear={calendar.currentYear}
            currentMonth={calendar.currentMonth}
            currentDay={calendar.currentDay}
            currentHour={calendar.currentHour}
            calendarDays={calendar.calendarDays}
            lastHourSlots={calendar.lastHourSlots}
            onClose={calendar.closeCalendar}
            onChangeMonth={(direction) =>
              calendar.changeMonth(direction, period)
            }
            onConfirmMinute={calendar.confirmMinute}
            onConfirmHour={calendar.confirmHour}
            onConfirmDay={calendar.confirmDay}
            onConfirmMonth={calendar.confirmMonth}
            onConfirmYear={calendar.confirmYear}
            handleFetch={fetchHistory}
            handleCancel={handleRefresh}
          />
        )}

      </main>

      <footer className="cmp-footer">
        Desenvolvido por Atmos © 2026
      </footer>
    </div>
  );
}
