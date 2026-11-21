import { useState, useEffect, useRef } from "react";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
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
import { port } from "../../utils/connection";
import type { ServiceType } from "../../types/service";
import Toast from "../../components/toast/Toast";
import Greeting from "../../components/greetings/Greeting";

import PeriodSelect from "../../components/calendar/PeriodSelect";
import { toReadableTime } from "../../utils/history";

export default function Ranking() {
  const [initialServices, setInitialServices] = useState<RankingService[]>([]);
  const [period, setPeriod] = useState<RankingPeriod>("now");
  const [metric, setMetric] = useState<RankingMetric>("energy");
  const [updateInterval, setUpdateInterval] = useState(5);
  const [lastUpdate, setLastUpdate] = useState(() => new Date());
  const [historyMessage, setHistoryMessage] = useState("");
  const [timeUpdated, setTimeUpdated] = useState<string>("");

  //variáveis como ref para se atualizar entre os Timeouts (pois estava dando erro)
  const historyActivatedRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  var metricUsed: RankingMetric = "energy";
  const calendar = useCalendar();

  function handlePeriodChange(nextPeriod: RankingPeriod) {
    if (nextPeriod == "now") {
      historyActivatedRef.current = false;
      setHistoryMessage("");
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

  function handleUpdateIntervalChange(newTime: number) {
    setUpdateInterval(newTime);
    localStorage.setItem("refresh_interval", String(newTime));
    window.location.reload();
  }

  async function handleRefresh() {
    setHistoryMessage("");
    setPeriod("now");
    setLastUpdate(new Date());
    historyActivatedRef.current = false;
    await fetchServices();
  }

  async function fetchHistory(periodType: string, datePull: Date | string) {
    try {
      var formatedData: RankingService[] = [];

      const result = await fetch(
        `http://localhost:${port}/collections/all-service-history`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ periodType: periodType, datePull: datePull }),
        },
      );

      const data = await result.json();

      if (data && data.length > 0) {
        for (let service of data) {
          formatedData.push({
            id: service.id,
            name: service.name,
            energy: service.kwh,
            co2e: service.co2e,
            status: "active",
          });
        }
        setLastUpdate(new Date(datePull));
        setHistoryMessage(`Você está vendo dados do passado: ${toReadableTime(datePull)}`);

        sortRanking(formatedData);
      } else {
        handleRefresh();
        <Toast
          icon="error"
          title="Histórico"
          message="Não há dados para o período selecionado."
        />;
        setHistoryMessage("Período escolhido não possui dados.");
      }
    } catch (e: any) {
      console.error(`Ocorreu um erro ao buscar o histórico: ${e.message}`);
      <Toast
        icon="error"
        title="Histórico"
        message="Não foi possível obter dados para o peíodo selecionado."
      />;
      setHistoryMessage("Não foi possível obter dados para o peíodo selecionado.");
    }
  }

  async function fetchServices() {
    setUpdateInterval(Number(localStorage.getItem("refresh_interval")));

    var formatedData: RankingService[] = [];

    const result = await fetch(
      `http://localhost:${port}/collections/all-service-data`,
    );
    const data: ServiceType[] = await result.json();

    setTimeUpdated(new Date().toLocaleString());

    for (let service of data) {
      formatedData.push({
        id: service.id,
        name: service.name,
        energy:
          service.metrics && service.metrics.kwh
            ? service.metrics.kwh
            : undefined,
        co2e:
          service.metrics && service.metrics.co2e
            ? service.metrics.co2e
            : undefined,
        status: service.status,
      });
    }

    setLastUpdate(new Date());

    sortRanking(formatedData);

    //caso o histórico não esteja ativado, chama outro timer
    if (!historyActivatedRef.current) {
      timerRef.current = setTimeout(fetchServices, updateInterval * 1000);
    }
  }

  async function handleParamChange(param: RankingMetric) {
    setMetric(param);
    metricUsed = param;
    sortRanking(initialServices);
  }

  function sortRanking(data: RankingService[]) {
    var key: (x: undefined | number) => undefined | number = (x) => x;
    setInitialServices(
      data.sort((a, b) => {
        if (metric === "energy") {
          const xKey = key(a.energy),
            yKey = key(b.energy);
          if (typeof xKey === "undefined") {
            return typeof yKey === "string" ? 0 : 1;
          } else {
            return typeof yKey === "string" ? -1 : yKey! - xKey!;
          }
        } else {
          const xKey = key(a.co2e),
            yKey = key(b.co2e);
          if (typeof xKey === "undefined") {
            return typeof yKey === "string" ? 0 : 1;
          } else {
            return typeof yKey === "string" ? -1 : yKey! - xKey!;
          }
        }
      }),
    );
    var key: (x: undefined | number) => undefined | number = (x) => x; //pega um parametro e retorna o tipo
    let dataHolder = data.sort((a, b) => {
      if (metricUsed === "energy") {
        const xKey = key(a.energy),
          yKey = key(b.energy);
        if (typeof xKey === "undefined") {
          return typeof yKey === "string" ? 0 : 1;
        } else {
          return typeof yKey === "string" ? -1 : yKey! - xKey!;
        }
      } else {
        const xKey = key(a.co2e),
          yKey = key(b.co2e);
        if (typeof xKey === "undefined") {
          return typeof yKey === "string" ? 0 : 1;
        } else {
          return typeof yKey === "string" ? -1 : yKey! - xKey!;
        }
      }
    });

    setInitialServices(dataHolder);
  }

  const periodLabel: Record<RankingPeriod, string> = {
    now: "Agora",
    hour: "Hora",
    today: `Hoje às ${String(calendar.selectedHour).padStart(2, "0")}:00`,
    month: `${calendar.selectedDay} de ${
      monthNames[calendar.selectedMonth]
    } de ${calendar.selectedYear}`,
    year: `${monthNames[calendar.selectedMonth]} de ${calendar.selectedYear}`,
    "other-years": String(calendar.selectedYear),
  };

  const formattedLastUpdate = timeFormatter.format(lastUpdate);

  useEffect(() => {
    localStorage.setItem("last_page", '/ranking');
    if (!historyActivatedRef.current) {
      fetchServices();
    }
  }, [historyActivatedRef.current]);

  const [gaveUp, setGaveUp] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGaveUp(true), 15000);
    return () => clearTimeout(t);
  }, []);
  const showSkeleton = useSkeleton(timeUpdated === "" && !gaveUp);

  return (
    <div className="ranking-page">
      {/* <Loading data={initialServices} /> */}
      <AppHeader />

      <main className="ranking-main">
        <div className="ranking-intro-box">
          <section className="ranking-intro">
            <div className="ranking-heading">
              <Greeting />
              <p>Veja o ranking de desempenho dos serviços.</p>
            </div>

            <div className="ranking-filters">
              <div className="ranking-classification">
                <span>Classificar por:</span>

                <div className="ranking-classification-buttons">
                  <button
                    type="button"
                    className={
                      metric === "energy"
                        ? "ranking-metric-button is-active"
                        : "ranking-metric-button"
                    }
                    aria-pressed={metric === "energy"}
                    onClick={() => handleParamChange("energy")}
                  >
                    Consumo energético
                  </button>

                  <button
                    type="button"
                    className={
                      metric === "co2e"
                        ? "ranking-metric-button is-active"
                        : "ranking-metric-button"
                    }
                    aria-pressed={metric === "co2e"}
                    onClick={() => handleParamChange("co2e")}
                  >
                    Emissão de CO₂e
                  </button>
                </div>
              </div>

              <PeriodSelect
                showSkeleton={showSkeleton}
                handlePeriodChange={handlePeriodChange}
                period={period}
              />

            </div>
          </section>

          <section className="ranking-toolbar">
            <div className="ranking-toolbar-buttons">
              <div className="ranking-update">
                <label htmlFor="ranking-update-select">Atualizações:</label>

                <select
                  id="ranking-update-select"
                  value={Number(updateInterval)}
                  onChange={(event) =>
                    handleUpdateIntervalChange(Number(event.target.value))
                  }
                >
                  <option value={5}>05s</option>
                  <option value={10}>10s</option>
                  <option value={15}>15s</option>
                  <option value={30}>30s</option>
                  <option value={60}>60s</option>
                  <option value={120}>120s</option>
                </select>
              </div>
              <PeriodSelect
                showSkeleton={showSkeleton}
                handlePeriodChange={handlePeriodChange}
                period={period}
              />
            </div>

            <div className="ranking-toolbar-info">
              {showSkeleton ? (
                <p>
                  <Skeleton width="10rem" height="1rem" />
                </p>
              ) : (
                <span className="ranking-last-update">
                  <strong>{historyMessage}</strong>&nbsp; &nbsp;
                  {historyActivatedRef.current ? (
                    <></>
                  ) : (
                    <span className="last-updated-text"><strong>Última atualização:</strong> {formattedLastUpdate}</span>
                  )}
                </span>
              )}

              <button
                type="button"
                className="ranking-refresh-button"
                onClick={handleRefresh}
                aria-label="Atualizar horário da última atualização"
                title="Atualizar"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="17"
                  height="17"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 7v5h-5" />
                  <path d="M4 17v-5h5" />
                  <path d="M5.6 9a7 7 0 0 1 11.6-2L20 12" />
                  <path d="M4 12l2.8 5a7 7 0 0 0 11.6-2" />
                </svg>
              </button>
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
                  ) : (
                    <>
                      {initialServices
                        ? initialServices.map((service, index) => (
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
                                {service.status == "active" ? (
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
                                {service.energy ? (
                                  <>
                                    {numberFormatter.format(service.energy) !=
                                    "NaN"
                                      ? numberFormatter.format(service.energy) +
                                        " kWh"
                                      : "Indisponível"}{" "}
                                  </>
                                ) : (
                                  "Indisponível"
                                )}
                              </td>

                              <td>
                                {service.co2e ? (
                                  <>
                                    {numberFormatter.format(service.co2e) !=
                                    "NaN"
                                      ? numberFormatter.format(service.co2e) +
                                        " kg CO₂e"
                                      : "Indisponível"}{" "}
                                  </>
                                ) : (
                                  "Indisponível"
                                )}
                              </td>
                            </tr>
                          ))
                        : "não foi possível pegar os serviços"}
                    </>
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
              <span>Período selecionado: {periodLabel[period]}</span>
            )}

            {showSkeleton ? (
              <p>
                <Skeleton width="10rem" height="1rem" />
              </p>
            ) : (
              <span>
                {initialServices ? initialServices.length : 0} serviços
                encontrados
              </span>
            )}
          </div>
        </section>
      </main>

      <footer className="ranking-footer">Desenvolvido por Atmos © 2026</footer>

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
          onChangeMonth={(direction) => calendar.changeMonth(direction, period)}
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
