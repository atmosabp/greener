import { useEffect, useMemo, useRef, useState } from "react";
import Globe from "react-globe.gl";
import type { Service } from "./Homepage";
import "./InteractiveGlobe.css";
import useTheme from "../../hooks/useTheme";

interface InteractiveGlobeProps {
    services: Service[];
    selectedServiceId: string | null;
    onSelectService: (id: string | null) => void;
}

interface GlobePoint {
    id: string;
    name: string;
    status: string;
    lat: number;
    lng: number;
    color: string;
    co2e: number;
}

const statusColors: Record<string, string> = {
    active: "#91bd79",
    incomplete: "#e0d344",
    inactive: "#df7779",
};

const statusLabels: Record<string, string> = {
    active: "Ativo",
    incomplete: "Incompleto",
    inactive: "Inativo",
};

export default function InteractiveGlobe({
    services,
    selectedServiceId,
    onSelectService,
}: InteractiveGlobeProps) {
    const globeRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({
        width: 600,
        height: 500,
    });

    const { mode } = useTheme();

    const globeData = useMemo<GlobePoint[]>(() => {
        return services
            .filter((service) => {
                const lat = service.latitude;
                const lng = service.longitude;

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
            })
            .map((service) => ({
                id: service.id,
                name: service.name,
                status: service.status,
                lat: service.latitude!,
                lng: service.longitude!,
                color: statusColors[service.status] ?? "#999999",
                co2e:
                    typeof service.co2e === "number" &&
                    Number.isFinite(service.co2e)
                        ? service.co2e
                        : 0,
            }));
    }, [services]);

    const selectedPoint = useMemo(
        () => globeData.find((point) => point.id === selectedServiceId),
        [globeData, selectedServiceId],
    );

    const handleMouseEnter = () => {
        if (globeRef.current) {
            globeRef.current.controls().autoRotate = false;
        }
    };

    const handleMouseLeave = () => {
        if (globeRef.current) {
            globeRef.current.controls().autoRotate = !selectedServiceId;
        }
    };

    // Fecha o card ao clicar fora
    useEffect(() => {
        if (!selectedServiceId) return;

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            
            // Verifica se o clique foi fora do container do globo e dos cards
            const isInsideGlobe = containerRef.current?.contains(target);
            const isCard = target.closest(".globe-service-card");

            if (!isInsideGlobe && !isCard) {
                onSelectService(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [selectedServiceId, onSelectService]);

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

    useEffect(() => {
        globeRef.current?.pointOfView(
            { lat: 20, lng: 0, altitude: 1.75 },
            0,
        );
    }, [dimensions.width, dimensions.height]);

    useEffect(() => {
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
    }, [selectedPoint]);

    const createServiceCard = (point: object) => {
        const service = point as GlobePoint;
        const card = document.createElement("div");
        card.className = "globe-service-card";

        const statusDot = document.createElement("span");
        statusDot.className = "globe-service-card__status-dot";
        statusDot.style.backgroundColor = service.color;

        const title = document.createElement("strong");
        title.className = "globe-service-card__title";
        title.textContent = service.name;

        const location = document.createElement("div");
        location.className = "globe-service-card__location";
        location.textContent = `Lat: ${service.lat.toFixed(3)} | Long: ${service.lng.toFixed(3)}`;

        const metricsGrid = document.createElement("div");
        metricsGrid.className = "globe-service-card__metrics";

        const metricLeft = document.createElement("div");
        metricLeft.className = "globe-service-card__metric-col";
        
        const cpu = document.createElement("div");
        cpu.className = "globe-service-card__metric";
        cpu.innerHTML = `<span>CPU:</span> <strong>10%</strong>`;
        
        const ram = document.createElement("div");
        ram.className = "globe-service-card__metric";
        ram.innerHTML = `<span>RAM:</span> <strong>${Math.floor(Math.random() * 100)}%</strong>`;
        
        metricLeft.append(cpu, ram);

        const metricRight = document.createElement("div");
        metricRight.className = "globe-service-card__metric-col";
        
        const kwh = document.createElement("div");
        kwh.className = "globe-service-card__metric";
        kwh.innerHTML = `<span>Kwh:</span> <strong>${Math.floor(Math.random() * 20)}</strong>`;
        
        const co2e = document.createElement("div");
        co2e.className = "globe-service-card__metric";
        co2e.innerHTML = `<span>CO²e:</span> <strong>${service.co2e}</strong>`;
        
        metricRight.append(kwh, co2e);

        metricsGrid.append(metricLeft, metricRight);

        const button = document.createElement("button");
        button.className = "globe-service-card__button";
        button.type = "button";
        button.textContent = "Ver detalhes";
        button.addEventListener("click", (e) => {
            e.stopPropagation();
            onSelectService(service.id);
        });

        card.append(statusDot, title, location, metricsGrid, button);

        return card;
    };

    return (
        <div
            ref={containerRef}
            className="globe-container"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Globe
                ref={globeRef}
                width={dimensions.width}
                height={dimensions.height}
                backgroundColor="rgba(0,0,0,0)"
                globeImageUrl={
                    mode === "dark"
                        ? "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                        : "//unpkg.com/three-globe/example/img/earth-day.jpg"
                }
                pointsData={globeData}
                pointLat="lat"
                pointLng="lng"
                pointAltitude={0.001}
                pointsMerge={false}
                pointColor={(point: object) => {
                    const service = point as GlobePoint;
                    return service.id === selectedServiceId
                        ? "#ffffff"
                        : service.color;
                }}
                pointRadius={(point: object) => {
                    const service = point as GlobePoint;
                    return service.id === selectedServiceId ? 2 : 1.5;
                }}
                onPointClick={(point: object) => {
                    const service = point as GlobePoint;
                    onSelectService(
                        service.id === selectedServiceId ? null : service.id,
                    );
                }}
                htmlElementsData={selectedPoint ? [selectedPoint] : []}
                htmlLat="lat"
                htmlLng="lng"
                htmlAltitude={0.35}
                htmlElement={createServiceCard}
                htmlTransitionDuration={250}
                onGlobeReady={() => {
                    if (!globeRef.current) return;

                    const controls = globeRef.current.controls();
                    controls.enablePan = false;
                    controls.autoRotate = !selectedServiceId;
                    controls.autoRotateSpeed = 0.7;
                }}
                atmosphereColor={mode === "dark" ? "#ffffff" : "#000000"}
                atmosphereAltitude={0.2}
            />
        </div>
    );
}