
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

// =========================================
// CORES DO HEATMAP
// =========================================

const emissionColor = (value: number): string => {
    const intensity = Math.max(0, Math.min(value * 2.5, 1));

    // Transparência somente em áreas sem densidade.
    if (intensity < 0.04) {
        return "rgba(0, 0, 0, 0)";
    }

    const opacity = Math.min(
        0.95,
        0.25 + intensity * 0.75,
    );

    if (intensity < 0.25) {
        return `rgba(49, 130, 189, ${opacity})`;
    }

    if (intensity < 0.50) {
        return `rgba(55, 180, 125, ${opacity})`;
    }

    if (intensity < 0.75) {
        return `rgba(255, 190, 50, ${opacity})`;
    }

    return `rgba(225, 55, 55, ${opacity})`;
};

function GlobeEmissions({
    globeRef,
    width,
    height,
    mode,
    datasets,
    selectedPoint,
}: GlobeEmissionsProps) {

    // =========================================
    // INICIALIZAÇÃO DO GLOBO
    // =========================================

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
            0,
        );

        console.log("Globo de emissões inicializado.");
        console.log("Datasets:", datasets);
    };

    // =========================================
    // CENTRALIZAÇÃO DA REGIÃO SELECIONADA
    // =========================================

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
                1000,
            );
        } else {
            controls.autoRotate = true;
        }
    }, [selectedPoint, globeRef]);

    // =========================================
    // VERIFICAÇÃO DOS DADOS
    // =========================================

    useEffect(() => {
        const points = datasets.flatMap(
            (dataset) => dataset.points,
        );

        console.log("===== GLOBO DE EMISSÕES =====");
        console.log("Datasets:", datasets.length);
        console.log("Pontos:", points.length);
        console.log(
            "Pesos:",
            points.map((point) => point.weight),
        );
        console.log("=============================");
    }, [datasets]);

    // =========================================
    // RENDERIZAÇÃO
    // =========================================

    return (
        <Globe
            ref={globeRef}
            width={width}
            height={height}

            // PLANETA
            globeCurvatureResolution={8}

            backgroundColor="rgba(0,0,0,0)"

            globeImageUrl={
                mode === "dark"
                    ? "//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg"
                    : "//unpkg.com/three-globe/example/img/earth-day.jpg"
            }

            // =================================
            // HEATMAP
            // =================================

            heatmapsData={datasets}

            heatmapPoints="points"
            heatmapPointLat="lat"
            heatmapPointLng="lng"
            heatmapPointWeight="weight"

            // Distribuição dos picos.
            heatmapBandwidth={2.5}

            // Realce da intensidade.
            heatmapColorSaturation={3.2}

            // Função de interpolação de cores.
            heatmapColorFn={() => emissionColor}

            // =================================
            // ALTITUDE DOS PICOS
            // =================================

            heatmapBaseAltitude={0.005}
            heatmapTopAltitude={0.16}

            // Atualização do heatmap.
            heatmapsTransitionDuration={0}

            // =================================
            // ATMOSFERA
            // =================================

            atmosphereColor={
                mode === "dark" ? "#ffffff" : "#000000"
            }

            atmosphereAltitude={0.12}

            // INICIALIZAÇÃO
            onGlobeReady={handleGlobeReady}
        />
    );
}

export default memo(GlobeEmissions);
