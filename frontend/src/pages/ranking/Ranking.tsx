
import { useMemo, useState, type ChangeEvent } from "react";
import AppHeader from "../../components/header/AppHeader";
import "./Ranking.css";

type RankingService = {
  id: number;
  name: string;
  energy: number;
  co2e: number;
};

type RankingMetric = "energy" | "co2e";

type RankingPeriod = "now" | "today" | "month" | "year" | "other-years";

const initialServices: RankingService[] = [
  { id: 1, name: "Billing API", energy: 12.48, co2e: 4.21 },
  { id: 2, name: "Checkout Worker", energy: 10.82, co2e: 3.86 },
  { id: 3, name: "Inventory Sync", energy: 9.64, co2e: 3.42 },
  { id: 4, name: "Audit Stream", energy: 8.91, co2e: 3.18 },
  { id: 5, name: "Email Dispatcher", energy: 7.35, co2e: 2.74 },
  { id: 6, name: "Fraud Detector", energy: 6.82, co2e: 2.51 },
  { id: 7, name: "Reporting Batch", energy: 5.74, co2e: 2.13 },
  { id: 8, name: "Authentication API", energy: 4.91, co2e: 1.84 },
];

const currentYear = new Date().getFullYear();

const availableYears = Array.from(
  { length: Math.max(0, currentYear - 2019) },
  (_, index) => currentYear - 1 - index,
);

export default function Ranking() {
  const [period, setPeriod] = useState<RankingPeriod>("now");
  const [selectedYear, setSelectedYear] = useState(
    String(currentYear - 1),
  );
  const [metric, setMetric] = useState<RankingMetric>("energy");
  const [updateInterval, setUpdateInterval] = useState("5");
  const [lastUpdate, setLastUpdate] = useState(() => new Date());

  const ranking = useMemo(() => {
    return [...initialServices].sort((a, b) =>
      metric === "energy"
        ? b.energy - a.energy
        : b.co2e - a.co2e,
    );
  }, [metric]);

  function handlePeriodChange(
    event: ChangeEvent<HTMLSelectElement>,
  ) {
    setPeriod(event.target.value as RankingPeriod);
  }

  function handleYearChange(
    event: ChangeEvent<HTMLSelectElement>,
  ) {
    setSelectedYear(event.target.value);
  }

  function handleUpdateIntervalChange(
    event: ChangeEvent<HTMLSelectElement>,
  ) {
    setUpdateInterval(event.target.value);
  }

  function handleRefresh() {
    setLastUpdate(new Date());
  }

  const periodLabel: Record<RankingPeriod, string> = {
    now: "Agora",
    today: "Hoje",
    month: "Esse mês",
    year: "Esse ano",
    "other-years": selectedYear,
  };

  const formattedLastUpdate = lastUpdate.toLocaleTimeString(
    "pt-BR",
    {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    },
  );

  return (
    <div className="ranking-page">
      <AppHeader />

      <main className="ranking-main">
        <div className="ranking-intro-box">
          <section className="ranking-intro">
            <div className="ranking-heading">
              <h1>Ranking</h1>
              <p>
                Veja o ranking de desempenho dos serviços.
              </p>
            </div>

            <div className="ranking-filters">
              <div className="ranking-period">
                <label htmlFor="ranking-period-select">
                  Ver ranking por período:
                </label>

                <select
                  id="ranking-period-select"
                  value={period}
                  onChange={handlePeriodChange}
                >
                  <option value="now">Agora</option>
                  <option value="today">Hoje</option>
                  <option value="month">Esse mês</option>
                  <option value="year">Esse ano</option>
                  <option value="other-years">
                    Outros anos
                  </option>
                </select>

                {period === "other-years" && (
                  <select
                    className="ranking-year-select"
                    aria-label="Selecionar ano"
                    value={selectedYear}
                    onChange={handleYearChange}
                  >
                    {availableYears.map((year) => (
                      <option
                        key={year}
                        value={String(year)}
                      >
                        {year}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="ranking-classification">
                <span>Classificar por:</span>

                <div className="ranking-classification-buttons">
                  <button
                    type="button"
                    className={
                      metric === "energy"
                        ? "ranking-metric-button is-active"
                        : "ranking-metric-button"
                    }
                    aria-pressed={metric === "energy"}
                    onClick={() => setMetric("energy")}
                  >
                    Consumo energético
                  </button>

                  <button
                    type="button"
                    className={
                      metric === "co2e"
                        ? "ranking-metric-button is-active"
                        : "ranking-metric-button"
                    }
                    aria-pressed={metric === "co2e"}
                    onClick={() => setMetric("co2e")}
                  >
                    Emissão de CO₂e
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="ranking-toolbar">
            <div className="ranking-update">
              <label htmlFor="ranking-update-select">
                Atualizações:
              </label>

              <select
                id="ranking-update-select"
                value={updateInterval}
                onChange={handleUpdateIntervalChange}
              >
                <option value="5">05s</option>
                <option value="10">10s</option>
                <option value="15">15s</option>
                <option value="30">30s</option>
                <option value="60">60s</option>
                <option value="120">120s</option>
              </select>
            </div>

            <div className="ranking-toolbar-info">
              <span className="ranking-last-update">
                Última atualização: {formattedLastUpdate}
              </span>

              <button
                type="button"
                className="ranking-refresh-button"
                onClick={handleRefresh}
                aria-label="Atualizar horário da última atualização"
                title="Atualizar"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="17"
                  height="17"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 7v5h-5" />
                  <path d="M4 17v-5h5" />
                  <path d="M5.6 9a7 7 0 0 1 11.6-2L20 12" />
                  <path d="M4 12l2.8 5a7 7 0 0 0 11.6-2" />
                </svg>
              </button>
            </div>
          </section>
        </div>

        <section
          className="ranking-table-section"
          aria-label="Classificação dos serviços"
        >
          <div
            className="ranking-table-scroll"
            role="region"
            aria-label="Tabela de ranking. Role para ver todos os serviços."
            tabIndex={0}
          >
            <table className="ranking-table">
              <thead>
                <tr>
                  <th scope="col">Posição</th>
                  <th scope="col">Serviço</th>
                  <th scope="col">Consumo Energético</th>
                  <th scope="col">Emissão de CO₂e</th>
                </tr>
              </thead>

              <tbody>
                {ranking.map((service, index) => (
                  <tr key={service.id}>
                    <td>
                      <span
                        className={
                          index < 3
                            ? `ranking-position ranking-position--${index + 1}`
                            : "ranking-position"
                        }
                      >
                        #{index + 1}
                      </span>
                    </td>

                    <td className="ranking-service-name">
                      {service.name}
                    </td>

                    <td>
                      {service.energy.toLocaleString(
                        "pt-BR",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        },
                      )}{" "}
                      kWh
                    </td>

                    <td>
                      {service.co2e.toLocaleString(
                        "pt-BR",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        },
                      )}{" "}
                      kg CO₂e
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="ranking-table-caption">
            <span>
              Período selecionado: {periodLabel[period]}
            </span>

            <span>
              {ranking.length} serviços demonstrativos
            </span>
          </div>
        </section>
      </main>

      <footer className="ranking-footer">
        Desenvolvido por Atmos ° © 2026
      </footer>
    </div>
  );
}
