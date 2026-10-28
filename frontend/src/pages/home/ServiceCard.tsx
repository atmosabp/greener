import { Link } from "react-router-dom";
import type { Service } from "./Homepage";

const mapStatusColors: Record<Service["status"], string> = {
  active: "#91bd79",
  incomplete: "#e0d344",
  inactive: "#df7779",
};

interface ServiceCardProps {
  viewType: string;
  selectedServicePoint: Service;
  onSelectService: (id: string | null) => void;
}

export default function ServiceCard({
  viewType,
  selectedServicePoint,
  onSelectService,
}: ServiceCardProps) {
  return (
    <div
      className="map-service-card"
      role="dialog"
      aria-label={`Detalhes de ${selectedServicePoint.name}`}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="map-service-header">
        <span
          className="map-service-header__dot"
          style={{
            backgroundColor: mapStatusColors[selectedServicePoint.status],
          }}
        />

        <strong>{selectedServicePoint.name}</strong>

        <button
          type="button"
          aria-label="Fechar detalhes"
          onClick={() => onSelectService(null)}
        >
          ×
        </button>
      </div>

      {selectedServicePoint && (
        <span>
          {selectedServicePoint.location &&
          selectedServicePoint.location.latitude != undefined &&
          selectedServicePoint.location.longitude != undefined ? (
            <span>
              Lat: {selectedServicePoint.location.latitude!.toFixed(3)}| Long:{" "}
              {selectedServicePoint.location.longitude!.toFixed(3)}
            </span>
          ) : (
            <p>oie</p>
          )}
        </span>
      )}

      <div className="map-service-metrics">
        <div className="map-service-metric-col">
          <div className="map-service-metric">
            <span>CPU</span>
            <strong>
              {typeof selectedServicePoint.metrics?.cpu_percent === "number" &&
              Number.isFinite(selectedServicePoint.metrics.cpu_percent)
                ? `${selectedServicePoint.metrics.cpu_percent.toLocaleString(
                    "pt-BR",
                  )} %`
                : "—"}
            </strong>
          </div>

          <div className="map-service-metric">
            <span>CO₂e</span>
            <strong>
              {typeof selectedServicePoint.metrics?.co2e === "number" &&
              Number.isFinite(selectedServicePoint.metrics.co2e)
                ? `${selectedServicePoint.metrics.co2e.toLocaleString(
                    "pt-BR",
                  )} kg`
                : "—"}
            </strong>
          </div>
        </div>

        <div className="map-service-metric-col">
          <div className="map-service-metric">
            <span>Memória</span>
            <strong>
              {typeof selectedServicePoint.metrics?.memory_gb === "number" &&
              Number.isFinite(selectedServicePoint.metrics.memory_gb)
                ? `${selectedServicePoint.metrics.memory_gb.toLocaleString(
                    "pt-BR",
                  )} Gb`
                : "—"}
            </strong>
          </div>

          <div className="map-service-metric">
            <span>Energia</span>
            <strong>
              {typeof selectedServicePoint.metrics?.kwh === "number" &&
              Number.isFinite(selectedServicePoint.metrics.kwh)
                ? `${selectedServicePoint.metrics.kwh.toLocaleString(
                    "pt-BR", {maximumSignificantDigits: 2}
                  )} KWh`
                : "—"}
            </strong>
          </div>
        </div>
      </div>

      <Link to="/dashboard" className="map-service-details-button">
        Ver detalhes
      </Link>
    </div>
  );
}
