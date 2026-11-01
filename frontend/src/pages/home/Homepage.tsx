import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AppHeader from "../../components/header/AppHeader";
import InteractiveGlobe from "./InteractiveGlobe";
import MapVisualization from "./MapVisualization";
import "./Homepage.css";

export type ServiceStatus = "active" | "incomplete" | "inactive";

export interface Service {
  id: string;
  name: string;
  location:
    | {
        city?: string;
        country?: string;
        latitude?: number | undefined;
        longitude?: number | undefined;
        region?: string;
        region_code?: string;
      }
    | undefined;
  metrics_path?: string;
  metrics?: {
    cpu_percent?: number;
    memory_gb?: number;
    disk_gb?: number;
    network_gb?: number;
    co2e?: number;
    kwh?: number;
  };
  status: ServiceStatus;
}

interface HomepageProps {
  lastUpdated?: string;
  updateTime?: number;
}

type VisualizationMode = "globe" | "map";

const statusLabels: Record<ServiceStatus, string> = {
  active: "Ativo",
  incomplete: "Incompleto",
  inactive: "Inativo",
};

export default function Homepage({ updateTime = 5 }: HomepageProps) {
  const [mode, setMode] = useState<VisualizationMode>("globe");
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [timeUpdated, setTimeUpdated] = useState<string>("");

  // TODO: lista de serviços com base nos serviços reais da API
  const [services, setServices] = useState<Service[]>([]);

  async function updateServices() {
    const result = await fetch(
      `http://localhost:${import.meta.env.VITE_PORT}/collections/all-service-data`,
    );
    const data = await result.json();
    setTimeUpdated(new Date().toLocaleString());
    setServices(data);
  }

  useEffect(() => {
    updateServices();
    // multiplica [tempo_segundo] x 1200 que dá o tempo em milisegundos, mais uma margem de erro de 200 milisegundos
    const fetchTimer = setInterval(updateServices, updateTime * 1200);

    return () => clearInterval(fetchTimer);
  }, []);

  const activeCount = services.filter(
    (service) => service.status === "active",
  ).length;

  const incompleteCount = services.filter(
    (service) => service.status === "incomplete",
  ).length;

  const inactiveCount = services.filter(
    (service) => service.status === "inactive",
  ).length;

  return (
    <div className="homepage">
      <AppHeader />

      <main className="homepage-main">
        <section
          className="explorer-layout"
          aria-label="Explorador de serviços"
        >
          <aside className="services-panel">
            <div className="panel-heading">
              <div>
                <span className="section-kicker">EXPLORADOR</span>
                <h2>Seus serviços</h2>
              </div>

              <span className="service-count">
                {String(services.length).padStart(2, "0")}
              </span>
            </div>

            <p className="panel-description">
              Selecione um ponto para explorar sua localização e seus dados.
            </p>

            <div className="services-list">
              {services.length === 0 ? (
                <p className="services-empty">Nenhum serviço foi encontrado.</p>
              ) : (
                services.map((service, index) => {
                  const isSelected = selectedService === service.id;

                  return (
                    <button
                      key={`${service.id}-${index}`}
                      type="button"
                      className={`service-item ${
                        isSelected ? "service-item-selected" : ""
                      }`}
                      onClick={() =>
                        setSelectedService((current) =>
                          current === service.id ? null : service.id,
                        )
                      }
                      aria-pressed={isSelected}
                    >
                      <span className="service-index">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className={`status-dot ${service.status}`} />

                      <span className="service-content">
                        <span className="service-name">{service.name}</span>

                        <span className="service-status">
                          {statusLabels[service.status]}
                        </span>
                      </span>

                      <span className="service-arrow" aria-hidden="true">
                        {isSelected ? "−" : "↗"}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            <div className="services-legend">
              <span className="legend-title">STATUS DOS SERVIÇOS</span>

              <div className="legend-items">
                <span>
                  <i className="status-dot active" />
                  Ativos
                  <strong>{activeCount}</strong>
                </span>

                <span>
                  <i className="status-dot incomplete" />
                  Incompletos
                  <strong>{incompleteCount}</strong>
                </span>

                <span>
                  <i className="status-dot inactive" />
                  Inativos
                  <strong>{inactiveCount}</strong>
                </span>
              </div>
            </div>
          </aside>

          <nav className="homepage-actions" aria-label="Outras análises">
            <Link to="/ranking" className="analysis-link">
              <span className="analysis-link-icon" aria-hidden="true">
                ↗
              </span>

              <span className="analysis-link-content">
                <strong>Ranking de emissões</strong>
                <small>Compare os serviços por impacto</small>
              </span>

              <span className="analysis-link-arrow" aria-hidden="true">
                →
              </span>
            </Link>

            <Link to="/comparison" className="analysis-link">
              <span className="analysis-link-icon" aria-hidden="true">
                ⇄
              </span>

              <span className="analysis-link-content">
                <strong>Comparação</strong>
                <small>Analise diferenças entre operações</small>
              </span>

              <span className="analysis-link-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </nav>

          <section className="visualization-column">
            <div className="visualization-topline">
              <div className="visualization-heading">
                <span className="section-kicker">VISÃO GLOBAL</span>
                <h2>Explore o planeta</h2>
              </div>

              <div className="last-update">
                <span>Última atualização:</span>
                <strong>{timeUpdated || "-"}</strong>
              </div>

              <div
                className="view-switch"
                role="group"
                aria-label="Tipo de visualização"
              >
                <button
                  type="button"
                  className={mode === "globe" ? "active" : ""}
                  onClick={() => setMode("globe")}
                  aria-pressed={mode === "globe"}
                >
                  <span aria-hidden="true">◎</span>
                  Globo
                </button>

                <button
                  type="button"
                  className={mode === "map" ? "active" : ""}
                  onClick={() => setMode("map")}
                  aria-pressed={mode === "map"}
                >
                  <span aria-hidden="true">▦</span>
                  Mapa
                </button>
              </div>
            </div>

            <div className={`visualization-stage mode-${mode}`}>
              {mode === "globe" ? (
                <InteractiveGlobe
                  services={services}
                  selectedServiceId={selectedService}
                  onSelectService={setSelectedService}
                />
              ) : (
                <MapVisualization
                  services={services}
                  selectedServiceId={selectedService}
                  onSelectService={setSelectedService}
                />
              )}
            </div>

            <div className="visualization-caption">
              <span className="caption-symbol" aria-hidden="true">
                ✳
              </span>

              <p>
                {mode === "globe"
                  ? "Gire o globo e selecione os pontos para explorar cada operação."
                  : "Explore o mapa, aproxime as regiões e selecione um ponto para ver seus dados."}
              </p>

              <span className="coordinate-note">ATMOS ° / CO₂e</span>
            </div>
          </section>
        </section>
      </main>

      <footer className="homepage-footer">
        Desenvolvido por Atmos © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
