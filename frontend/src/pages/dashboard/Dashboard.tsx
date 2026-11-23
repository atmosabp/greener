
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { port } from "../../utils/connection";
import { Link, useParams } from "react-router-dom";
import "./Dashboard.css";

import AppHeader from "../../components/header/AppHeader";
import RefreshButton from "../../components/refreshButton/RefreshButton";

import type {
  CoordinatesType,
  MetricsType,
  ServiceStatus,
} from "../../types/service";

import { type RankingPeriod } from "../ranking/rankingData";
import useCalendar from "../../components/calendar/useCalendar";
import Calendar from "../../components/calendar/Calendar";

import { useSkeleton } from "../../components/skeleton/useSkeleton";
import { Skeleton } from "../../components/skeleton/Skeleton";
import {
  DashboardGridSkeleton,
  ServiceListSkeleton,
} from "./DashboardSkeleton";

import PeriodSelect from "../../components/calendar/PeriodSelect";
import { toReadableTime } from "../../utils/history";

import Loading from "../../components/loading/Loading";
import Tooltip from "../../components/tooltip/Tooltip";
import Greeting from "../../components/greetings/Greeting";
import { Select } from "../../components/dropdown";

/* Opções do intervalo de atualização */
const UPDATE_OPTIONS = [
  { label: "05s", value: "5" },
  { label: "10s", value: "10" },
  { label: "15s", value: "15" },
  { label: "30s", value: "30" },
  { label: "60s", value: "60" },
  { label: "120s", value: "120" },
];

/* Ícone de seta */
function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

interface ServicesType {
  id?: string;
  name?: string;
  status?: ServiceStatus;
  location?: CoordinatesType;
  metrics?: MetricsType;
}

interface ServiceListItem {
  id: string | undefined;
  name: string | undefined;
  status: string | undefined;
}

export default function Dashboard() {
  const { serviceId } = useParams();

  const [period, setPeriod] = useState<RankingPeriod>("now");

  // Controle do histórico e das atualizações automáticas
  const historyActivatedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const calendar = useCalendar();

  // Carrossel de métricas
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateCarouselButtons = () => {
    const track = trackRef.current;
    if (!track) return;

    setCanPrev(track.scrollLeft > 4);
    setCanNext(
      track.scrollLeft + track.clientWidth < track.scrollWidth - 4,
    );
  };

  const scrollCarousel = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;

    const card = track.querySelector<HTMLElement>(".metric-card");
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = card ? card.offsetWidth + gap : track.clientWidth;

    track.scrollBy({
      left: direction * step,
      behavior: "smooth",
    });
  };

  // Histórico e calendário
  const [historyMessage, setHistoryMessage] = useState("");

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

  // Responsividade
  const compact_query = "(max-width: 1024px)";

  const [isCompact, setIsCompact] = useState(
    () => window.matchMedia(compact_query).matches,
  );

  // Métricas e serviços
  const [updateInterval, setUpdateInterval] = useState<number>(() => {
    const savedInterval = Number(localStorage.getItem("refresh_interval"));
    return savedInterval || 5;
  });

  const [serviceMetrics, setServiceMetrics] = useState<ServicesType>({});
  const [serviceList, setServiceList] = useState<ServiceListItem[]>([]);
  const [timeUpdated, setTimeUpdated] = useState("");
  const [metricsLoaded, setMetricsLoaded] = useState(false);

  async function fetchHistory(
    periodType: string,
    datePull: Date | string,
  ) {
    try {
      const result = await fetch(
        `http://localhost:${port}/collections/service-history/${serviceId}`,
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

      if (data && data.id) {
        setServiceMetrics((previous) => ({
          ...previous,
          metrics: {
            cpu_percent: data.cpu_percentage,
            memory_gb: data.memory_gb,
            disk_gb: data.disk_gb,
            network_gb: data.network_gb,
            co2e: data.co2e,
            kwh: data.kwh,
            renewable_percent: Math.floor(data.renewable_percent),
            carbon_intensity: data.kwh ? data.co2e / data.kwh : 0,
          },
        }));

        setHistoryMessage(
          `Você está vendo dados do passado: ${toReadableTime(datePull)}`,
        );
      } else {
        setHistoryMessage("Período escolhido não possui dados.");
      }
    } catch (e) {
      console.error("Ocorreu um erro ao buscar o histórico:", e);
      setHistoryMessage(
        "Não foi possível obter dados do período selecionado.",
      );
    }
  }

  async function getServiceMetrics() {
    const savedInterval = Number(localStorage.getItem("refresh_interval"));
    const interval = savedInterval || 5;

    setUpdateInterval(interval);

    let data: ServicesType = {};

    try {
      const result = await fetch(
        `http://localhost:${port}/collections/service-metrics/${serviceId}`,
      );

      if (!result.ok) {
        throw new Error(`Erro HTTP: ${result.status}`);
      }

      data = await result.json();

      setTimeUpdated(new Date().toLocaleString());
      setServiceMetrics(data);
    } catch (e) {
      console.error(
        "Ocorreu um erro ao obter métricas do serviço:",
        e,
      );
    }

    setMetricsLoaded(true);

    if (!historyActivatedRef.current) {
      timerRef.current = setTimeout(
        getServiceMetrics,
        interval * 1000,
      );
    }
  }

  async function getServiceList(): Promise<void> {
    try {
      const result = await fetch(
        `http://localhost:${port}/collections/all-service-data`,
      );

      if (!result.ok) {
        throw new Error(`Erro HTTP: ${result.status}`);
      }

      const data: ServicesType[] = await result.json();

      const serviceNames: ServiceListItem[] = data.map((service) => ({
        id: service.id,
        name: service.name,
        status: service.status,
      }));

      setServiceList(serviceNames);
    } catch (e) {
      console.error(
        "Ocorreu um erro ao tentar obter a lista de serviços:",
        e,
      );
    }
  }

  function changeInterval(newTime: string): void {
    const interval = Number(newTime);

    if (!interval) return;

    setUpdateInterval(interval);
    localStorage.setItem("refresh_interval", String(interval));

    window.location.reload();
  }

  async function updateMetrics(): Promise<void> {
    setHistoryMessage("");
    setPeriod("now");
    historyActivatedRef.current = false;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    await getServiceList();
    await getServiceMetrics();
  }

  // Inicialização e atualização da página
  useEffect(() => {
    localStorage.setItem("last_page", `/dashboard/${serviceId}`);

    if (!historyActivatedRef.current) {
      updateMetrics();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [serviceId]);

  function createServiceList() {
    return serviceList.map((service) => {
      const serviceInactive = service.status === "inactive";

      return (
        <li key={service.id}>
          <Link
            to={`/dashboard/${service.id}`}
            reloadDocument
            className="service-link-url"
          >
            <button
              type="button"
              className="service-link"
              disabled={serviceInactive}
            >
              <span
                className="status-dot"
                data-status={
                  service.status === "active"
                    ? "active"
                    : service.status === "inactive"
                      ? "inactive"
                      : "warning"
                }
                aria-hidden="true"
              />

              <span className="service-link-name">
                {service.name}
              </span>

              {service.status === "active" && <ArrowIcon />}
            </button>
          </Link>
        </li>
      );
    });
  }

  // Monitoramento do breakpoint
  useEffect(() => {
    const mediaQuery = window.matchMedia(compact_query);

    const handleChange = () => {
      setIsCompact(mediaQuery.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const year = new Date().getFullYear();

  // Controle de tempo limite do skeleton
  const [gaveUp, setGaveUp] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setGaveUp(true), 15000);

    return () => clearTimeout(timeout);
  }, []);

  const showSkeleton = useSkeleton(!metricsLoaded && !gaveUp);
  const showListSkeleton = useSkeleton(
    serviceList.length === 0 && !gaveUp,
  );

  return (
    <div className="dashboard-page">
      {showSkeleton && <Loading />}
      <AppHeader />

      <main className="dashboard">
        <div className="start-section">
          <div className="text">
            <Greeting />

            {showSkeleton ? (
              <p>
                <Skeleton width="15rem" height="1rem" />
              </p>
            ) : (
              <p>
                Analise os dados do serviço
                <strong> {serviceMetrics.name}</strong>.
              </p>
            )}
          </div>

          <div className="btns">
            {showSkeleton ? (
              <span className="last-update">
                <Skeleton width="15rem" height="1rem" />
              </span>
            ) : (
              <span className="last-update">
                {historyMessage ? (
                  <strong>{historyMessage}</strong>
                ) : (
                  <span className="last-updated-text"><strong>Última atualização:</strong> <span>{timeUpdated || "-"}</span></span>
                )}
              </span>
            )}

            <RefreshButton handleRefresh={updateMetrics} loading={showSkeleton}/>

            {isCompact ? (
              <div className="alter-btns">
                <div className="btn-update">
                  <label htmlFor="update-select">
                    Atualizações:
                  </label>

                  <Select
                  disabled={showSkeleton}
                    className="dashboard-dropdown-update"
                    variant="dark"
                    value={String(updateInterval)}
                    options={UPDATE_OPTIONS}
                    onChange={changeInterval}
                  />
                </div>

                <PeriodSelect
                  showSkeleton={showSkeleton}
                  handlePeriodChange={handlePeriodChange}
                  period={period}
                />
              </div>
            ) : (
              <>
                <div className="btn-update">
                  <label htmlFor="update-select">
                    Atualizações:
                  </label>

                  <Select
                  disabled={showSkeleton}
                    className=""
                    value={String(updateInterval)}
                    options={UPDATE_OPTIONS}
                    onChange={changeInterval}
                  />
                </div>

                <PeriodSelect
                  showSkeleton={showSkeleton}
                  handlePeriodChange={handlePeriodChange}
                  period={period}
                />
              </>
            )}
          </div>
        </div>

        <div className="main-section">
          {showSkeleton ? (
            <DashboardGridSkeleton />
          ) : serviceMetrics.metrics?.cpu_percent ? (
            <div className="dashboard-grid">
              <section className="service-info service-info--selected">
                <h4>Serviço selecionado</h4>
                <p>{serviceMetrics.name}</p>
              </section>

              <section className="service-info service-info--status">
                <h4>Status</h4>

                <div className="service-info-status">
                  <span
                    className="status-dot"
                    data-status={
                      serviceMetrics.status === "active"
                        ? "active"
                        : serviceMetrics.status === "inactive"
                          ? "inactive"
                          : "warning"
                    }
                    aria-hidden="true"
                  />

                  <p>
                    {serviceMetrics.status === "active"
                      ? "Ativo"
                      : serviceMetrics.status === "inactive"
                        ? "Inativo"
                        : "Deletado"}
                  </p>
                </div>
              </section>

              <section className="service-info service-info--location">
                <h4>Localização</h4>

                {!serviceMetrics.location ||
                !serviceMetrics.location.city ? (
                  <p>
                    Não foi encontrada a localização do serviço.
                  </p>
                ) : (
                  <p>
                    {serviceMetrics.location.city},{" "}
                    {serviceMetrics.location.country} -{" "}
                    {serviceMetrics.location.region}
                  </p>
                )}
              </section>

              <section className="metric-card metric-card--data metric-energy">
                <Tooltip text={"Soma de consumo de: \n CPU, Rede, Disco e Memórias \n convertidos em Kilowatt/hora"} />
                <p>Consumo energético</p>

                <h4>
                  {serviceMetrics.metrics?.kwh ? (
                    <>
                      {serviceMetrics.metrics.kwh.toLocaleString(
                        "pt-BR",
                        {
                          maximumSignificantDigits: 4,
                        },
                      )}{" "}
                      kWh
                    </>
                  ) : (
                    <>Indisponível</>
                  )}
                </h4>
              </section>

              <section className="metric-card metric-card--data metric-co2">
                <Tooltip
                  text="Emissão em gramas de CO2 por hora"
                />

                <p>Emissão de CO₂e</p>

                <h4>
                  {serviceMetrics.metrics?.co2e ? (
                    <>
                      {serviceMetrics.metrics.co2e.toLocaleString(
                        "pt-BR",
                        {
                          maximumSignificantDigits: 4,
                        },
                      )}{" "}
                      CO₂e
                    </>
                  ) : (
                    <>Indisponível</>
                  )}
                </h4>
              </section>

              {/* Carrossel de métricas */}
              <div className="metrics-carousel">
                <div className="metrics-header">
                  <h3>Métricas</h3>

                  <div className="carousel-controls">
                    <button
                      type="button"
                      className="carousel-btn"
                      aria-label="Métrica anterior"
                      disabled={!canPrev}
                      onClick={() => scrollCarousel(-1)}
                    >
                      <ArrowIcon className="icon-left" />
                    </button>

                    <button
                      type="button"
                      className="carousel-btn"
                      aria-label="Próxima métrica"
                      disabled={!canNext}
                      onClick={() => scrollCarousel(1)}
                    >
                      <ArrowIcon />
                    </button>
                  </div>
                </div>

                <div
                  className="metrics-track"
                  ref={trackRef}
                  onScroll={updateCarouselButtons}
                  role="region"
                  aria-label="Métricas do serviço"
                  tabIndex={0}
                >
                  <section className="metric-card metric-card--usage metric-cpu">
                    <Tooltip text="Porcentagem utilizada da CPU" />

                    <p>CPU</p>
                    <span className="metric-counter">1/4</span>

                    <h4>
                      {serviceMetrics.metrics?.cpu_percent?.toLocaleString(
                        "pt-BR",
                        {
                          maximumSignificantDigits: 5,
                        },
                      )}{" "}
                      %
                    </h4>
                  </section>

                  <section className="metric-card metric-card--usage metric-memory">
                    <Tooltip text="Memória RAM utilizada" />

                    <p>Memória</p>
                    <span className="metric-counter">2/4</span>

                    <h4>
                      {serviceMetrics.metrics?.memory_gb ? (
                        <>
                          {serviceMetrics.metrics.memory_gb.toLocaleString(
                            "pt-BR",
                            {
                              maximumSignificantDigits: 4,
                            },
                          )}{" "}
                          GB
                        </>
                      ) : (
                        <>Indisponível</>
                      )}
                    </h4>
                  </section>

                  <section className="metric-card metric-card--usage metric-storage">
                    <Tooltip text="Memória de disco utilizada" />

                    <p>Armazenamento</p>
                    <span className="metric-counter">3/4</span>

                    <h4>
                      {serviceMetrics.metrics?.disk_gb ? (
                        <>
                          {serviceMetrics.metrics.disk_gb.toLocaleString(
                            "pt-BR",
                            {
                              maximumSignificantDigits: 4,
                            },
                          )}{" "}
                          GB
                        </>
                      ) : (
                        <>Indisponível</>
                      )}
                    </h4>
                  </section>

                  <section className="metric-card metric-card--usage metric-network">
                    <Tooltip text="Memória movida pela rede" />

                    <p>Rede</p>
                    <span className="metric-counter">4/4</span>

                    <h4>
                      {serviceMetrics.metrics?.network_gb ? (
                        <>
                          {serviceMetrics.metrics.network_gb.toLocaleString(
                            "pt-BR",
                            {
                              maximumSignificantDigits: 4,
                            },
                          )}{" "}
                          GB
                        </>
                      ) : (
                        <>Indisponível</>
                      )}
                    </h4>
                  </section>
                </div>
              </div>

              {/* Gráficos */}
              <div className="analytics">
                <section className="analytics-card analytics-card--renewable">
                  <Tooltip
                    text={
                      "Porcentagem da energia utilizada \n na localização que é renovável"
                    }
                  />

                  <h3>Energia renovável</h3>

                  <div
                    className="donut"
                    role="img"
                    aria-label="Energia renovável"
                    style={
                      {
                        "--value":
                          serviceMetrics.metrics?.renewable_percent,
                      } as CSSProperties
                    }
                  >
                    <span>
                      {serviceMetrics.metrics?.renewable_percent != null
                        ? `${serviceMetrics.metrics.renewable_percent}%`
                        : "-"}
                    </span>
                  </div>
                </section>

                <section className="analytics-card analytics-card--carbon">
                  <Tooltip
                    text={
                      "Quantidade de carbono emitida \n por Kwh na localização"
                    }
                  />

                  <h3>Intensidade de carbono</h3>

                  <p className="carbon-level">
                    {serviceMetrics.metrics?.carbon_intensity
                      ? serviceMetrics.metrics.carbon_intensity <= 100
                        ? "Baixo"
                        : serviceMetrics.metrics.carbon_intensity > 500
                          ? "Alto"
                          : "Médio"
                      : "-"}
                  </p>

                  <div
                    className="carbon-scale"
                    data-level={
                      serviceMetrics.metrics?.carbon_intensity
                        ? serviceMetrics.metrics.carbon_intensity <= 100
                          ? "low"
                          : serviceMetrics.metrics.carbon_intensity > 500
                            ? "high"
                            : "medium"
                        : "low"
                    }
                  >
                    <span className="carbon-scale-fill" />
                    <span className="carbon-node carbon-node--low" />
                    <span className="carbon-node carbon-node--medium" />
                    <span className="carbon-node carbon-node--high" />
                  </div>

                  <p className="carbon-value">
                    <strong>
                      {serviceMetrics.metrics?.carbon_intensity || "-"}
                    </strong>{" "}
                    gCO₂e/kWh
                  </p>
                </section>
              </div>

              {/* Outros serviços */}
              <aside
                className="other-services"
                id="outros-servicos"
                aria-labelledby="others-title"
              >
                <h3 id="others-title">Outros serviços</h3>

                {showListSkeleton ? (
                  <ServiceListSkeleton rows={8} />
                ) : (
                  <ul>{createServiceList()}</ul>
                )}
              </aside>
            </div>
          ) : (
            <div>
              <br />
              <br />

              O serviço está inativo ou não foi possível recolher as suas
              métricas dentro do tempo esperado.

              <br />
              <br />

              Espere mais um momento ou volte à{" "}
              <Link to="/home" className="home-back-link">
                tela principal
              </Link>{" "}
              e selecione outro serviço.
            </div>
          )}
        </div>
      </main>

      <footer>
        <span>Desenvolvido por Atmos &copy; {year}</span>
      </footer>

      {/* Botão voltar ao topo */}
      <button
        type="button"
        className="back-to-top"
        aria-label="Voltar ao topo"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
      >
        <ArrowIcon className="icon-up" />
      </button>

      {/* Calendário do histórico */}
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
          handleCancel={updateMetrics}
        />
      )}
    </div>
  );
}
