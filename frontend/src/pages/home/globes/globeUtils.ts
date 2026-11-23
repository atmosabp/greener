
import { useEffect, useState } from "react";
import type { Service } from "../Homepage";

export interface GlobePoint {
    id: string;
    name: string;
    status: Service["status"];
    lat: number;
    lng: number;
    co2e: number;
    kwh: number;
    cpu_percent: number;
    city: string;
    country: string;
}

export interface GlobeModelProps {
    services: Service[];
    selectedServiceId: string | null;
    onSelectService: (id: string | null) => void;
}

export function getServicePoints(services: Service[]): GlobePoint[] {
    return services.flatMap((service) => {
        const latitude = service.location?.latitude;
        const longitude = service.location?.longitude;

        if (
            typeof latitude !== "number" ||
            typeof longitude !== "number" ||
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude) ||
            latitude < -90 ||
            latitude > 90 ||
            longitude < -180 ||
            longitude > 180
        ) {
            return [];
        }

        return [{
            id: service.id,
            name: service.name,
            status: service.status,
            lat: latitude,
            lng: longitude,
            co2e: service.metrics?.co2e ?? 0,
            kwh: service.metrics?.kwh ?? 0,
            cpu_percent: service.metrics?.cpu_percent ?? 0,
            city: service.location?.city ?? "Localização desconhecida",
            country: service.location?.country ?? "",
        }];
    });
}

export function getStatusColor(status: GlobePoint["status"]): string {
    switch (status) {
        case "active":
            return "#91bd79";
        case "incomplete":
            return "#e0d344";
        case "inactive":
            return "#df7779";
        default:
            return "#91bd79";
    }
}

export function useGlobeSize() {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (!container) return;

        const observer = new ResizeObserver(([entry]) => {
            if (!entry) return;

            setSize({
                width: Math.floor(entry.contentRect.width),
                height: Math.floor(entry.contentRect.height),
            });
        });

        observer.observe(container);

        return () => observer.disconnect();
    }, [container]);

    return {
        containerRef: setContainer,
        width: size.width,
        height: size.height,
    };
}
