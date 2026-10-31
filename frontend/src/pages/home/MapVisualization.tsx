import { useEffect } from "react";
import { CircleMarker, MapContainer, TileLayer, useMap } from "react-leaflet";
import type { Service } from "./Homepage";
import "leaflet/dist/leaflet.css";
import "./MapVisualization.css";
import ServiceCard from "./ServiceCard";

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

    if (selectedService.location) {
      var { latitude, longitude } = selectedService.location;
    }

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

  const selectedMapService = validMapServices.find(
    (service) => service.id === selectedServiceId,
  );

  // Coordenadas próprias da visualização do mapa.
  const selectedMapPoint = selectedMapService
    ? {
        latitude: selectedMapService.location
          ? selectedMapService.location.latitude
          : undefined,
        longitude: selectedMapService.location
          ? selectedMapService.location.longitude
          : undefined,
      }
    : null;

  const mapVerticalBounds: [[number, number], [number, number]] = [
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
          const isMapServiceSelected = service.id === selectedServiceId;

          return (
            <div>
              {service.location !== undefined &&
              service.location.latitude &&
              service.location.longitude ? (
                <CircleMarker
                  key={service.id}
                  center={[
                    service.location.latitude,
                    service.location.longitude,
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
                      onSelectService(isMapServiceSelected ? null : service.id);
                    },
                  }}
                />
              ) : (
                <p>.</p>
              )}
            </div>
          );
        })}
      </MapContainer>

      {selectedMapService && (
        // Seria legal colocar isso e o card do globo em um componente separado
        <ServiceCard viewType={"map"} selectedServicePoint={selectedMapService} onSelectService={onSelectService} />
      )}

      {validMapServices.length === 0 && (
        <div className="map-empty-message">
          Nenhum serviço possui coordenadas válidas para exibição.
        </div>
      )}
    </div>
  );
}
