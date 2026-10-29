
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

const monthNames = [
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
];

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

const numberFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const timeFormatter = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

const availableYears = Array.from(
  { length: new Date().getFullYear() - 2009 },
  (_, index) => new Date().getFullYear() - index,
);

const hours = Array.from({ length: 24 }, (_, hour) => hour);

export default function Ranking() {
  const [period, setPeriod] = useState<RankingPeriod>("now");
  const [metric, setMetric] = useState<RankingMetric>("energy");
  const [updateInterval, setUpdateInterval] = useState("5");
  const [lastUpdate, setLastUpdate] = useState(() => new Date());

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState(new Date().getHours());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [viewYear, setViewYear] = useState(new Date().getFullYear());

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();

  const ranking = useMemo(
    () =>
      [...initialServices].sort((a, b) =>
        metric === "energy"
          ? b.energy - a.energy
          : b.co2e - a.co2e,
      ),
    [metric],
  );

  // Recalcula os dias somente quando o mês ou o ano exibido mudar.
  const calendarDays = useMemo<(number | null)[]>(() => {
    const daysInMonth = new Date(
      viewYear,
      viewMonth + 1,
      0,
    ).getDate();

    const firstWeekDay = new Date(
      viewYear,
      viewMonth,
      1,
    ).getDay();

    return [
      ...Array.from({ length: firstWeekDay }, () => null),
      ...Array.from(
        { length: daysInMonth },
        (_, index) => index + 1,
      ),
    ];
  }, [viewYear, viewMonth]);

  function handlePeriodChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextPeriod = event.target.value as RankingPeriod;

    setPeriod(nextPeriod);

    if (nextPeriod !== "now") {
      // Abre o calendário no período atual.
      setViewMonth(currentMonth);
      setViewYear(currentYear);
      setCalendarOpen(true);
    } else {
      setCalendarOpen(false);
    }
  }

  function handleUpdateIntervalChange(
    event: ChangeEvent<HTMLSelectElement>,
  ) {
    setUpdateInterval(event.target.value);
  }

  function handleRefresh() {
    setLastUpdate(new Date());
  }

  function closeCalendar() {
    setCalendarOpen(false);
  }

  function changeMonth(direction: number) {
    // "Esse mês" fica limitado ao mês atual.
    if (period === "month") {
      return;
    }

    const nextDate = new Date(
      viewYear,
      viewMonth + direction,
      1,
    );

    const nextYear = nextDate.getFullYear();
    const nextMonth = nextDate.getMonth();

    if (
      nextYear > currentYear ||
      (nextYear === currentYear && nextMonth > currentMonth) ||
      nextYear < 2010
    ) {
      return;
    }

    setViewMonth(nextMonth);
    setViewYear(nextYear);
  }

  function confirmDay(day: number) {
    setSelectedDay(day);
    setSelectedMonth(viewMonth);
    setSelectedYear(viewYear);
    closeCalendar();
  }

  function confirmMonth(month: number) {
    setSelectedMonth(month);
    setSelectedYear(currentYear);
    closeCalendar();
  }

  function confirmYear(year: number) {
    setSelectedYear(year);
    closeCalendar();
  }

  function confirmHour(hour: number) {
    setSelectedHour(hour);
    closeCalendar();
  }

  const periodLabel: Record<RankingPeriod, string> = {
    now: "Agora",
    today: `Hoje às ${String(selectedHour).padStart(2, "0")}:00`,
    month: `${selectedDay} de ${monthNames[selectedMonth]} de ${selectedYear}`,
    year: `${monthNames[selectedMonth]} de ${selectedYear}`,
    "other-years": String(selectedYear),
  };

  const formattedLastUpdate = timeFormatter.format(lastUpdate);

  return (
    <div className="ranking-page">
      <AppHeader />

      <main className="ranking-main">
        <div className="ranking-intro-box">
          <section className="ranking-intro">
            <div className="ranking-heading">
              <h1>Ranking</h1>
              <p>Veja o ranking de desempenho dos serviços.</p>
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
                  <option value="other-years">Outros anos</option>
                </select>
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

                    <td>{numberFormatter.format(service.energy)} kWh</td>

                    <td>{numberFormatter.format(service.co2e)} kg CO₂e</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="ranking-table-caption">
            <span>Período selecionado: {periodLabel[period]}</span>
            <span>{ranking.length} serviços demonstrativos</span>
          </div>
        </section>
      </main>

      <footer className="ranking-footer">
        Desenvolvido por Atmos ° © 2026
      </footer>

      {calendarOpen && (
        <div
          className="ranking-calendar-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeCalendar();
            }
          }}
        >
          <section
            className="ranking-calendar-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ranking-calendar-title"
          >
            <button
              type="button"
              className="ranking-calendar-close"
              onClick={closeCalendar}
              aria-label="Fechar calendário"
            >
              ×
            </button>

            <h2 id="ranking-calendar-title">
              {period === "today" && "Escolha um horário"}
              {period === "month" && "Escolha uma data"}
              {period === "year" && "Escolha um mês"}
              {period === "other-years" && "Escolha um ano"}
            </h2>

            {period === "month" && (
              <>
                <div className="ranking-calendar-navigation">
                  <button
                    type="button"
                    onClick={() => changeMonth(-1)}
                    aria-label="Mês anterior"
                    disabled
                  >
                    ‹
                  </button>

                  <strong>
                    {monthNames[viewMonth]} {viewYear}
                  </strong>

                  <button
                    type="button"
                    onClick={() => changeMonth(1)}
                    aria-label="Próximo mês"
                    disabled
                  >
                    ›
                  </button>
                </div>

                <div className="ranking-calendar-panel">
                  <div className="ranking-calendar-days">
                    {weekDays.map((day, index) => (
                      <span key={`${day}-${index}`}>{day}</span>
                    ))}

                    {calendarDays.map((day, index) =>
                      day === null ? (
                        <span
                          className="ranking-calendar-empty"
                          key={`empty-${index}`}
                        />
                      ) : (
                        <button
                          type="button"
                          key={day}
                          disabled={
                            viewYear === currentYear &&
                            viewMonth === currentMonth &&
                            day > currentDay
                          }
                          className={
                            day === selectedDay &&
                            viewMonth === selectedMonth &&
                            viewYear === selectedYear
                              ? "is-selected"
                              : ""
                          }
                          onClick={() => confirmDay(day)}
                        >
                          {day}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              </>
            )}

            {period === "today" && (
              <div className="ranking-calendar-panel">
                <div className="ranking-calendar-options ranking-calendar-hour-options">
                  {hours.map((hour) => (
                    <button
                      type="button"
                      key={hour}
                      className={
                        selectedHour === hour ? "is-selected" : ""
                      }
                      onClick={() => confirmHour(hour)}
                    >
                      {String(hour).padStart(2, "0")}:00
                    </button>
                  ))}
                </div>
              </div>
            )}

            {period === "year" && (
              <div className="ranking-calendar-panel">
                <div className="ranking-calendar-options ranking-calendar-month-options">
                  {monthNames.map((month, index) => (
                    <button
                      type="button"
                      key={month}
                      className={
                        selectedMonth === index ? "is-selected" : ""
                      }
                      onClick={() => confirmMonth(index)}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {period === "other-years" && (
              <div className="ranking-calendar-panel">
                <div className="ranking-calendar-options ranking-calendar-year-options">
                  {availableYears.map((year) => (
                    <button
                      type="button"
                      key={year}
                      className={
                        selectedYear === year ? "is-selected" : ""
                      }
                      onClick={() => confirmYear(year)}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              className="ranking-calendar-confirm"
              onClick={closeCalendar}
            >
              Confirmar seleção
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
