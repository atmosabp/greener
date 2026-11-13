
import { useRef } from "react";
import Globe from "react-globe.gl";

export interface EmissionPoint {
    lat: number;
    lng: number;
    weight: number;
}

export interface EmissionDataset {
    points: EmissionPoint[];
}

interface GlobeEmissionsProps {
    width: number;
    height: number;
    mode: string;
    datasets: EmissionDataset[];
}

export default function GlobeEmissions({
    width,
    height,
    mode,
    datasets,
}: GlobeEmissionsProps) {
    const globeRef = useRef<any>(null);

    // Interpolador de cores do heatmap.
    const emissionColor = (t: number) => {
        const intensity = Math.max(0, Math.min(t, 1));

        if (intensity < 0.25) {
            return `rgba(40, 120, 220, ${0.3 + intensity * 2})`;
        }

        if (intensity < 0.5) {
            return `rgba(50, 190, 150, ${0.5 + intensity})`;
        }

        if (intensity < 0.75) {
            return `rgba(255, 190, 50, ${0.6 + intensity * 0.4})`;
        }

        return `rgba(230, 45, 45, ${0.8 + intensity * 0.2})`;
    };

    // Configura a rotação automática do globo.
    const handleGlobeReady = () => {
        const globe = globeRef.current;

        if (!globe) return;

        const controls = globe.controls();

        controls.enablePan = false;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.7;

        globe.pointOfView(
            {
                lat: 20,
                lng: 0,
                altitude: 1.75,
            },
            0
        );
    };

    return (
        <Globe
            ref={globeRef}
            width={width}
            height={height}

            backgroundColor="rgba(0, 0, 0, 0)"

            // Textura do planeta.
            globeImageUrl={
                mode === "dark"
                    ? "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                    : "//unpkg.com/three-globe/example/img/earth-day.jpg"
            }

            // ==============================
            // HEATMAP LAYER
            // ==============================

            heatmapsData={datasets}

            heatmapPoints="points"
            heatmapPointLat="lat"
            heatmapPointLng="lng"
            heatmapPointWeight="weight"

            // Largura da influência de cada ponto.
            heatmapBandwidth={2.5}

            // Intensidade das cores.
            heatmapColorSaturation={1.5}

            // IMPORTANTE:
            // O accessor retorna o interpolador de cores.
            heatmapColorFn={() => emissionColor}

            // Altura mínima e máxima do relevo.
            heatmapBaseAltitude={0.005}
            heatmapTopAltitude={0.08}

            // Animação de entrada e atualização.
            heatmapsTransitionDuration={1000}

            // ==============================
            // ATMOSFERA
            // ==============================

            atmosphereColor={
                mode === "dark"
                    ? "#ffffff"
                    : "#000000"
            }

            atmosphereAltitude={0.2}

            // ==============================
            // INICIALIZAÇÃO
            // ==============================

            onGlobeReady={handleGlobeReady}
        />
    );
}
