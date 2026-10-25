import { useEffect, useRef, useState, type CSSProperties } from "react";
import AppHeader from "../../components/header/AppHeader";
import "./Dashboard.css";
import Calendar from "../../components/calendar/Calendar";

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

  useEffect(() => {
    const mediaQuery = window.matchMedia(compact_query);

    const handleChange = () => {
      setIsCompact(mediaQuery.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="dashboard-page">
      <AppHeader />
      <main className="dashboard">
        <div className="start-section">
          <div className="text">
            <h1>Bom dia, &lt;nome usu&aacute;rio&gt;.</h1>
            {/* backend: nome do usuário */}
            <p>
              Analise os dados do serviço{" "}
              <strong>&lt;nome do serviço&gt;</strong>.
              {/* backend: nome do serviço */}
            </p>
          </div>

          <div className="btns">
            <span className="last-update">Última atualização: 00:30</span>
            {/* backend: última atualização -> Lógica para que, se ultima atualização for > que o valor selecionado para atualização, ficar em vermelho */}

            {isCompact ? (
              <div className="alter-btns">
                <div className="btn-update">
                  <label htmlFor="update-select">Atualizações:</label>
                  <select name="updates" id="update-select">
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
                  <select name="updates" id="update-select">
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
          <div className="dashboard-grid">
            <section className="service-info service-info--selected">
              <h4>Serviço selecionado</h4>
              <p>Email Dispatcher</p>
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
                <p>Ativo</p>
              </div>
            </section>

            <section className="service-info service-info--location">
              <h4>Localização</h4>
              <p>Sao Paulo, Brazil - Sudeste</p>
              {/* backend: localização do serviço */}
            </section>

            <section className="metric-card metric-card--data metric-energy">
              <p>Consumo energético</p>
              <h4>12,48 kWh</h4>
            </section>

            <section className="metric-card metric-card--data metric-co2">
              <p>Emissão de CO₂e</p>
              <h4>4,21 kg CO₂e</h4>
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
                  <h4>38%</h4> {/* backend: tem que mudar dado aqui */}
                </section>

                <section className="metric-card metric-card--usage metric-memory">
                  <p>Memória</p>
                  <span className="metric-counter">2/4</span>
                  <h4>1,36GB</h4> {/* backend: tem que mudar dado aqui */}
                </section>

                <section className="metric-card metric-card--usage metric-storage">
                  <p>Armazenamento</p>
                  <span className="metric-counter">3/4</span>
                  <h4>8GB</h4> {/* backend: tem que mudar dado aqui */}
                </section>

                <section className="metric-card metric-card--usage metric-network">
                  <p>Rede</p>
                  <span className="metric-counter">4/4</span>
                  <h4>0,21GB</h4> {/* backend: tem que mudar dado aqui */}
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
                  style={{ "--value": 83 } as CSSProperties}
                >
                  {/* backend: trocar o --value (0–100) e o texto abaixo */}
                  <span>83%</span>
                </div>
              </section>

              <section className="analytics-card analytics-card--carbon">
                <h3>Intensidade de carbono</h3>
                <p className="carbon-level">Baixo</p>
                {/* backend: data-level = "low" (≤100) | "medium" (>100) | "high" (>500) */}
                <div className="carbon-scale" data-level="low">
                  <span className="carbon-scale-fill" />
                  <span className="carbon-node carbon-node--low" />
                  <span className="carbon-node carbon-node--medium" />
                  <span className="carbon-node carbon-node--high" />
                </div>
                <p className="carbon-value">
                  <strong>85</strong> gCO₂e/kWh
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
                <li>
                  <button type="button" className="service-link">
                    <span
                      className="status-dot"
                      data-status="active"
                      aria-hidden="true"
                    />
                    <span className="service-link-name">Billing API</span>
                    <ArrowIcon />
                  </button>
                </li>
                <li>
                  <button type="button" className="service-link">
                    <span
                      className="status-dot"
                      data-status="active"
                      aria-hidden="true"
                    />
                    <span className="service-link-name">Checkout Worker</span>
                    <ArrowIcon />
                  </button>
                </li>
                <li>
                  <button type="button" className="service-link">
                    <span
                      className="status-dot"
                      data-status="warning"
                      aria-hidden="true"
                    />
                    <span className="service-link-name">Inventory Sync</span>
                    <ArrowIcon />
                  </button>
                </li>
                <li>
                  <button type="button" className="service-link">
                    <span
                      className="status-dot"
                      data-status="active"
                      aria-hidden="true"
                    />
                    <span className="service-link-name">Audit Stream</span>
                    <ArrowIcon />
                  </button>
                </li>
                <li>
                  <button type="button" className="service-link" disabled>
                    <span
                      className="status-dot"
                      data-status="inactive"
                      aria-hidden="true"
                    />
                    <span className="service-link-name">Fraud Detector</span>
                  </button>
                </li>
                <li>
                  <button type="button" className="service-link">
                    <span
                      className="status-dot"
                      data-status="active"
                      aria-hidden="true"
                    />
                    <span className="service-link-name">Reporting Batch</span>
                    <ArrowIcon />
                  </button>
                </li>
              </ul>
            </aside>
          </div>
        </div>
        {isCalendarOpen && (
          <Calendar
            onSelect={handleDateSelect}
            onClose={() => setIsCalendarOpen(false)}
          />
        )}
      </main>

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
