
/* ------------------------------------------------------------------ */
/* Tipos                                                               */
/* ------------------------------------------------------------------ */

export interface Metrics {
    consumo: string;
    emissao: string;
    rede: string;
    cpu: string;
    armazenamento: string;
    memoria: string;
    intensidade: string;
    nivelCarbono: string;
    barraCarbono: string;
    barraConsumo: string;
    barraEmissao: string;
}

export interface Service {
    id: string;
    name: string;
    metrics: Metrics;
}

export type CompareTarget = 'reference' | 'average';

/* ------------------------------------------------------------------ */
/* Dados estáticos dos serviços                                        */
/* ------------------------------------------------------------------ */

export const MOCK_SERVICES: Service[] = [
    {
        id: 'billing-api',
        name: 'Billing API',
        metrics: {
            consumo: '12,48 kWh',
            emissao: '4,21kg CO₂e',
            rede: '0,21GB',
            cpu: '41%',
            armazenamento: '8GB',
            memoria: '1,36GB',
            intensidade: '85',
            nivelCarbono: 'Baixo',
            barraCarbono: '42%',
            barraConsumo: '65%',
            barraEmissao: '55%',
        },
    },
    {
        id: 'reporting-batch',
        name: 'Reporting Batch',
        metrics: {
            consumo: '17,31 kWh',
            emissao: '2,18kg CO₂e',
            rede: '0,21GB',
            cpu: '25%',
            armazenamento: '6GB',
            memoria: '1,14GB',
            intensidade: '85',
            nivelCarbono: 'Baixo',
            barraCarbono: '42%',
            barraConsumo: '80%',
            barraEmissao: '35%',
        },
    },
    {
        id: 'auth-service',
        name: 'Auth Service',
        metrics: {
            consumo: '6,92 kWh',
            emissao: '1,74kg CO₂e',
            rede: '0,09GB',
            cpu: '22%',
            armazenamento: '4GB',
            memoria: '0,80GB',
            intensidade: '140',
            nivelCarbono: 'Médio',
            barraCarbono: '70%',
            barraConsumo: '35%',
            barraEmissao: '30%',
        },
    },
    {
        id: 'notification-worker',
        name: 'Notification Worker',
        metrics: {
            consumo: '9,15 kWh',
            emissao: '3,60kg CO₂e',
            rede: '0,32GB',
            cpu: '55%',
            armazenamento: '2GB',
            memoria: '2,10GB',
            intensidade: '230',
            nivelCarbono: 'Alto',
            barraCarbono: '100%',
            barraConsumo: '50%',
            barraEmissao: '48%',
        },
    },
];

/* ------------------------------------------------------------------ */
/* Períodos                                                            */
/* ------------------------------------------------------------------ */

export const PERIODS = [
    { value: 'today', label: 'Hoje' },
    { value: '7d', label: 'Últimos 7 dias' },
    { value: '30d', label: 'Últimos 30 dias' },
];

/* ------------------------------------------------------------------ */
/* Médias estáticas                                                    */
/* ------------------------------------------------------------------ */

export const STATIC_AVERAGES = {
    rede: '0,21GB',
    cpu: '36%',
    armazenamento: '5GB',
    memoria: '1,35GB',
    consumo: '11,47 kWh',
    emissao: '2,93 kg CO₂e',
};
