import { memo, useEffect } from "react";
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
    globeRef: any;
    width: number;
    height: number;
    mode: string;
    datasets: EmissionDataset[];
    selectedPoint: {
        lat: number;
        lng: number;
    } | null;
}

const emissionColor = (t: number) => {
    const intensity = Math.max(0, Math.min(t, 1));

    if (intensity < 0.15) {
        return "rgba(0, 0, 0, 0)";
    }

    if (intensity < 0.35) {
        return `rgba(49, 130, 189, ${intensity})`;
    }

    if (intensity < 0.60) {
        return `rgba(80, 190, 130, ${intensity})`;
    }

    if (intensity < 0.80) {
        return `rgba(255, 190, 50, ${intensity})`;
    }

    return `rgba(220, 55, 55, ${intensity})`;
};

function GlobeEmissions({
    globeRef,
    width,
    height,
    mode,
    datasets,
    selectedPoint,
}: GlobeEmissionsProps) {

    const handleGlobeReady = () => {
        if (!globeRef.current) return;

        const controls = globeRef.current.controls();

        controls.enablePan = false;
        controls.autoRotate = !selectedPoint;
        controls.autoRotateSpeed = 0.4;

        globeRef.current.pointOfView(
            selectedPoint
                ? {
                    lat: selectedPoint.lat,
                    lng: selectedPoint.lng,
                    altitude: 0.8,
                }
                : {
                    lat: 20,
                    lng: 0,
                    altitude: 1.75,
                },
            0
        );
    };

    // Centraliza e trava a visualização na emissão selecionada.
    useEffect(() => {
        if (!globeRef.current) return;

        const controls = globeRef.current.controls();

        if (selectedPoint) {
            controls.autoRotate = false;

            globeRef.current.pointOfView(
                {
                    lat: selectedPoint.lat,
                    lng: selectedPoint.lng,
                    altitude: 0.8,
                },
                1000
            );
        } else {
            controls.autoRotate = true;
        }
    }, [selectedPoint, globeRef]);

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
                    ? "//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg"
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

            heatmapColorSaturation={1.8}
            heatmapColorFn={() => emissionColor}

            heatmapBaseAltitude={0.005}
            heatmapTopAltitude={0.10}

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

export default memo(GlobeEmissions);