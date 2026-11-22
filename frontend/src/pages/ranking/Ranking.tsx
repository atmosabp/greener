import { useState, useEffect, useRef } from "react";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

import { port } from "../../utils/connection";
import "./Ranking.css";

import AppHeader from "../../components/header/AppHeader";

import useCalendar from "../../components/calendar/useCalendar";
import Calendar from "../../components/calendar/Calendar";

import {
  monthNames,
  numberFormatter,
  timeFormatter,
  type RankingMetric,
  type RankingPeriod,
  type RankingService,
} from "./rankingData";

import { RankingTableSkeletonRows } from "./RankingSkeleton";
import { useSkeleton } from "../../components/skeleton/useSkeleton";
import { Skeleton } from "../../components/skeleton/Skeleton";
import type { ServiceType } from "../../types/service";

import Greeting from "../../components/greetings/Greeting";
import RefreshButton from "../../components/refreshButton/RefreshButton";
import Loading from "../../components/loading/Loading";

import PeriodSelect from "../../components/calendar/PeriodSelect";
import { toReadableTime } from "../../utils/history";

import { Select } from "../../components/dropdown";

const updateOptions = [
  { label: "05s", value: "5" },
  { label: "10s", value: "10" },
  { label: "15s", value: "15" },
  { label: "30s", value: "30" },
  { label: "60s", value: "60" },
  { label: "120s", value: "120" },
];

export default function Ranking() {
  const [initialServices, setInitialServices] = useState<RankingService[]>([]);
  const [period, setPeriod] = useState<RankingPeriod>("now");
  const [metric, setMetric] = useState<RankingMetric>("energy");

  const [updateInterval, setUpdateInterval] = useState<number>(() => {
    const storedInterval = Number(
      localStorage.getItem("refresh_interval"),
    );

    return storedInterval || 5;
  });

  const [lastUpdate, setLastUpdate] = useState(() => new Date());
  const [historyMessage, setHistoryMessage] = useState("");
  const [timeUpdated, setTimeUpdated] = useState("");

  const historyActivatedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const calendar = useCalendar();

  function sortRanking(
    data: RankingService[],
    selectedMetric: RankingMetric = metric,
  ) {
    const dataHolder = [...data].sort((a, b) => {
      const aValue =
        selectedMetric === "energy" ? a.energy : a.co2e;

      const bValue =
        selectedMetric === "energy" ? b.energy : b.co2e;

      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      return bValue - aValue;
    });

    setInitialServices(dataHolder);
  }

  function handleParamChange(param: RankingMetric) {
    setMetric(param);
    sortRanking(initialServices, param);
  }

  function handlePeriodChange(nextPeriod: RankingPeriod) {
    if (nextPeriod === "now") {
      historyActivatedRef.current = false;
      setHistoryMessage("");

      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    } else {
      historyActivatedRef.current = true;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }

    setPeriod(nextPeriod);
    calendar.openCalendar(nextPeriod);
  }

  function handleUpdateIntervalChange(newTime: string) {
    const interval = Number(newTime);

    if (!interval) return;

    setUpdateInterval(interval);
    localStorage.setItem("refresh_interval", String(interval));

    window.location.reload();
  }

  async function fetchHistory(
    periodType: string,
    datePull: Date | string,
  ) {
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
        throw new Error(`Erro HTTP: ${result.status}`);
      }

      const data = await result.json();

      if (data && data.length > 0) {
        const formattedData: RankingService[] = data.map(
          (service: any) => ({
            id: service.id,
            name: service.name,
            energy: service.kwh,
            co2e: service.co2e,
            status: "active",
          }),
        );

        setLastUpdate(new Date(datePull));
        setHistoryMessage(
          `Você está vendo dados do passado: ${toReadableTime(datePull)}`,
        );

        sortRanking(formattedData);
      } else {
        setHistoryMessage("Período escolhido não possui dados.");
      }
    } catch (error) {
      console.error(
        "Ocorreu um erro ao buscar o histórico:",
        error,
      );

      setHistoryMessage(
        "Não foi possível obter dados para o período selecionado.",
      );
    }
  }

  async function fetchServices() {
    try {
      const result = await fetch(
        `http://localhost:${port}/collections/all-service-data`,
      );

      if (!result.ok) {
        throw new Error(`Erro HTTP: ${result.status}`);
      }

      const data: ServiceType[] = await result.json();

      const formattedData: RankingService[] = data.map((service) => ({
        id: service.id,
        name: service.name,
        energy: service.metrics?.kwh ?? undefined,
        co2e: service.metrics?.co2e ?? undefined,
        status: service.status,
      }));

      setTimeUpdated(new Date().toLocaleString());
      setLastUpdate(new Date());

      sortRanking(formattedData);
    } catch (error) {
      console.error(
        "Ocorreu um erro ao buscar os serviços:",
        error,
      );
    }

    if (!historyActivatedRef.current) {
      timerRef.current = setTimeout(
        fetchServices,
        updateInterval * 1000,
      );
    }
  }

  async function handleRefresh() {
    setHistoryMessage("");
    setPeriod("now");
    historyActivatedRef.current = false;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    await fetchServices();
  }

  const periodLabel: Record<RankingPeriod, string> = {
    now: "Agora",
    hour: "Hora",
    today: `Hoje às ${String(calendar.selectedHour).padStart(2, "0")}:00`,
    month: `${calendar.selectedDay} de ${
      monthNames[calendar.selectedMonth]
    } de ${calendar.selectedYear}`,
    year: `${monthNames[calendar.selectedMonth]} de ${
      calendar.selectedYear
    }`,
    "other-years": String(calendar.selectedYear),
  };

  const formattedLastUpdate = timeFormatter.format(lastUpdate);

  useEffect(() => {
    localStorage.setItem("last_page", "/ranking");

    if (!historyActivatedRef.current) {
      fetchServices();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [updateInterval]);

  const [gaveUp, setGaveUp] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setGaveUp(true);
    }, 15000);

    return () => clearTimeout(timeout);
  }, []);

  const showSkeleton = useSkeleton(
    timeUpdated === "" && !gaveUp,
  );

  return (
    <div className="ranking-page">
      {showSkeleton && <Loading />}

      <AppHeader />

      <main className="ranking-main">
        <div className="ranking-intro-box">
          <section className="ranking-intro">
            <div className="ranking-heading">
              <Greeting />
              <p>Veja o ranking de desempenho dos serviços.</p>
            </div>

            {/* Filtros superiores: período e classificação */}
            <div className="ranking-filters">
              <div className="ranking-period">
                <PeriodSelect
                  showSkeleton={showSkeleton}
                  handlePeriodChange={handlePeriodChange}
                  period={period}
                />
              </div>

              <div className="ranking-classification">
                <span>Classificar por:</span>

                <div className="ranking-classification-buttons">
                  <button
                    disabled={showSkeleton}
                    type="button"
                    className={`${
                      metric === "energy"
                        ? "ranking-metric-button is-active"
                        : "ranking-metric-button"
                    }${showSkeleton ? " blocked" : ""}`}
                    aria-pressed={metric === "energy"}
                    onClick={() => handleParamChange("energy")}
                  >
                    Consumo energético
                  </button>

                  <button
                    disabled={showSkeleton}
                    type="button"
                    className={`${
                      metric === "co2e"
                        ? "ranking-metric-button is-active"
                        : "ranking-metric-button"
                    }${showSkeleton ? " blocked" : ""}`}
                    aria-pressed={metric === "co2e"}
                    onClick={() => handleParamChange("co2e")}
                  >
                    Emissão de CO₂e
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Barra inferior: intervalo e atualização */}
          <section className="ranking-toolbar">
            <div className="ranking-update">
              <label>Atualizações:</label>

              <Select
                className="ranking-update-dropdown"
                variant="default"
                value={String(updateInterval)}
                options={updateOptions}
                onChange={handleUpdateIntervalChange}
              />
            </div>

            <div className="ranking-toolbar-info">
              {showSkeleton ? (
                <p>
                  <Skeleton width="10rem" height="1rem" />
                </p>
              ) : (
                <span className="ranking-last-update">
                  {historyMessage ? (
                    <strong>{historyMessage}</strong>
                  ) : (
                    <>
                      {!historyActivatedRef.current && (
                        <>
                          <strong>Última atualização:</strong>{" "}
                          {formattedLastUpdate}
                        </>
                      )}
                    </>
                  )}
                </span>
              )}

              <RefreshButton handleRefresh={handleRefresh} />
            </div>
          </section>
        </div>

        <section
          className="ranking-table-section"
          aria-label="Classificação dos serviços"
        >
          <div
            className="ranking-table-scroll"
            role="region"
            aria-label="Tabela de ranking. Role para ver todos os serviços."
            tabIndex={0}
          >
            <div className="table-border">
              <table className="ranking-table">
                <thead>
                  <tr>
                    <th scope="col">Posição</th>
                    <th scope="col">Serviço</th>
                    <th scope="col">Consumo Energético</th>
                    <th scope="col">Emissão de CO₂e</th>
                  </tr>
                </thead>

                <tbody>
                  {showSkeleton ? (
                    <RankingTableSkeletonRows rows={8} />
                  ) : initialServices.length > 0 ? (
                    initialServices.map((service, index) => (
                      <tr key={service.id}>
                        <td>
                          <span
                            className={
                              index < 3
                                ? `ranking-position ranking-position--${index + 1}`
                                : "ranking-position"
                            }
                          >
                            #{index + 1}
                          </span>
                        </td>

                        <td className="ranking-service-name">
                          {service.status === "active" ? (
                            <Link
                              className="service-link-text"
                              to={`/dashboard/${service.id}`}
                            >
                              {service.name}
                              <ExternalLink className="redirect-link-icon" />
                            </Link>
                          ) : (
                            <>{service.name}</>
                          )}
                        </td>

                        <td>
                          {service.energy !== undefined &&
                          service.energy !== null &&
                          !Number.isNaN(Number(service.energy))
                            ? `${numberFormatter.format(Number(service.energy))} kWh`
                            : "Indisponível"}
                        </td>

                        <td>
                          {service.co2e !== undefined &&
                          service.co2e !== null &&
                          !Number.isNaN(Number(service.co2e))
                            ? `${numberFormatter.format(Number(service.co2e))} kg CO₂e`
                            : "Indisponível"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4}>
                        Não foi possível encontrar serviços.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="ranking-table-caption">
            {showSkeleton ? (
              <p>
                <Skeleton width="10rem" height="1rem" />
              </p>
            ) : (
              <span>
                Período selecionado: {periodLabel[period]}
              </span>
            )}

            {showSkeleton ? (
              <p>
                <Skeleton width="10rem" height="1rem" />
              </p>
            ) : (
              <span>
                {initialServices.length} serviços encontrados
              </span>
            )}
          </div>
        </section>
      </main>

      <footer className="ranking-footer">
        Desenvolvido por Atmos © 2026
      </footer>

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
    </div>
  );
}