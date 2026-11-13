import { useEffect, useMemo, useRef, useState } from "react";

import type { Service } from "./Homepage";
import useTheme from "../../hooks/useTheme";
import ServiceCard from "./ServiceCard";

import Globe3D, { type GlobePoint } from "./globes/Globe3D";

import GlobeEmissions, { type EmissionDataset } from "./globes/GlobeEmissions";

import "./InteractiveGlobe.css";

type GlobeVisualization = "services" | "emissions";

interface InteractiveGlobeProps {
  services: Service[];
  selectedServiceId: string | null;
  onSelectService: (id: string | null) => void;
  visualization: GlobeVisualization;
}

const statusColors: Record<Service["status"], string> = {
  active: "#91bd79",
  incomplete: "#e0d344",
  inactive: "#df7779",
};

export default function InteractiveGlobe({
  services,
  selectedServiceId,
  onSelectService,
  visualization,
}: InteractiveGlobeProps) {
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [dimensions, setDimensions] = useState({
    width: 600,
    height: 500,
  });

  const { mode } = useTheme();

  // Prepara os pontos dos serviços com coordenadas válidas.
  const globeData = useMemo<GlobePoint[]>(() => {
    return services.flatMap((service) => {
      const lat = service.location?.latitude;
      const lng = service.location?.longitude;

      const validCoordinates =
        typeof lat === "number" &&
        typeof lng === "number" &&
        Number.isFinite(lat) &&
        Number.isFinite(lng) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180;

      if (!validCoordinates) return [];

      return [
        {
          id: service.id,
          name: service.name,
          lat,
          lng,
          color: statusColors[service.status] ?? "#999999",
          cpu_percent:
            typeof service.metrics?.cpu_percent === "number" &&
            Number.isFinite(service.metrics.cpu_percent)
              ? service.metrics.cpu_percent
              : 0,
        },
      ];
    });
  }, [services]);

  // Prepara os dados de emissões para o heatmap.

  const emissionDatasets = useMemo<EmissionDataset[]>(() => {
    const points = services.flatMap((service) => {
      const lat = service.location?.latitude;
      const lng = service.location?.longitude;
      const co2e = service.metrics?.co2e;

      const validCoordinates =
        typeof lat === "number" &&
        typeof lng === "number" &&
        Number.isFinite(lat) &&
        Number.isFinite(lng) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180;

      const validEmission =
        typeof co2e === "number" && Number.isFinite(co2e) && co2e > 0;

      if (!validCoordinates || !validEmission) {
        return [];
      }

      return [
        {
          lat,
          lng,
          weight: co2e,
        },
      ];
    });

    if (points.length === 0) {
      return [];
    }

    const maxEmission = points.reduce(
      (max, point) => Math.max(max, point.weight),
      0,
    );

    return [
      {
        points: points.map((point) => ({
          ...point,
          weight: point.weight / maxEmission,
        })),
      },
    ];
  }, [services]);

  // Serviço atualmente selecionado.
  const selectedService = useMemo(
    () => services.find((service) => service.id === selectedServiceId),
    [services, selectedServiceId],
  );

  // Ponto correspondente ao serviço selecionado.
  const selectedPoint = useMemo(
    () => globeData.find((point) => point.id === selectedServiceId),
    [globeData, selectedServiceId],
  );

  // Pausa a rotação automática quando o cursor entra no globo.
  const handleMouseEnter = () => {
    if (visualization === "services" && globeRef.current) {
      globeRef.current.controls().autoRotate = false;
    }
  };

  // Retoma a rotação quando o cursor sai, caso nada esteja selecionado.
  const handleMouseLeave = () => {
    if (visualization === "services" && globeRef.current) {
      globeRef.current.controls().autoRotate = !selectedServiceId;
    }
  };

  // Fecha o card quando o usuário clica fora do componente.
  useEffect(() => {
    if (!selectedServiceId) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) return;

      // Trocar de visualização não deve limpar a seleção.
      if (
        target instanceof Element &&
        target.closest(".view-switch, .globe-view-switch")
      ) {
        return;
      }

      if (containerRef.current && !containerRef.current.contains(target)) {
        onSelectService(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedServiceId, onSelectService]);

  // Ajusta as dimensões do globo ao tamanho do contêiner.
  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;

      const { width, height } = entry.contentRect;

      if (width > 0 && height > 0) {
        setDimensions({ width, height });
      }
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  // Define a posição inicial quando o globo de serviços é exibido.
  useEffect(() => {
    if (visualization !== "services") return;
    if (!globeRef.current) return;

    globeRef.current.pointOfView(
      {
        lat: 20,
        lng: 0,
        altitude: 1.75,
      },
      0,
    );
  }, [dimensions.width, dimensions.height, visualization]);

  // Centraliza o ponto selecionado no globo.
  useEffect(() => {
    if (visualization !== "services") return;
    if (!selectedPoint || !globeRef.current) return;

    globeRef.current.pointOfView(
      {
        lat: selectedPoint.lat,
        lng: selectedPoint.lng,
        altitude: 1.75,
      },
      1000,
    );

    globeRef.current.controls().autoRotate = false;
  }, [selectedPoint, visualization]);

  // Renderização.
  return (
    <div
      ref={containerRef}
      className="globe-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {visualization === "services" ? (
        <>
          <Globe3D
            globeRef={globeRef}
            points={globeData}
            width={dimensions.width}
            height={dimensions.height}
            mode={mode}
            selectedPointId={selectedServiceId}
            onSelectPoint={(id) => {
              onSelectService(id === selectedServiceId ? null : id);
            }}
            onPointHover={(hovered) => {
              const canvas = containerRef.current?.querySelector("canvas");

              if (canvas) {
                canvas.style.cursor = hovered ? "pointer" : "";
              }
            }}
          />

          {selectedPoint && selectedService && (
            <ServiceCard
              viewType="globe"
              selectedServicePoint={selectedService}
              onSelectService={onSelectService}
            />
          )}
        </>
      ) : (
        <GlobeEmissions
          width={dimensions.width}
          height={dimensions.height}
          mode={mode}
          datasets={emissionDatasets}
        />
      )}
    </div>
  );
}
