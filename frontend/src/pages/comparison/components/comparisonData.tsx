export type MetricKey =
    | 'consumo'
    | 'emissao'
    | 'rede'
    | 'cpu'
    | 'armazenamento'
    | 'memoria'
    | 'intensidade';

/* Valores numéricos; ausentes quando o backend não conseguiu coletar. */
export type Metrics = Partial<Record<MetricKey, number>>;

export interface Service {
    id: string;
    name: string;
    metrics: Metrics;
}

export type CompareTarget = 'reference' | 'average';

/* Formato retornado pela rota /collections/all-service-data. */
interface ApiService {
    id: string;
    name: string;
    metrics?: {
        cpu_percent?: number;
        memory_gb?: number;
        disk_gb?: number;
        network_gb?: number;
        co2e?: number;
        kwh?: number;
        carbon_intensity?: number;
    };
}

const port: number = import.meta.env.VITE_PORT || 3000;

function toService(apiService: ApiService): Service {
    const metrics = apiService.metrics ?? {};

    /* Usa a intensidade enviada pelo backend ou calcula pelo CO₂e / kWh. */
    const intensidade =
        metrics.carbon_intensity ??
        (metrics.co2e && metrics.kwh
            ? metrics.co2e / metrics.kwh
            : undefined);

    return {
        id: apiService.id,
        name: apiService.name,
        metrics: {
            consumo: metrics.kwh,
            emissao: metrics.co2e,
            rede: metrics.network_gb,
            cpu: metrics.cpu_percent,
            armazenamento: metrics.disk_gb,
            memoria: metrics.memory_gb,
            intensidade,
        },
    };
}

export async function fetchServices(): Promise<Service[]> {
    const result = await fetch(`http://localhost:${port}/collections/all-service-data`);

    if (!result.ok) {
        throw new Error('Não foi possível buscar os dados dos serviços.');
    }

    const data: ApiService[] = await result.json();

    return (data ?? []).map(toService);
}

const UNITS: Record<MetricKey, string> = {
    consumo: ' kWh',
    emissao: ' g CO₂e',
    rede: 'GB',
    cpu: '%',
    armazenamento: 'GB',
    memoria: 'GB',
    intensidade: '',
};

export function formatNumber(value: number) {
    /* Valores muito pequenos (ex.: kWh por coleta) mantêm casas significativas. */
    const options =
        Math.abs(value) > 0 && Math.abs(value) < 1
            ? { maximumSignificantDigits: 3 }
            : { maximumFractionDigits: 2 };

    return value.toLocaleString('pt-BR', options);
}

// metrica sem valor
export function formatMetric(key: MetricKey, value?: number) {
    if (value === undefined) return '—';

    return `${formatNumber(value)}${UNITS[key]}`;
}

const METRIC_KEYS: MetricKey[] = [
    'consumo',
    'emissao',
    'rede',
    'cpu',
    'armazenamento',
    'memoria',
    'intensidade',
];

/* Média de cada métrica, ignorando serviços sem o valor. */
export function calculateAverages(services: Service[]): Metrics {
    const averages: Metrics = {};

    for (const key of METRIC_KEYS) {
        const values = services
            .map((service) => service.metrics[key])
            .filter((value): value is number => value !== undefined);

        if (values.length > 0) {
            averages[key] =
                values.reduce((sum, value) => sum + value, 0) / values.length;
        }
    }

    return averages;
}

/* Maior valor de uma métrica entre os serviços (escala dos medidores). */
export function calculateMax(services: Service[], key: MetricKey) {
    return services.reduce(
        (max, service) => Math.max(max, service.metrics[key] ?? 0),
        0,
    );
}

/* Diferença percentual do valor em relação à base. */
export function calculateDelta(value?: number, base?: number) {
    if (value === undefined || base === undefined || base === 0) {
        return undefined;
    }

    return ((value - base) / base) * 100;
}

export function carbonLevel(intensity?: number) {
    if (intensity === undefined) return { label: 'Indisponível', bar: '0%' };

    /* Escala de 0 a 200 gCO₂e/kWh; acima disso a barra fica cheia. */
    const bar = `${Math.min(intensity / 2, 100)}%`;

    if (intensity < 100) return { label: 'Baixo', bar };
    if (intensity < 200) return { label: 'Médio', bar };
    return { label: 'Alto', bar };
}

export const PERIODS = [
    { value: 'today', label: 'Hoje' },
    { value: '7d', label: 'Últimos 7 dias' },
    { value: '30d', label: 'Últimos 30 dias' },
];
