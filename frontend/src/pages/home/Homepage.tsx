
import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/header/Header";
import InteractiveGlobe from "./InteractiveGlobe";
import MapVisualization from "./MapVisualization";
import "./Homepage.css";

export type ServiceStatus = "active" | "incomplete" | "inactive";

export interface Service {
  id: string;
  name: string;
  status: ServiceStatus;
  latitude?: number;
  longitude?: number;
  co2e?: number;
}

interface HomepageProps {
  services?: Service[];
  lastUpdated?: string;
}

type VisualizationMode = "globe" | "map";

const mockServices: Service[] = [
  {
    id: "1",
    name: "Data Center São Paulo",
    status: "active",
    latitude: -23.5505,
    longitude: -46.6333,
    co2e: 120,
  },
  {
    id: "2",
    name: "Fábrica Nova York",
    status: "incomplete",
    latitude: 40.7128,
    longitude: -74.006,
    co2e: 340,
  },
  {
    id: "3",
    name: "Escritório Londres",
    status: "inactive",
    latitude: 51.5074,
    longitude: -0.1278,
    co2e: 0,
  },
  {
    id: "4",
    name: "Hub Tóquio",
    status: "active",
    latitude: 35.6895,
    longitude: 139.6917,
    co2e: 85,
  },
  {
    id: "5",
    name: "Hub Tóquio",
    status: "active",
    latitude: 35.6895,
    longitude: 150.6917,
    co2e: 85,
  },
  {
    id: "6",
    name: "Hub Tóquio",
    status: "active",
    latitude: 35.6895,
    longitude: 5.6917,
    co2e: 85,
  },
  {
    id: "6",
    name: "Hub Tóquio",
    status: "active",
    latitude: 35.6895,
    longitude: 5.6917,
    co2e: 85,
  },
  {
    id: "6",
    name: "Hub Tóquio",
    status: "active",
    latitude: 35.6895,
    longitude: 5.6917,
    co2e: 85,
  },
  {
    id: "6",
    name: "Hub Tóquio",
    status: "active",
    latitude: 35.6895,
    longitude: 5.6917,
    co2e: 85,
  },
  {
    id: "6",
    name: "Hub Tóquio",
    status: "active",
    latitude: 35.6895,
    longitude: 5.6917,
    co2e: 85,
  },
  {
    id: "6",
    name: "Hub Tóquio",
    status: "active",
    latitude: 35.6895,
    longitude: 5.6917,
    co2e: 85,
  },
  {
    id: "6",
    name: "Hub Tóquio",
    status: "active",
    latitude: 35.6895,
    longitude: 5.6917,
    co2e: 85,
  },
  {
    id: "6",
    name: "Hub Tóquio",
    status: "active",
    latitude: 35.6895,
    longitude: 5.6917,
    co2e: 85,
  },
];

const statusLabels: Record<ServiceStatus, string> = {
  active: "Ativo",
  incomplete: "Incompleto",
  inactive: "Inativo",
};

export default function Homepage({
  services = mockServices,
  lastUpdated = "16/10/2026 08:00",
}: HomepageProps) {
  const [mode, setMode] = useState<VisualizationMode>("globe");
  const [selectedService, setSelectedService] = useState<string | null>(null);

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
      <Header />

      <main className="homepage-main">
        <section className="explorer-layout" aria-label="Explorador de serviços">
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
                  Nenhum serviço disponível no momento.
                </p>
              ) : (
                services.map((service, index) => {
                  const isSelected = selectedService === service.id;

                  return (
                    <button
                      key={service.id}
                      type="button"
                      className={`service-item ${isSelected ? "service-item-selected" : ""
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
                  Ativos <strong>{activeCount}</strong>
                </span>

                <span>
                  <i className="status-dot incomplete" />
                  Incompletos <strong>{incompleteCount}</strong>
                </span>

                <span>
                  <i className="status-dot inactive" />
                  Inativos <strong>{inactiveCount}</strong>
                </span>
              </div>
            </div>
          </aside>

          <section className="visualization-column">
            <div className="visualization-topline">
              <div className="visualization-heading">
                <span className="section-kicker">VISÃO GLOBAL</span>
                <h2>Explore o planeta</h2>
              </div>

              <div className="last-update">
                <span>Última atualização:</span>
                <strong>{lastUpdated}</strong>
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

        <nav className="homepage-actions" aria-label="Outras análises">
          <Link to="/ranking" className="analysis-link">
            <span className="analysis-link-icon" aria-hidden="true">
              ↗
            </span>
            <span>
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
            <span>
              <strong>Comparação</strong>
              <small>Analise diferenças entre operações</small>
            </span>
            <span className="analysis-link-arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </nav>
      </main>

      <footer className="homepage-footer">
        Desenvolvido por Atmos ° © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
