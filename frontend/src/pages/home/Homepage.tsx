
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AppHeader from "../../components/header/AppHeader";
import InteractiveGlobe from "./InteractiveGlobe";
import MapVisualization from "./MapVisualization";
import "./Homepage.css";
import Loading from "../../components/loading/Loading";

export type ServiceStatus = "active" | "incomplete" | "inactive";

export interface Service {
  id: string;
  name: string;
  location:
    | {
        city?: string;
        country?: string;
        latitude?: number;
        longitude?: number;
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
type GlobeVisualization = "services" | "emissions";

const statusLabels: Record<ServiceStatus, string> = {
  active: "Ativo",
  incomplete: "Incompleto",
  inactive: "Inativo",
};

export default function Homepage({ updateTime = 5 }: HomepageProps) {
  const [mode, setMode] = useState<VisualizationMode>("globe");

  const [globeVisualization, setGlobeVisualization] =
    useState<GlobeVisualization>("services");

  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [timeUpdated, setTimeUpdated] = useState<string>("");

  const [services, setServices] = useState<Service[]>([]);

  async function updateServices() {
    try {
      const result = await fetch(
        `http://localhost:${import.meta.env.VITE_PORT}/collections/all-service-data`,
      );

      if (!result.ok) {
        throw new Error("Não foi possível buscar os serviços.");
      }

      const data: Service[] = await result.json();

      setTimeUpdated(new Date().toLocaleString());
      setServices(data);
    } catch (error) {
      console.error("Erro ao atualizar serviços:", error);
    }
  }

  useEffect(() => {
    updateServices();

    const refreshInterval = localStorage.getItem("refresh_interval");

    const interval = refreshInterval
      ? Number(refreshInterval) * 1000
      : updateTime * 1000;

    const fetchTimer = setInterval(updateServices, interval);

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
      <Loading data={services} />
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
                <p className="services-empty">
                  Nenhum serviço foi encontrado.
                </p>
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

              <div className="visualization-controls">
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

                {mode === "globe" && (
                  <div
                    className="globe-view-switch"
                    role="group"
                    aria-label="Visualização do globo"
                  >
                    <button
                      type="button"
                      className={
                        globeVisualization === "services" ? "active" : ""
                      }
                      onClick={() => setGlobeVisualization("services")}
                      aria-pressed={globeVisualization === "services"}
                    >
                      <span aria-hidden="true">◎</span>
                      Serviços
                    </button>

                    <button
                      type="button"
                      className={
                        globeVisualization === "emissions" ? "active" : ""
                      }
                      onClick={() => setGlobeVisualization("emissions")}
                      aria-pressed={globeVisualization === "emissions"}
                    >
                      <span aria-hidden="true">◉</span>
                      Emissões
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className={`visualization-stage mode-${mode}`}>
              {mode === "globe" ? (
                <InteractiveGlobe
                  services={services}
                  selectedServiceId={selectedService}
                  onSelectService={setSelectedService}
                  visualization={globeVisualization}
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
                  ? globeVisualization === "services"
                    ? "Gire o globo e selecione os pontos para explorar cada operação."
                    : "Visualize a concentração de emissões de CO₂e nas regiões monitoradas."
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
