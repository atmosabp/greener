
import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/header/Header";
import InteractiveGlobe from "./InteractiveGlobe";
import "./Homepage.css";

export type ServiceStatus = "active" | "incomplete" | "inactive";

export interface Service {
  id: string;
  name: string;
  status: ServiceStatus;
}

interface HomepageProps {
  services?: Service[];
  lastUpdated?: string;
}

type VisualizationMode = "globe" | "map";

const statusLabels: Record<ServiceStatus, string> = {
  active: "Ativo",
  incomplete: "Incompleto",
  inactive: "Inativo",
};

export default function Homepage({
  services = [],
  lastUpdated,
}: HomepageProps) {
  const [mode, setMode] = useState<VisualizationMode>("globe");
  const [selectedService, setSelectedService] =
    useState<string | null>(null);

  const activeCount = services.filter(
    (service) => service.status === "active"
  ).length;

  const incompleteCount = services.filter(
    (service) => service.status === "incomplete"
  ).length;

  const inactiveCount = services.filter(
    (service) => service.status === "inactive"
  ).length;

  const selected = services.find(
    (service) => service.id === selectedService
  );

  return (
    <div className="homepage">
      <Header />

      <main className="homepage-main">
        <aside className="services-column">
          <p className="last-update">
            Última atualização:{" "}
            <span>{lastUpdated ?? "--:--"}</span>
          </p>

          <section className="services-panel">
            <h1>Lista de Serviços</h1>

            <div className="services-list">
              {services.length === 0 ? (
                <p className="services-empty">
                  Nenhum serviço disponível.
                </p>
              ) : (
                services.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    className={`service-item ${
                      selectedService === service.id
                        ? "service-item-selected"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedService((current) =>
                        current === service.id
                          ? null
                          : service.id
                      )
                    }
                    aria-pressed={selectedService === service.id}
                  >
                    <span
                      className={`status-dot ${service.status}`}
                      aria-hidden="true"
                    />

                    <span className="service-name">
                      {service.name}
                    </span>

                    <span className="service-arrow" aria-hidden="true">
                      →
                    </span>
                  </button>
                ))
              )}
            </div>

            {selected && (
              <div className="service-details">
                <span>Serviço selecionado</span>
                <strong>{selected.name}</strong>
                <span>
                  Status: {statusLabels[selected.status]}
                </span>
              </div>
            )}

            <div className="status-legend">
              <span>
                <i className="status-dot active" />
                Ativo ({activeCount})
              </span>

              <span>
                <i className="status-dot incomplete" />
                Incompleto ({incompleteCount})
              </span>

              <span>
                <i className="status-dot inactive" />
                Inativo ({inactiveCount})
              </span>
            </div>
          </section>

          <nav className="quick-actions" aria-label="Navegação do dashboard">
            <Link to="/ranking" className="quick-button">
              Ranking
            </Link>

            <Link to="/comparacao" className="quick-button">
              Comparação
            </Link>
          </nav>
        </aside>

        <section className="visualization-column">
          <div className="visualization-stage">
            {mode === "globe" ? (
              <InteractiveGlobe />
            ) : (
              <div className="map-placeholder">
                <span className="map-placeholder-icon">⌖</span>
                <h2>Mapa de monitoramento</h2>
                <p>
                  A visualização geográfica será integrada aos dados
                  de localização da API.
                </p>
              </div>
            )}
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
              Globo
            </button>

            <button
              type="button"
              className={mode === "map" ? "active" : ""}
              onClick={() => setMode("map")}
              aria-pressed={mode === "map"}
            >
              Mapa
            </button>
          </div>
        </section>
      </main>

      <footer className="homepage-footer">
        Desenvolvido por Atmos ° © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
