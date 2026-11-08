import { Link } from "react-router-dom";
import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import Globe from "react-globe.gl";
import type { Service } from "./Homepage";
import "./InteractiveGlobe.css";
import useTheme from "../../hooks/useTheme";
import ServiceCard from "./ServiceCard";

interface InteractiveGlobeProps {
    services: Service[];
    selectedServiceId: string | null;
    onSelectService: (id: string | null) => void;
}

interface GlobePoint {
    id: string;
    name: string;
    status: Service["status"];
    lat: number | undefined;
    lng: number | undefined;
    color: string;
    cpu_percent: number;
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
}: InteractiveGlobeProps) {
    const globeRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [dimensions, setDimensions] = useState({
        width: 600,
        height: 500,
    });

    const { mode } = useTheme();

    // Prepara os pontos que possuem coordenadas válidas.
    const globeData = useMemo<GlobePoint[]>(() => {
        return services
            .filter((service) => {
                const lat = service.location ? service.location.latitude : undefined;
                const lng = service.location ? service.location.longitude : undefined;

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
                lat: service.location ? service.location.latitude : 0,
                lng: service.location ? service.location.longitude : 0,
                color: statusColors[service.status] ?? "#999999",
                cpu_percent:
                    typeof service.metrics?.cpu_percent=== "number" &&
                        Number.isFinite(service.metrics.cpu_percent)
                        ? service.metrics.cpu_percent
                        : 0,
            }));
    }, [services]);

    const validMapServices = services.filter(
    (service) =>
      service.location &&
      service.location.latitude !== undefined &&
      service.location.longitude !== undefined &&
      Number.isFinite(service.location.latitude) &&
      Number.isFinite(service.location.longitude) &&
      service.location.latitude >= -90 &&
      service.location.latitude <= 90 &&
      service.location.longitude >= -180 &&
      service.location.longitude <= 180,
  );

    const selectedService = validMapServices.find(
        (service) => service.id === selectedServiceId,
    );

    const selectedPoint = useMemo(
        () =>
            globeData.find(
                (point) => point.id === selectedServiceId
            ),
        [globeData, selectedServiceId]
    );

    // Pausa a rotação automática quando o cursor entra no globo.
    const handleMouseEnter = () => {
        if (globeRef.current) {
            globeRef.current.controls().autoRotate = false;
        }
    };

    // Retoma a rotação quando o cursor sai, desde que nada esteja selecionado.
    const handleMouseLeave = () => {
        if (globeRef.current) {
            globeRef.current.controls().autoRotate =
                !selectedServiceId;
        }
    };

    // Fecha o card quando o usuário clica fora do componente.
    useEffect(() => {
        if (!selectedServiceId) return;

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target;

            if (!(target instanceof Node)) return;

            // Trocar entre Globo e Mapa não deve limpar a seleção.
            if (
                target instanceof Element &&
                target.closest(".view-switch")
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

    // Posição inicial do globo.
    useEffect(() => {
        globeRef.current?.pointOfView(
            { lat: 20, lng: 0, altitude: 1.75 },
            0
        );
    }, [dimensions.width, dimensions.height]);

    // Centraliza o ponto selecionado sem posicionar o card sobre ele.
    useEffect(() => {
        if (!selectedPoint || !globeRef.current) return;

        globeRef.current.pointOfView(
            {
                lat: selectedPoint.lat,
                lng: selectedPoint.lng,
                altitude: 1.75,
            },
            1000
        );

        globeRef.current.controls().autoRotate = false;
    }, [selectedPoint]);

    // Mantém o globo e o card como elementos independentes.
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
                pointsData={[
                    ...globeData.map((point) => ({
                        ...point,
                        isOutline: true,
                    })),
                    ...globeData.map((point) => ({
                        ...point,
                        isOutline: false,
                    })),
                ]}
                pointLat="lat"
                pointLng="lng"
                onPointHover={(point) => {
                    const canvas =
                        containerRef.current?.querySelector("canvas");

                    if (canvas) {
                        canvas.style.cursor = point ? "pointer" : "";
                    }
                }}
                pointAltitude={(point: object) => {
                    const service = point as GlobePoint & { isOutline?: boolean };

                    if (service.isOutline) {
                        return service.id === selectedServiceId ? 0.001 : 0.001;
                    }

                    return service.id === selectedServiceId ? 0.005 : 0.003;
                }}
                pointsMerge={false}
                pointColor={(point: object) => {
                    const service = point as GlobePoint & { isOutline?: boolean };

                    if (service.isOutline) {
                        return "#111111";
                    }

                    return service.id === selectedServiceId
                        ? "#ffffff"
                        : service.color;
                }}
                pointRadius={(point: object) => {
                    const service = point as GlobePoint & { isOutline?: boolean };

                    if (service.isOutline) {
                        return service.id === selectedServiceId ? 2.2 : 1.6;
                    }

                    return service.id === selectedServiceId ? 1.8 : 1.2;
                }}
                onPointClick={(point: object) => {
                    const service = point as GlobePoint;

                    onSelectService(
                        service.id === selectedServiceId
                            ? null
                            : service.id
                    );
                }}
                onGlobeReady={() => {
                    if (!globeRef.current) return;

                    const controls = globeRef.current.controls();

                    controls.enablePan = false;
                    controls.autoRotate = !selectedServiceId;
                    controls.autoRotateSpeed = 0.7;
                }}
                atmosphereColor={
                    mode === "dark" ? "#ffffff" : "#000000"
                }
                atmosphereAltitude={0.2}
            />

            {selectedPoint && selectedService && (
                <div>
                    <ServiceCard viewType={"globe"} selectedServicePoint={selectedService} onSelectService={onSelectService}/>
                {/* <div
                    className="globe-service-card"
                    role="dialog"
                    aria-label={`Detalhes de ${selectedPoint.name}`}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onMouseDown={(event) => event.stopPropagation()}
                >
                    <div className="globe-service-card__header">
                        <span
                            className="globe-service-card__status-dot"
                            style={{
                                backgroundColor: selectedPoint.color,
                            }}
                        />

                        <strong className="globe-service-card__title">
                            {selectedPoint.name}
                        </strong>

                        <button
                            type="button"
                            className="globe-service-card__close"
                            aria-label="Fechar detalhes"
                            onClick={() => onSelectService(null)}
                        >
                            ×
                        </button>
                    </div>

                    <div className="globe-service-card__location">
                        {(selectedPoint.lat != undefined && selectedPoint.lng != undefined) 
                        ? 
                            <span>Lat: {selectedPoint.lat!.toFixed(3)}| Long:{" "}
                            {selectedPoint.lng!.toFixed(3)}</span> 
                            :
                            <p>oie</p>
                        }
                    </div>

                    <div className="globe-service-card__metrics">
                        <div className="globe-service-card__metric-col">
                            <div className="globe-service-card__metric">
                                <span>CPU</span>
                                <strong>
                                    {selectedPoint.cpu_percent.toLocaleString(
                                        "pt-BR"
                                    )}{" "}
                                    %
                                </strong>
                            </div>

                            <div className="globe-service-card__metric">
                                <span>CO₂e</span>
                                <strong>
                                    {selectedPoint.cpu_percent.toLocaleString(
                                        "pt-BR"
                                    )}{" "}
                                    kg
                                </strong>
                            </div>
                        </div>

                        <div className="globe-service-card__metric-col">
                            <div className="globe-service-card__metric">
                                <span>RAM</span>
                                <strong>0%</strong>
                            </div>

                            <div className="globe-service-card__metric">
                                <span>Energia (kWh)</span>
                                <strong>0 kWh</strong>
                            </div>
                        </div>
                    </div>

                    <Link
                        to="/dashboard"
                        className="globe-service-card__details-button"
                    >
                        Ver detalhes
                    </Link>
                </div> */}
                </div>
            )}
        </div>
    );
}
