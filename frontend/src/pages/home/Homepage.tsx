import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AppHeader from "../../components/header/AppHeader";
import InteractiveGlobe from "./InteractiveGlobe";
import MapVisualization from "./MapVisualization";
import "./Homepage.css";

import { Skeleton } from "../../components/skeleton/Skeleton";
import { useSkeleton } from "../../components/skeleton/useSkeleton";
import {
  ServicesListSkeleton,
  StageSkeleton,
  inlineSkeleton,
} from "./HomepageSkeleton";

import {
  Globe2,
  Map,
  ArrowDownUp,
  Scale,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

import { port } from "../../utils/connection";
import type { ServiceStatus, ServiceType } from "../../types/service";
import Loading from "../../components/loading/Loading";

interface HomepageProps {
  lastUpdated?: string;
  updateTime?: number;
}

type VisualizationMode = "globe" | "map";
type GlobeVisualization = "services" | "emissions";

const statusLabels: Record<ServiceStatus, string> = {
  active: "Ativo",
  inactive: "Inativo",
  unavailable: "Indisponível",
};

export default function Homepage({ updateTime = 5 }: HomepageProps) {
  const [mode, setMode] = useState<VisualizationMode>("globe");

  const [globeVisualization, setGlobeVisualization] =
    useState<GlobeVisualization>("services");

  const [services, setServices] = useState<ServiceType[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [timeUpdated, setTimeUpdated] = useState<string>("");

  // Atualiza os serviços vindos do backend.
  async function updateServices() {
    try {
      const result = await fetch(
        `http://localhost:${port}/collections/all-service-data`,
      );

      if (!result.ok) {
        throw new Error("Não foi possível buscar os serviços.");
      }

      const data: ServiceType[] = await result.json();

      setServices(data);
      setTimeUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error("Erro ao atualizar serviços:", error);
    }
  }

  // Controla o tempo máximo de exibição do skeleton.
  const [gaveUp, setGaveUp] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setGaveUp(true), 15000);

    return () => clearTimeout(timer);
  }, []);

  const showSkeleton = useSkeleton(timeUpdated === "" && !gaveUp);

  // Atualização inicial e intervalo automático.
  useEffect(() => {
    updateServices();

    const refreshInterval = localStorage.getItem("refresh_interval");
    const configuredInterval = refreshInterval
      ? Number(refreshInterval) * 1000
      : updateTime * 1000;

    const interval =
      Number.isFinite(configuredInterval) && configuredInterval > 0
        ? configuredInterval
        : updateTime * 1000;

    const fetchTimer = setInterval(updateServices, interval);

    return () => clearInterval(fetchTimer);
  }, [updateTime]);

  // Contagem dos serviços por status.
  const activeCount = services.filter(
    (service) => service.status === "active",
  ).length;

  const inactiveCount = services.filter(
    (service) => service.status === "inactive",
  ).length;

  const unavailableCount = services.filter(
    (service) => service.status === "unavailable",
  ).length;

  return (
    <div className="homepage">
      {showSkeleton && <Loading />}
      <AppHeader />

      <main className="homepage-main">
        {/* Introdução principal da página */}
        <section className="intro-section">
          <div className="intro-copy">
            <h1>Explore o planeta</h1>
          </div>
          <div className="visualization-topline">
            {/* Atualização permanece junto à visualização */}
            <div className="last-update">
              <span>Última atualização:</span>

              {showSkeleton ? (
                <Skeleton width="10rem" height="1rem" />
              ) : (
                <strong>{timeUpdated || "-"}</strong>
              )}
            </div>

            <div className="visualization-controls">
              <div
                className="view-switch"
                role="group"
                aria-label="Tipo de visualização"
              >
                <button
                  disabled={showSkeleton}
                  type="button"
                  className={mode === "globe" ? "active" : ""}
                  onClick={() => setMode("globe")}
                  aria-pressed={mode === "globe"}
                >
                  <span aria-hidden="true">
                    <Globe2 />
                  </span>
                  Globo
                </button>

                <button
                  disabled={showSkeleton}
                  type="button"
                  className={mode === "map" ? "active" : ""}
                  onClick={() => setMode("map")}
                  aria-pressed={mode === "map"}
                >
                  <span aria-hidden="true">
                    <Map />
                  </span>
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
                    disabled={showSkeleton}
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
                    disabled={showSkeleton}
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
        </section>

        <section
          className="explorer-layout"
          aria-label="Explorador de serviços"
        >
          <aside className="services-panel">
            <div className="panel-heading">
              <div>
                <h2>Seus serviços</h2>
              </div>

              <span className="service-count">
                {showSkeleton ? (
                  <Skeleton width={24} height="1rem" style={inlineSkeleton} />
                ) : (
                  String(services.length).padStart(2, "0")
                )}
              </span>
            </div>

            <div className="services-list">
              {showSkeleton ? (
                <ServicesListSkeleton />
              ) : services.length === 0 ? (
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
                        {isSelected ? "−" : <ChevronRight size={18}/>}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            <details className="services-legend">
              <summary className="legend-title">
                <span>STATUS DOS SERVIÇOS</span>
                <ChevronDown className="legend-chevron" size={18}/>
              </summary>

              <div className="legend-items">
                <span>
                  <i className="status-dot active" />
                  Ativos
                  <strong>
                    {showSkeleton ? (
                      <Skeleton
                        width={18}
                        height="0.9rem"
                        style={inlineSkeleton}
                      />
                    ) : (
                      activeCount
                    )}
                  </strong>
                </span>

                <span>
                  <i className="status-dot inactive" />
                  Inativos
                  <strong>
                    {showSkeleton ? (
                      <Skeleton
                        width={18}
                        height="0.9rem"
                        style={inlineSkeleton}
                      />
                    ) : (
                      inactiveCount
                    )}
                  </strong>
                </span>

                <span>
                  <i className="status-dot unavailable" />
                  Indisponíveis
                  <strong>
                    {showSkeleton ? (
                      <Skeleton
                        width={18}
                        height="0.9rem"
                        style={inlineSkeleton}
                      />
                    ) : (
                      unavailableCount
                    )}
                  </strong>
                </span>
              </div>
            </details>
            {/* Navegação para outras análises */}
            <nav className="services-navigation" aria-label="Outras análises">
              <span className="services-navigation-title">ANÁLISES</span>

              <Link to="/ranking" className="services-navigation-link">
                <ArrowDownUp />

                <span>
                  <strong>Ranking</strong>
                  <small>Impacto por serviço</small>
                </span>
              </Link>

              <Link to="/comparison" className="services-navigation-link">
                <Scale />

                <span>
                  <strong>Comparação</strong>
                  <small>Diferenças entre operações</small>
                </span>
              </Link>
            </nav>
          </aside>

          <section className="visualization-column">
            <div className={`visualization-stage mode-${mode}`}>
              {showSkeleton ? (
                <StageSkeleton mode={mode} />
              ) : mode === "globe" ? (
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
