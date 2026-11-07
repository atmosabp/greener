export type RankingService = {
  id: number;
  name: string;
  energy: number;
  co2e: number;
};

export type RankingMetric = "energy" | "co2e";

export type RankingPeriod = "now" | "today" | "month" | "year" | "other-years";

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
  maximumFractionDigits: 10,
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
