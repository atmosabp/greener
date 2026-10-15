import { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";
import { type Service } from "./Homepage";
import "./InteractiveGlobe.css";
import useTheme from "../../hooks/useTheme";

interface InteractiveGlobeProps {
    services: Service[];
    selectedServiceId: string | null;
    onSelectService: (id: string | null) => void;
}

interface GlobePoint {
    id: string;
    color: string;
}

const statusColors: Record<string, string> = {
    active: "#91bd79",
    incomplete: "#e0d344",
    inactive: "#df7779",
};

export default function InteractiveGlobe({
    services,
    selectedServiceId,
    // onSelectService,
// NÃO ULTILIZADO AINDA
}: InteractiveGlobeProps) {
    const globeRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 600, height: 500 });
    const { mode } = useTheme();

    const globeData = services.map((service) => ({
        id: service.id,
        name: service.name,
        status: service.status,
        lat: service.latitude ?? 0,
        lng: service.longitude ?? 0,
        color: statusColors[service.status] || "#999",
        co2e: Math.floor(Math.random() * 500) + 50,
    }));

    const handleMouseEnter = () => {
        if (globeRef.current) {
            const controls = globeRef.current.controls();
            controls.autoRotate = false;
        }
    };

    // 💡 2. Retoma a rotação ao retirar o mouse
    const handleMouseLeave = () => {
        if (globeRef.current) {
            const controls = globeRef.current.controls();
            controls.autoRotate = true;
        }
    };

    // Detecta tamanho do container
    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                if (width > 0 && height > 0) {
                    setDimensions({ width, height });
                }
            }
        });

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    // Posiciona o globo ao carregar
    useEffect(() => {
        if (globeRef.current) {
            globeRef.current.pointOfView(
                { lat: 20, lng: 0, altitude: 1.75 },
                0
            );
        }
    }, [dimensions]);

    // Voa até o serviço selecionado
    useEffect(() => {
        if (selectedServiceId && globeRef.current) {
            const selected = globeData.find((s) => s.id === selectedServiceId);
            if (selected) {
                globeRef.current.pointOfView(
                    { lat: selected.lat, lng: selected.lng, altitude: 1.75 },
                    1500
                );
            }
        }
    }, [selectedServiceId, globeData]);

    return (
        <div ref={containerRef} className="globe-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Globe
                ref={globeRef}
                backgroundColor="rgba(0,0,0,0)"
                globeImageUrl={
                    mode === "dark" 
                    ? "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                    :"//unpkg.com/three-globe/example/img/earth-day.jpg"
                }
                width={dimensions.width}
                height={dimensions.height}
                pointsData={globeData}
                pointAltitude={0.001}
                pointsMerge={false}
                // Mantenha aqui os seus pointLabel, onPointClick
                // e as demais configurações atuais.
                onGlobeReady={() => {
                    if (globeRef.current) {
                        const controls = globeRef.current.controls();
                        controls.enablePan = false;
                        controls.autoRotate = true;
                        controls.autoRotateSpeed = 0.7;
                    }
                }}
                atmosphereColor={mode === "dark" ? "#ffffff" : "#000000"}
                atmosphereAltitude={0.2}

                pointColor={(point: object) => {
                    const service = point as GlobePoint;

                    return service.id === selectedServiceId
                        ? "#ffffff"
                        : service.color;
                }}
                pointRadius={(point: object) => {
                    const service = point as GlobePoint;

                    return service.id === selectedServiceId
                        ? 2
                        : 1.5;
                }}
            />
        </div>
    );
}