
import { useEffect } from "react";
import {
    CircleMarker,
    MapContainer,
    Popup,
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

const statusColors: Record<Service["status"], string> = {
    active: "#91bd79",
    incomplete: "#e0d344",
    inactive: "#df7779",
};

const statusLabels: Record<Service["status"], string> = {
    active: "Ativo",
    incomplete: "Incompleto",
    inactive: "Inativo",
};

function MapController({
    selectedService,
    onSelectService,
}: {
    selectedService?: Service;
    onSelectService: (id: string | null) => void;
}) {
    const map = useMap();

    useEffect(() => {
        if (!selectedService) return;

        const { latitude, longitude } = selectedService;

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

    useEffect(() => {
        const clearSelection = () => onSelectService(null);

        map.on("click", clearSelection);

        return () => {
            map.off("click", clearSelection);
        };
    }, [map, onSelectService]);

    return null;
}

export default function MapVisualization({
    services,
    selectedServiceId,
    onSelectService,
}: MapVisualizationProps) {
    const validServices = services.filter(
        (service) =>
            service.latitude !== undefined &&
            service.longitude !== undefined &&
            Number.isFinite(service.latitude) &&
            Number.isFinite(service.longitude) &&
            service.latitude >= -90 &&
            service.latitude <= 90 &&
            service.longitude >= -180 &&
            service.longitude <= 180
    );

    const selectedService = validServices.find(
        (service) => service.id === selectedServiceId
    );

    const VERTICAL_BOUNDS: [[number, number], [number, number]] = [
        [-85, -360], // Sudoeste (Sul máximo, Oeste estendido)
        [85, 360], // Nordeste (Norte máximo, Leste estendido)
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
                maxBounds={VERTICAL_BOUNDS}
                maxBoundsViscosity={1.0}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController
                    selectedService={selectedService}
                    onSelectService={onSelectService}
                />

                {validServices.map((service) => {
                    const selected = service.id === selectedServiceId;

                    return (
                        <CircleMarker
                            key={service.id}
                            center={[service.latitude!, service.longitude!]}
                            radius={selected ? 11 : 8}
                            pathOptions={{
                                color: "var(--text)",
                                weight: selected ? 2.5 : 1.5,
                                fillColor: statusColors[service.status],
                                fillOpacity: 1,
                            }}
                            eventHandlers={{
                                click: (event) => {
                                    event.originalEvent.stopPropagation();

                                    onSelectService(
                                        selected ? null : service.id
                                    );
                                },
                            }}
                        >
                            {selected && (
                                <Popup
                                    closeButton={false}
                                    autoPan
                                    className="atmos-map-popup"
                                >
                                    <div
                                        className="map-service-card"
                                        onClick={(event) => event.stopPropagation()}
                                    >
                                        <div className="map-service-header">
                                            <strong>{service.name}</strong>

                                            <button
                                                type="button"
                                                aria-label="Fechar detalhes"
                                                onClick={() => onSelectService(null)}
                                            >
                                                ×
                                            </button>
                                        </div>

                                        <div className="map-service-status">
                                            <span
                                                className="map-status-dot"
                                                style={{
                                                    backgroundColor: statusColors[service.status],
                                                }}
                                            />
                                            {statusLabels[service.status]}
                                        </div>

                                        {service.co2e !== undefined &&
                                            Number.isFinite(service.co2e) && (
                                                <div className="map-service-emissions">
                                                    <span>Emissões de CO₂e</span>
                                                    <strong>
                                                        {service.co2e.toLocaleString("pt-BR")} kg
                                                    </strong>
                                                </div>
                                            )}
                                    </div>
                                </Popup>
                            )}
                        </CircleMarker>
                    );
                })}
            </MapContainer>

            {validServices.length === 0 && (
                <div className="map-empty-message">
                    Nenhum serviço possui coordenadas válidas para exibição.
                </div>
            )}
        </div>
    );
}
