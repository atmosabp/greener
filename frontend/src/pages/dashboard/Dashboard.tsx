import { useEffect, useRef, useState, type CSSProperties } from "react";
import AppHeader from "../../components/header/AppHeader";
import "./Dashboard.css";
import Calendar from "../../components/calendar/Calendar";
import { Link, useParams } from "react-router-dom";
import type { CoordinatesType, MetricsType } from "../../types/service";
// import { Oval } from "react-loader-spinner";

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

  /* Calendário para selecionar data */
  const [filter, setFilter] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  function handleDateSelect(date: string): void {
    console.log("Data:", date);

    // Insirir lógica aqui
  }

  function handleFilterChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedFilter = event.target.value;

    setFilter(selectedFilter);
    setIsCalendarOpen(selectedFilter === "custom");
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

  const [loading, _setLoading] = useState<boolean>(true);
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

  async function getServiceMetrics() {
    setUpdateInterval(Number(localStorage.getItem("refresh_interval")));

    try {
      const result = await fetch(
        `http://localhost:${import.meta.env.VITE_PORT}/collections/service-metrics/${serviceId}`,
      );
      const data = await result.json();
      // console.log(data)
      setTimeUpdated(new Date().toLocaleString());
      setServiceMetrics(data);
    } catch (e: any) {
      console.log(e.message);
    }
  }

  async function getServiceList(): Promise<void> {
    try {
      const result = await fetch(
        `http://localhost:${import.meta.env.VITE_PORT}/collections/all-service-data`,
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
      console.log(e.message);
    }
  }

  function changeInterval(newTime: number): void{
    setUpdateInterval(newTime);
    localStorage.setItem("refresh_interval", String(newTime));
    window.location.reload();
  }

  async function updateMetrics(): Promise<void>{
    await getServiceMetrics();
    await getServiceList();
  }

  // useEffect para atualizar de acordo com o intervalo
  useEffect(() => {
    updateMetrics();
    const fetchData = async () => {
      await updateMetrics();
    }
    const fetchTimer = setInterval(fetchData, (localStorage.getItem("refresh_interval") ? Number(localStorage.getItem("refresh_interval")) : updateInterval) * 1000);

    return () => clearInterval(fetchTimer);
  }, []);

  function createServiceList() {
    let serviceItemList = [];
    for (let i of serviceList) {
      let serviceActive = i.status == "inactive" ? true : false;

      serviceItemList.push(
        <li>
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

  return (
    <div className="dashboard-page">
      <AppHeader />
      <main className="dashboard">
        <div className="start-section">
          <div className="text">
            <h1>Bom dia, &lt;nome usu&aacute;rio&gt;.</h1>
            {/* backend: nome do usuário */}
            <p>
              Analise os dados do serviço <strong>{serviceMetrics.name}</strong>
              .{/* backend: nome do serviço */}
            </p>
          </div>

          <div className="btns">
            <span className="last-update">
              Última atualização: {timeUpdated || "-"}
            </span>
            {/* backend: última atualização -> Lógica para que, se ultima atualização for > que o valor selecionado para atualização, ficar em vermelho */}

            {isCompact ? (
              <div className="alter-btns">
                <div className="btn-update">
                  <label htmlFor="update-select">Atualizações:</label>
                  <select name="updates" value={Number(updateInterval)} id="update-select" onChange={(event) => changeInterval(Number(event.target.value))}>
                    <option value="5">05s</option>
                    <option value="10">10s</option>
                    <option value="15">15s</option>
                    <option value="30">30s</option>
                    <option value="60">60s</option>
                    <option value="120">120s</option>
                  </select>
                </div>

                <div className="btn-date">
                  <select
                    name="date"
                    id="date-select"
                    value={filter}
                    onChange={handleFilterChange}
                  >
                    <option value="today">Hoje</option>
                    <option value="custom">Escolher data</option>
                  </select>
                </div>
              </div>
            ) : (
              <>
                <div className="btn-update">
                  <label htmlFor="update-select">Atualizações:</label>
                  <select name="updates" id="update-select" value={Number(updateInterval)} onChange={(event) => changeInterval(Number(event.target.value))}>
                    <option value="5">05s</option>
                    <option value="10">10s</option>
                    <option value="15">15s</option>
                    <option value="30">30s</option>
                    <option value="60">60s</option>
                    <option value="120">120s</option>
                  </select>
                </div>

                <div className="btn-date">
                  <select
                    name="date"
                    id="date-select"
                    value={filter}
                    onChange={handleFilterChange}
                  >
                    <option value="today">Hoje</option>
                    <option value="custom">Escolher data</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="main-section">
          {serviceMetrics.metrics?.cpu_percent ? (
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
                  {/* backend: data-status = "active" | "warning" | "inactive" */}
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
                  {serviceMetrics.metrics?.kwh.toLocaleString("pt-BR", {
                    maximumSignificantDigits: 4,
                  })}{" "}
                  kWh
                </h4>
              </section>

              <section className="metric-card metric-card--data metric-co2">
                <p>Emissão de CO₂e</p>
                <h4>
                  {serviceMetrics.metrics?.co2e.toLocaleString("pt-BR", {
                    maximumSignificantDigits: 6,
                  })}{" "}
                  CO₂e
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
                      {serviceMetrics.metrics?.memory_gb.toLocaleString(
                        "pt-BR",
                        {
                          maximumSignificantDigits: 4,
                        },
                      )}{" "}
                      GB
                    </h4>
                  </section>

                  <section className="metric-card metric-card--usage metric-storage">
                    <p>Armazenamento</p>
                    <span className="metric-counter">3/4</span>
                    <h4>
                      {serviceMetrics.metrics?.disk_gb.toLocaleString("pt-BR", {
                        maximumSignificantDigits: 4,
                      })}{" "}
                      GB
                    </h4>
                  </section>

                  <section className="metric-card metric-card--usage metric-network">
                    <p>Rede</p>
                    <span className="metric-counter">4/4</span>
                    <h4>
                      {serviceMetrics.metrics?.network_gb.toLocaleString(
                        "pt-BR",
                        {
                          maximumSignificantDigits: 4,
                        },
                      )}{" "}
                      GB
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
                <ul>
                  {loading
                    ? createServiceList()
                    : // <Oval
                      //   height={50}
                      //   width={50}
                      //   color="#0bbc32"
                      //   visible={true}
                      //   ariaLabel="oval-loading"
                      //   secondaryColor="#06b3ad"
                      //   strokeWidth={4}
                      //   strokeWidthSecondary={4}
                      // />
                      createServiceList()}
                </ul>
              </aside>
            </div>
          ) : (
            <div>
              O serviço está inativo.
              <br />
              Volte à tela principal e selecione outro serviço.
            </div>
          )}
        </div>
        {isCalendarOpen && (
          <Calendar
            onSelect={handleDateSelect}
            onClose={() => setIsCalendarOpen(false)}
          />
        )}
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
    </div>
  );
}
