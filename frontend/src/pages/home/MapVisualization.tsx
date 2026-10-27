import { Link } from "react-router-dom";
import { useEffect } from "react";
import {
    CircleMarker,
    MapContainer,
    TileLayer,
    useMap,
} from "react-leaflet";
import type { Service } from "./Homepage";
import "leaflet/dist/leaflet.css";
import "./MapVisualization.css";

interface MapVisualizationProps {
    services: Service[];
    selectedServiceId: string | null;
    onSelectService: (id: string | null) => void;
}

const mapStatusColors: Record<Service["status"], string> = {
    active: "#91bd79",
    incomplete: "#e0d344",
    inactive: "#df7779",
};

function MapController({
    selectedService,
    onSelectService,
}: {
    selectedService?: Service;
    onSelectService: (id: string | null) => void;
}) {
    const map = useMap();

    // Centraliza o mapa no serviço selecionado.
    useEffect(() => {
        if (!selectedService) return;

        const { latitude, longitude } = selectedService.location;

        if (
            latitude === undefined ||
            longitude === undefined ||
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude)
        ) {
            return;
        }

        map.flyTo([latitude, longitude], 5, {
            duration: 1,
        });
    }, [map, selectedService]);

    // Limpa a seleção ao clicar em uma área vazia do mapa.
    useEffect(() => {
        const clearMapSelection = () => onSelectService(null);

        map.on("click", clearMapSelection);

        return () => {
            map.off("click", clearMapSelection);
        };
    }, [map, onSelectService]);

    return null;
}

export default function MapVisualization({
    services,
    selectedServiceId,
    onSelectService,
}: MapVisualizationProps) {
    // Mantém apenas serviços com coordenadas válidas.
    const validMapServices = services.filter(
        (service) =>
            service.location.latitude !== undefined &&
            service.location.longitude !== undefined &&
            Number.isFinite(service.location.latitude) &&
            Number.isFinite(service.location.longitude) &&
            service.location.latitude >= -90 &&
            service.location.latitude <= 90 &&
            service.location.longitude >= -180 &&
            service.location.longitude <= 180
    );

    const selectedMapService = validMapServices.find(
        (service) => service.id === selectedServiceId
    );

    // Coordenadas próprias da visualização do mapa.
    const selectedMapPoint = selectedMapService
        ? {
            latitude: selectedMapService.location.latitude!,
            longitude: selectedMapService.location.longitude!,
        }
        : null;

    const mapVerticalBounds: [
        [number, number],
        [number, number],
    ] = [
            [-85, -360],
            [85, 360],
        ];

    return (
        <div className="map-visualization">
            <MapContainer
                center={[20, 0]}
                zoom={2}
                minZoom={2}
                maxZoom={15}
                scrollWheelZoom
                worldCopyJump
                className="atmos-map"
                maxBounds={mapVerticalBounds}
                maxBoundsViscosity={1.0}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController
                    selectedService={selectedMapService}
                    onSelectService={onSelectService}
                />

                {validMapServices.map((service) => {
                    const isMapServiceSelected =
                        service.id === selectedServiceId;

                    return (
                        <CircleMarker
                            key={service.id}
                            center={[
                                service.location.latitude!,
                                service.location.longitude!,
                            ]}
                            radius={isMapServiceSelected ? 11 : 8}
                            bubblingMouseEvents={false}
                            pathOptions={{
                                color: "#111111",
                                weight: isMapServiceSelected ? 2.3 : 1.5,
                                fillColor: mapStatusColors[service.status],
                                fillOpacity: 1,
                            }}
                            eventHandlers={{
                                click: () => {
                                    onSelectService(
                                        isMapServiceSelected
                                            ? null
                                            : service.id
                                    );
                                },
                            }}
                        />
                    );
                })}
            </MapContainer>

            {selectedMapService && (
                <div
                    className="map-service-card"
                    role="dialog"
                    aria-label={`Detalhes de ${selectedMapService.name}`}
                    onClick={(event) => event.stopPropagation()}
                >
                    <div className="map-service-header">
                        <span
                            className="map-service-header__dot"
                            style={{
                                backgroundColor:
                                    mapStatusColors[
                                    selectedMapService.status
                                    ],
                            }}
                        />

                        <strong>{selectedMapService.name}</strong>

                        <button
                            type="button"
                            aria-label="Fechar detalhes"
                            onClick={() => onSelectService(null)}
                        >
                            ×
                        </button>
                    </div>

                    {selectedMapPoint && (
                        <div className="map-service-card__location">
                            Lat: {selectedMapPoint.latitude.toFixed(3)} |
                            Long: {selectedMapPoint.longitude.toFixed(3)}
                        </div>
                    )}

                    <div className="map-service-metrics">
                        <div className="map-service-metric-col">
                            <div className="map-service-metric">
                                <span>CPU</span>
                                <strong>{typeof selectedMapService.metrics.cpu ===
                                        "number" &&
                                        Number.isFinite(
                                            selectedMapService.metrics.cpu
                                        )
                                        ? `${selectedMapService.metrics.cpu.toLocaleString(
                                            "pt-BR"
                                        )} %`
                                        : "—"}</strong>
                            </div>

                            <div className="map-service-metric">
                                <span>CO₂e</span>
                                <strong>
                                    {typeof selectedMapService.metrics.co2e ===
                                        "number" &&
                                        Number.isFinite(
                                            selectedMapService.metrics.co2e
                                        )
                                        ? `${selectedMapService.metrics.co2e.toLocaleString(
                                            "pt-BR"
                                        )} kg`
                                        : "—"}
                                </strong>
                            </div>
                        </div>

                        <div className="map-service-metric-col">
                            <div className="map-service-metric">
                                <span>RAM</span>
                                <strong>—</strong>
                            </div>

                            <div className="map-service-metric">
                                <span>Energia (kWh)</span>
                                <strong>—</strong>
                            </div>
                        </div>
                    </div>

                    <Link
                        to="/dashboard"
                        className="map-service-details-button"
                    >
                        Ver detalhes
                    </Link>
                </div>
            )}

            {validMapServices.length === 0 && (
                <div className="map-empty-message">
                    Nenhum serviço possui coordenadas válidas para
                    exibição.
                </div>
            )}
        </div>
    );
}
