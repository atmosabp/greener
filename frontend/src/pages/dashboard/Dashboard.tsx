import { useEffect, useRef, useState, type CSSProperties } from "react";
import AppHeader from "../../components/header/AppHeader";
import "./Dashboard.css";
import "../ranking/Ranking.css";
import { Link, useParams } from "react-router-dom";
import type { CoordinatesType, MetricsType } from "../../types/service";
import useRankingCalendar from "../ranking/components/useRankingCalendar";

import RankingCalendar from "../ranking/components/RankingCalendar";

import { type RankingPeriod } from "../ranking/components/rankingData";

import { useSkeleton } from "../../components/skeleton/useSkeleton";
import { Skeleton } from "../../components/skeleton/Skeleton";
import { DashboardGridSkeleton, ServiceListSkeleton } from "./DashboardSkeleton";
import { port } from "../../utils/connection";
import { greeting } from "../comparison/components/ComparisonComponents";
import Toast from "../../components/toast/Toast";

/* Ícone de seta (direita). A direção muda via classe: icon-left | icon-down | icon-up  -> para ser reutilizavel*/
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

export default function Dashboard() {
  const { serviceId } = useParams();
  const [period, setPeriod] = useState<RankingPeriod>("now");

  //variáveis como ref para se atualizar entre os Timeouts (pois estava dando erro)
  const historyActivatedRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  let serviceFetchReq = useRef<any>(undefined);

  const calendar = useRankingCalendar();

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

  /* Carrossel de métricas (só aparece no mobile) */
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateCarouselButtons = () => {
    const track = trackRef.current;
    if (!track) return;
    setCanPrev(track.scrollLeft > 4);
    setCanNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 4);
  };

  const scrollCarousel = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>(".metric-card");
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = card ? card.offsetWidth + gap : track.clientWidth;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  //lógica do histórico e calendário
  const [historyMessage, setHistoryMessage] = useState("");

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

  const compact_query = "(max-width: 1024px)";
  const [isCompact, setIsCompact] = useState(
    () => window.matchMedia(compact_query).matches,
  );

  interface ServicesType {
    id?: string;
    name?: string;
    status?: "active" | "inactive";
    location?: CoordinatesType;
    metrics?: MetricsType;
  }

  const [updateInterval, setUpdateInterval] = useState<number>(5);
  const [serviceMetrics, setServiceMetrics] = useState<ServicesType>({});
  const [serviceList, setServiceList] = useState<
    {
      id: string | undefined;
      name: string | undefined;
      status: string | undefined;
    }[]
  >([]);
  const [timeUpdated, setTimeUpdated] = useState<string>("");

  async function fetchHistory(periodType: string, datePull: Date) {
    try {
      const result = await fetch(
        `http://localhost:${port}/collections/service-history/${serviceId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ periodType: periodType, datePull: datePull }),
        },
      );

      const data = await result.json();

      if (data && data.length > 0) {
        setServiceMetrics({
          id: serviceMetrics.id,
          name: serviceMetrics.name,
          status: serviceMetrics.status,
          location: serviceMetrics.location,
          metrics: {
            cpu_percent: data.cpu_percentage,
            memory_gb: data.memory_gb,
            disk_gb: data.disk_gb,
            network_gb: data.network_gb,
            co2e: data.co2e,
            kwh: data.kwh,
            renewable_percent: Math.floor(data.renewable_percent),
            carbon_intensity: data.co2e / data.kwh,
          },
        });

        setHistoryMessage("Você está vendo dados do passado ");
      } else {
        setHistoryMessage("Período escolhido não possui dados ");
        <Toast
          icon="error"
          title="Histórico"
          message="Não há dados para o período selecionado."
        />;
      }
    } catch (e: any) {
      console.error(`Ocorreu um erro ao buscar o histórico: ${e.message}`);
      <Toast
        icon="error"
        title="Histórico"
        message="Não há dados para o período selecionado."
      />;
      setHistoryMessage("Período escolhido não possui dados ");
    }
  }

  async function getServiceMetrics() {
    setUpdateInterval(Number(localStorage.getItem("refresh_interval")));
    let data: ServicesType = {};

    try {
      const result = await fetch(
        `http://localhost:${port}/collections/service-metrics/${serviceId}`,
      );
      serviceFetchReq.current = result;

      data = await result.json();
      setTimeUpdated(new Date().toLocaleString());
      setServiceMetrics(data);
    } catch (e: any) {
      console.error(`Ocorreu um erro ao obter métricas do serviço. Erro: ${e.message}`);
    }

    if (!historyActivatedRef.current && data) {
      timerRef.current = setTimeout(getServiceMetrics, updateInterval * 1000);
    }
  }

  async function getServiceList(): Promise<void> {
    try {
      const result = await fetch(
        `http://localhost:${port}/collections/all-service-data`,
      );
      const data: ServicesType[] = await result.json();
      let serviceNames: {
        id: string | undefined;
        name: string | undefined;
        status: string | undefined;
      }[] = [];
      for (let i in data) {
        serviceNames.push({
          id: data[i].id,
          name: data[i].name,
          status: data[i].status,
        });
      }
      setServiceList(serviceNames);
    } catch (e: any) {
      console.error(`Ocorreu um erro ao tentar obter a lista de serviços. Erro: ${e.message}`);
    }
    if (!historyActivatedRef.current) {
      timerRef.current = setTimeout(getServiceList, updateInterval * 1000);
    }
  }

  function changeInterval(newTime: number): void {
    setUpdateInterval(newTime);
    localStorage.setItem("refresh_interval", String(newTime));
    window.location.reload();
  }

  async function updateMetrics(): Promise<void> {
    setHistoryMessage("");
    setPeriod("now");
    historyActivatedRef.current = false;
    await getServiceList();
    await getServiceMetrics();
  }

  //useEffect para rodar na inicialização e iniciar o refresh de dados
  useEffect(() => {
    if (!historyActivatedRef.current) {
      updateMetrics();
    }
    <Toast icon="error" title="oie" />
  }, [historyActivatedRef.current]);

  function createServiceList() {
    let serviceItemList = [];
    for (let i of serviceList) {
      let serviceActive = i.status == "inactive" ? true : false;

      serviceItemList.push(
        <li key={i.id}>
          <Link
            to={`/dashboard/${i.id}`}
            reloadDocument
            className="service-link-url"
          >
            <button
              type="button"
              className="service-link"
              disabled={serviceActive}
            >
              <span
                className="status-dot"
                data-status={
                  i.status == "active"
                    ? "active"
                    : i.status == "inactive"
                      ? "inactive"
                      : "warning"
                }
                aria-hidden="true"
              />
              <span className="service-link-name">{i.name}</span>
              {i.status == "active" ? <ArrowIcon /> : <></>}
            </button>
          </Link>
        </li>,
      );
    }

    return serviceItemList;
  }

  useEffect(() => {
    const mediaQuery = window.matchMedia(compact_query);

    const handleChange = () => {
      setIsCompact(mediaQuery.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  let year = new Date().getFullYear();

  const [gaveUp, setGaveUp] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGaveUp(true), 15000);
    return () => clearTimeout(t);
  }, []);

  const metricsDone = timeUpdated !== "" || serviceList.length > 0;
  const showSkeleton = useSkeleton(!metricsDone && !gaveUp);

  // A lista "Outros serviços" vem em outra requisição, depois das métricas.
  const showListSkeleton = useSkeleton(serviceList.length === 0 && !gaveUp);

  return (
    <div className="dashboard-page">
      <AppHeader />

      <main className="dashboard">
        <div className="start-section">
          <div className="text">
            <h1>
              {greeting()}, {userName}.
            </h1>
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
                <strong>{historyMessage}</strong>&nbsp; &nbsp;
                <Skeleton width="15rem" height="1rem" />
              </span>
            ) : (
              <span className="last-update">
                Última atualização: {timeUpdated || "-"}
              </span>
            )}
            {/* backend: última atualização -> Lógica para que, se ultima atualização for > que o valor selecionado para atualização, ficar em vermelho */}

            {isCompact ? (
              <div className="alter-btns">
                <div className="btn-update">
                  <label htmlFor="update-select">Atualizações:</label>
                  <select
                    className={`${showSkeleton ? "blocked " : ""}`}
                    disabled={showSkeleton}
                    name="updates"
                    value={Number(updateInterval)}
                    id="update-select"
                    onChange={(event) =>
                      changeInterval(Number(event.target.value))
                    }
                  >
                    <option value="5">05s</option>
                    <option value="10">10s</option>
                    <option value="15">15s</option>
                    <option value="30">30s</option>
                    <option value="60">60s</option>
                    <option value="120">120s</option>
                  </select>
                </div>

                <div className="ranking-period">
                  <label htmlFor="ranking-period-select">Período</label>

                  <select
                    className={`${showSkeleton ? "blocked " : ""}`}
                    disabled={showSkeleton}
                    name="date"
                    id="ranking-period-select"
                    value={period}
                    onChange={(event) =>
                      handlePeriodChange(event.target.value as RankingPeriod)
                    }
                    onClick={(event) => {
                      const currentValue = event.currentTarget
                        .value as RankingPeriod;
                      if (currentValue === period) {
                        handlePeriodChange(currentValue);
                      }
                    }}
                  >
                    <option value="now">Agora</option>
                    <option value="today">Hoje</option>
                    <option value="month">Esse mês</option>
                    <option value="year">Esse ano</option>
                  </select>
                </div>
              </div>
            ) : (
              <>
                <div className="btn-update">
                  <label htmlFor="update-select">Atualizações:</label>
                  <select
                    className={`${showSkeleton ? "blocked " : ""}`}
                    disabled={showSkeleton}
                    name="updates"
                    id="update-select"
                    value={Number(updateInterval)}
                    onChange={(event) =>
                      changeInterval(Number(event.target.value))
                    }
                  >
                    <option value="5">05s</option>
                    <option value="10">10s</option>
                    <option value="15">15s</option>
                    <option value="30">30s</option>
                    <option value="60">60s</option>
                    <option value="120">120s</option>
                  </select>
                </div>

                <div className="ranking-period">
                  <label htmlFor="ranking-period-select">
                    Ver dados por período:
                  </label>

                  <select
                    id="ranking-period-select"
                    value={period}
                    onChange={(event) =>
                      handlePeriodChange(event.target.value as RankingPeriod)
                    }
                    className={`${showSkeleton ? "blocked " : ""}`}
                    disabled={showSkeleton}
                    name="date"
                  >
                    <option value="now">Agora</option>
                    <option value="today">Hoje</option>
                    <option value="month">Esse mês</option>
                    <option value="year">Esse ano</option>
                  </select>
                </div>
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
                    data-status="active"
                    aria-hidden="true"
                  />
                  <p>
                    {serviceMetrics &&
                    serviceMetrics.status &&
                    serviceMetrics.status == "active"
                      ? "Ativo"
                      : "Inativo"}
                  </p>
                </div>
              </section>

              <section className="service-info service-info--location">
                <h4>Localização</h4>
                {!serviceMetrics.location || !serviceMetrics.location.city ? (
                  <p>Não foi encontrada a localização do serviço.</p>
                ) : (
                  <p>
                    {serviceMetrics.location?.city},{" "}
                    {serviceMetrics.location?.country} -{" "}
                    {serviceMetrics.location?.region}
                  </p>
                )}
              </section>

              <section className="metric-card metric-card--data metric-energy">
                <p>Consumo energético</p>
                <h4>
                  {serviceMetrics.metrics?.memory_gb ? (
                    <>
                      {serviceMetrics.metrics?.memory_gb.toLocaleString(
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
                <p>Emissão de CO₂e</p>
                <h4>
                  {serviceMetrics.metrics?.co2e ? (
                    <>
                      {serviceMetrics.metrics?.co2e.toLocaleString("pt-BR", {
                        maximumSignificantDigits: 4,
                      })}{" "}
                      CO₂e
                    </>
                  ) : (
                    <>Indisponível</>
                  )}
                </h4>
              </section>

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
                    <p>CPU</p>
                    <span className="metric-counter">1/4</span>
                    <h4>
                      {serviceMetrics.metrics?.cpu_percent.toLocaleString(
                        "pt-BR",
                        {
                          maximumSignificantDigits: 5,
                        },
                      )}{" "}
                      %
                    </h4>
                  </section>

                  <section className="metric-card metric-card--usage metric-memory">
                    <p>Memória</p>
                    <span className="metric-counter">2/4</span>
                    <h4>
                      {serviceMetrics.metrics?.memory_gb ? (
                        <>
                          {serviceMetrics.metrics?.memory_gb.toLocaleString(
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
                    <p>Armazenamento</p>
                    <span className="metric-counter">3/4</span>
                    <h4>
                      {serviceMetrics.metrics?.disk_gb ? (
                        <>
                          {serviceMetrics.metrics?.disk_gb.toLocaleString(
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
                    <p>Rede</p>
                    <span className="metric-counter">4/4</span>
                    <h4>
                      {serviceMetrics.metrics?.network_gb ? (
                        <>
                          {serviceMetrics.metrics?.network_gb.toLocaleString(
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
                  <h3>Energia renovável</h3>
                  <div
                    className="donut"
                    role="img"
                    aria-label="83% de energia renovável"
                    style={
                      {
                        "--value": serviceMetrics.metrics?.renewable_percent,
                      } as CSSProperties
                    }
                  >
                    <span>
                      {serviceMetrics.metrics?.renewable_percent + "%" || "-"}
                    </span>
                  </div>
                </section>

                <section className="analytics-card analytics-card--carbon">
                  <h3>Intensidade de carbono</h3>
                  <p className="carbon-level">
                    {serviceMetrics.metrics?.carbon_intensity
                      ? serviceMetrics.metrics?.carbon_intensity <= 100
                        ? "Baixo"
                        : serviceMetrics.metrics?.carbon_intensity &&
                            serviceMetrics.metrics.carbon_intensity > 500
                          ? "Alto"
                          : "Médio"
                      : "-"}
                  </p>
                  <div
                    className="carbon-scale"
                    data-level={
                      serviceMetrics.metrics?.carbon_intensity
                        ? serviceMetrics.metrics?.carbon_intensity <= 100
                          ? "low"
                          : serviceMetrics.metrics?.carbon_intensity &&
                              serviceMetrics.metrics.carbon_intensity > 500
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
              O serviço está inativo ou não foi recolher as suas métricas
              dentro do tempo esperado.
              <br />
              <br />
              Espere mais um momento ou volte à <Link to={"/home"} className="home-back-link">tela principal</Link> e selecione outro serviço.
              {/* <Toast icon="error" title="Erro" message="Erro ao carregar métricas do serviço. O serviço pode estar inativo." /> */}
            </div>
          )}
        </div>
      </main>
      <footer>
        <span>Desenvolvido por Atmos &copy; {year}</span>
      </footer>

      {/* mobile: botão voltar ao topo */}
      <button
        type="button"
        className="back-to-top"
        aria-label="Voltar ao topo"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowIcon className="icon-up" />
      </button>

      {/* calendário do histórico */}
      {calendar.calendarOpen && (
        <RankingCalendar
          period={period}
          selectedHour={calendar.selectedHour}
          selectedDay={calendar.selectedDay}
          selectedMonth={calendar.selectedMonth}
          selectedYear={calendar.selectedYear}
          viewMonth={calendar.viewMonth}
          viewYear={calendar.viewYear}
          currentYear={calendar.currentYear}
          currentMonth={calendar.currentMonth}
          currentDay={calendar.currentDay}
          calendarDays={calendar.calendarDays}
          onClose={calendar.closeCalendar}
          onChangeMonth={(direction) => calendar.changeMonth(direction, period)}
          onConfirmDay={calendar.confirmDay}
          onConfirmMonth={calendar.confirmMonth}
          onConfirmYear={calendar.confirmYear}
          onConfirmHour={calendar.confirmHour}
          handleFetch={fetchHistory}
          handleCancel={updateMetrics}
        />
      )}
    </div>
  );
}