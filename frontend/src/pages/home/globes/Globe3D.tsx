
import Globe from "react-globe.gl";

export interface GlobePoint {
    id: string;
    name: string;
    lat: number;
    lng: number;
    color: string;
    cpu_percent: number;
}

interface Globe3DProps {
    globeRef: any;
    points: GlobePoint[];
    width: number;
    height: number;
    mode: string;
    selectedPointId: string | null;
    onSelectPoint: (id: string) => void;
    onPointHover: (hovered: boolean) => void;
}

export default function Globe3D({
    globeRef,
    points,
    width,
    height,
    mode,
    selectedPointId,
    onSelectPoint,
    onPointHover,
}: Globe3DProps) {
    // Cria dois pontos para cada serviço:
    // um para o contorno e outro para o ponto principal.
    const pointsData = [
        ...points.map((point) => ({
            ...point,
            isOutline: true,
        })),
        ...points.map((point) => ({
            ...point,
            isOutline: false,
        })),
    ];

    return (
        <Globe
            ref={globeRef}
            width={width}
            height={height}
            backgroundColor="rgba(0,0,0,0)"
            globeImageUrl={
                mode === "dark"
                    ? "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                    : "//unpkg.com/three-globe/example/img/earth-day.jpg"
            }
            pointsData={pointsData}
            pointLat="lat"
            pointLng="lng"

            onPointHover={(point) => {
                onPointHover(!!point);
            }}

            pointAltitude={(point: object) => {
                const service = point as GlobePoint & {
                    isOutline?: boolean;
                };

                if (service.isOutline) {
                    return 0.001;
                }

                return service.id === selectedPointId
                    ? 0.005
                    : 0.003;
            }}

            pointsMerge={false}

            pointColor={(point: object) => {
                const service = point as GlobePoint & {
                    isOutline?: boolean;
                };

                if (service.isOutline) {
                    return "#111111";
                }

                return service.id === selectedPointId
                    ? "#ffffff"
                    : service.color;
            }}

            pointRadius={(point: object) => {
                const service = point as GlobePoint & {
                    isOutline?: boolean;
                };

                if (service.isOutline) {
                    return service.id === selectedPointId
                        ? 2.2
                        : 1.6;
                }

                return service.id === selectedPointId
                    ? 1.8
                    : 1.2;
            }}

            onPointClick={(point: object) => {
                const service = point as GlobePoint;

                onSelectPoint(service.id);
            }}

            onGlobeReady={() => {
                if (!globeRef.current) return;

                const controls = globeRef.current.controls();

                controls.enablePan = false;
                controls.autoRotate = !selectedPointId;
                controls.autoRotateSpeed = 0.7;
            }}

            atmosphereColor={
                mode === "dark" ? "#ffffff" : "#000000"
            }

            atmosphereAltitude={0.2}
        />
    );
}
