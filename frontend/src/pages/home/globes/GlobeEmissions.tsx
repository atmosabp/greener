
import { memo, useRef } from "react";
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

const emissionColor = (t: number) => {
    const intensity = Math.max(0, Math.min(t, 1));

    if (intensity < 0.25) {
        return `rgba(49, 130, 189, ${intensity * 2})`;
    }

    if (intensity < 0.5) {
        return `rgba(144, 205, 144, ${intensity})`;
    }

    if (intensity < 0.75) {
        return `rgba(255, 190, 70, ${intensity})`;
    }

    return `rgba(220, 65, 65, ${intensity})`;
};

function GlobeEmissions({
    width,
    height,
    mode,
    datasets,
}: GlobeEmissionsProps) {
    const globeRef = useRef<any>(null);

    const handleGlobeReady = () => {
        if (!globeRef.current) return;

        const controls = globeRef.current.controls();

        controls.enablePan = false;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.4;

        globeRef.current.pointOfView(
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

            // Reduz a complexidade geométrica do planeta.
            globeCurvatureResolution={8}

            backgroundColor="rgba(0,0,0,0)"

            globeImageUrl={
                mode === "dark"
                    ? "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                    : "//unpkg.com/three-globe/example/img/earth-day.jpg"
            }

            // Heatmap
            heatmapsData={datasets}
            heatmapPoints="points"
            heatmapPointLat="lat"
            heatmapPointLng="lng"
            heatmapPointWeight="weight"

            // Largura padrão para evitar concentração excessivamente estreita.
            heatmapBandwidth={2.5}

            heatmapColorSaturation={1.5}
            heatmapColorFn={() => emissionColor}

            heatmapBaseAltitude={0.005}
            heatmapTopAltitude={0.06}

            // Remove a animação de construção do heatmap.
            heatmapsTransitionDuration={0}

            atmosphereColor={
                mode === "dark" ? "#ffffff" : "#000000"
            }
            atmosphereAltitude={0.12}

            onGlobeReady={handleGlobeReady}
        />
    );
}

// Evita renderizações desnecessárias quando as propriedades não mudaram.
export default memo(GlobeEmissions);
