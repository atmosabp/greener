
import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import type { Service } from "./Homepage";
import useTheme from "../../hooks/useTheme";
import ServiceCard from "./ServiceCard";
import Globe3D, { type GlobePoint } from "./globes/Globe3D";
import GlobeEmissions, {
    type EmissionDataset,
} from "./globes/GlobeEmissions";

import "./InteractiveGlobe.css";

interface InteractiveGlobeProps {
    services: Service[];
    selectedServiceId: string | null;
    onSelectService: (id: string | null) => void;
    visualization: "services" | "emissions";
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

    // Dados utilizados na visualização de serviços.
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

            return [{
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
            }];
        });
    }, [services]);

    // Dados utilizados na visualização de emissões.
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
                typeof co2e === "number" &&
                Number.isFinite(co2e) &&
                co2e > 0;

            if (!validCoordinates || !validEmission) {
                return [];
            }

            return [{
                lat,
                lng,
                weight: co2e,
            }];
        });

        return points.length > 0 ? [{ points }] : [];
    }, [services]);

    // Diagnóstico dos dados recebidos pela visualização de emissões.
    useEffect(() => {
        const servicesWithCoordinates = services.filter((service) => {
            const lat = service.location?.latitude;
            const lng = service.location?.longitude;

            return (
                typeof lat === "number" &&
                typeof lng === "number" &&
                Number.isFinite(lat) &&
                Number.isFinite(lng) &&
                lat >= -90 &&
                lat <= 90 &&
                lng >= -180 &&
                lng <= 180
            );
        });

        const servicesWithValidEmissions = services.filter((service) => {
            const lat = service.location?.latitude;
            const lng = service.location?.longitude;
            const co2e = service.metrics?.co2e;

            return (
                typeof lat === "number" &&
                typeof lng === "number" &&
                Number.isFinite(lat) &&
                Number.isFinite(lng) &&
                lat >= -90 &&
                lat <= 90 &&
                lng >= -180 &&
                lng <= 180 &&
                typeof co2e === "number" &&
                Number.isFinite(co2e) &&
                co2e > 0
            );
        });

        const totalPoints = emissionDatasets.reduce(
            (total, dataset) => total + dataset.points.length,
            0
        );

        console.log("===== DIAGNÓSTICO DO HEATMAP =====");
        console.log("Total de serviços recebidos:", services.length);
        console.log(
            "Serviços com coordenadas válidas:",
            servicesWithCoordinates.length
        );
        console.log(
            "Serviços com emissões válidas:",
            servicesWithValidEmissions.length
        );
        console.log("Pontos enviados ao heatmap:", totalPoints);
        console.log("=================================");
    }, [services, emissionDatasets]);

    const selectedService = useMemo(
        () =>
            services.find(
                (service) => service.id === selectedServiceId
            ),
        [services, selectedServiceId]
    );

    const selectedPoint = useMemo(
        () =>
            globeData.find(
                (point) => point.id === selectedServiceId
            ),
        [globeData, selectedServiceId]
    );

    // Para a rotação quando o mouse entra no globo.
    const handleMouseEnter = () => {
        if (!globeRef.current) return;

        globeRef.current.controls().autoRotate = false;
    };

    // Retoma a rotação quando o mouse sai do globo.
    // Mantém o globo parado enquanto houver um serviço selecionado.
    const handleMouseLeave = () => {
        if (!globeRef.current) return;

        globeRef.current.controls().autoRotate =
            !selectedServiceId;
    };

    // Fecha o cartão quando o usuário clica fora do globo.
    useEffect(() => {
        if (
            !selectedServiceId ||
            visualization !== "services"
        ) {
            return;
        }

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target;

            if (!(target instanceof Node)) return;

            if (
                target instanceof Element &&
                target.closest(".view-switch, .globe-view-switch")
            ) {
                return;
            }

            if (
                containerRef.current &&
                !containerRef.current.contains(target)
            ) {
                onSelectService(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, [
        selectedServiceId,
        visualization,
        onSelectService,
    ]);

    // Atualiza as dimensões do globo conforme o container.
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

    // Posicionamento inicial da visualização de serviços.
    useEffect(() => {
        if (visualization !== "services") return;

        globeRef.current?.pointOfView(
            { lat: 20, lng: 0, altitude: 1.75 },
            0
        );
    }, [
        dimensions.width,
        dimensions.height,
        visualization,
    ]);

    // Centraliza o globo no serviço selecionado.
    useEffect(() => {
        if (
            visualization !== "services" ||
            !selectedPoint ||
            !globeRef.current
        ) {
            return;
        }

        globeRef.current.pointOfView(
            {
                lat: selectedPoint.lat,
                lng: selectedPoint.lng,
                altitude: 1.75,
            },
            1000
        );

        globeRef.current.controls().autoRotate = false;
    }, [selectedPoint, visualization]);

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
                            onSelectService(
                                id === selectedServiceId ? null : id
                            );
                        }}
                        onPointHover={(hovered) => {
                            const canvas =
                                containerRef.current?.querySelector("canvas");

                            if (canvas) {
                                canvas.style.cursor = hovered
                                    ? "pointer"
                                    : "";
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
                    globeRef={globeRef}
                    width={dimensions.width}
                    height={dimensions.height}
                    mode={mode}
                    datasets={emissionDatasets}
                    selectedPoint={
                        selectedPoint
                            ? {
                                lat: selectedPoint.lat,
                                lng: selectedPoint.lng,
                            }
                            : null
                    }
                />
            )}
        </div>
    );
}
