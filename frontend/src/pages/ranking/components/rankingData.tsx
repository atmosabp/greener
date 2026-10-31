
export type RankingService = {
    id: number;
    name: string;
    energy: number;
    co2e: number;
};

export type RankingMetric = "energy" | "co2e";

export type RankingPeriod =
    | "now"
    | "today"
    | "month"
    | "year"
    | "other-years";

export const initialServices: RankingService[] = [
    { id: 1, name: "Billing API", energy: 12.48, co2e: 4.21 },
    { id: 2, name: "Checkout Worker", energy: 10.82, co2e: 3.86 },
    { id: 3, name: "Inventory Sync", energy: 9.64, co2e: 3.42 },
    { id: 4, name: "Audit Stream", energy: 8.91, co2e: 3.18 },
    { id: 5, name: "Email Dispatcher", energy: 7.35, co2e: 2.74 },
    { id: 6, name: "Fraud Detector", energy: 6.82, co2e: 2.51 },
    { id: 7, name: "Reporting Batch", energy: 5.74, co2e: 2.13 },
    { id: 8, name: "Authentication API", energy: 4.91, co2e: 1.84 },
];

export const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
] as const;

export const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

export const numberFormatter = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

export const timeFormatter = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
});

export const availableYears = Array.from(
    { length: new Date().getFullYear() - 2009 },
    (_, index) => new Date().getFullYear() - index,
);

export const hours = Array.from({ length: 24 }, (_, hour) => hour);
